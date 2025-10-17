"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

type ServerConfig = { name: string; id: string; color?: string };
type Snapshot = { players: number; maxPlayers?: number; lastUpdated: string };

function formatTimeLabel(d: Date) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function FivemMonitor() {
  const [servers, setServers] = useState<ServerConfig[]>([]);
  const [seriesMap, setSeriesMap] = useState<Record<string, { t: Date; v: number }[]>>({});
  const [labels, setLabels] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [pollingMs, setPollingMs] = useState(60_000); // 固定 1 分鐘
  const [loading, setLoading] = useState(false);

  const fetchServers = useCallback(async () => {
    try {
      // 先嘗試從 API 獲取數據
      const res = await fetch('/api/fivem/servers');
      if (res.ok) {
        const json = await res.json();
        const list: ServerConfig[] = json.servers ?? [];
        if (list.length > 0) {
          setServers(list);
          // Initialize seriesMap with existing keys
          setSeriesMap((prev) => {
            const next = { ...prev };
            list.forEach((s) => {
              if (!next[s.id]) next[s.id] = [];
            });
            return next;
          });
          return;
        }
      }

      // 如果 API 失敗，使用靜態數據
      try {
        // 在 GitHub Pages 上使用相對路徑
        const staticRes = await fetch('./data/fivem-static.json');
        if (staticRes.ok) {
          const staticData = await staticRes.json();
          const list: ServerConfig[] = staticData.servers ?? [];
          setServers(list);
          // Initialize seriesMap with existing keys
          setSeriesMap((prev) => {
            const next = { ...prev };
            list.forEach((s) => {
              if (!next[s.id]) next[s.id] = [];
            });
            return next;
          });
        }
      } catch (e) {
        console.error('無法獲取伺服器列表', e);
      }
    } catch (e) {
      console.error('無法獲取伺服器列表', e);
    }
  }, []);

  const fetchSnapshot = useCallback(async (id: string): Promise<Snapshot | null> => {
    try {
      // 先嘗試從 API 獲取數據
      const res = await fetch(`/api/fivem/players?id=${encodeURIComponent(id)}`);
      if (res.ok) {
        const json = await res.json();
        return json as Snapshot;
      }

      // 如果 API 失敗，返回 null，讓後續使用靜態數據
      return null;
    } catch (e) {
      return null;
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!servers.length) return;
    try {
      // 先嘗試從 API 獲取數據
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const date = `${y}-${m}-${d}`;
      const res = await fetch(`/api/fivem/logs?date=${date}`);
      let samples: Array<{ timestamp: string; id: string; name?: string; players?: number }> = [];

      if (res.ok) {
        const json = await res.json();
        samples = Array.isArray(json?.samples) ? json.samples : (Array.isArray(json) ? json : []);
      }

      // 如果 API 失敗或返回空數據，嘗試使用靜態數據
      if (samples.length === 0) {
        try {
          const staticRes = await fetch('./data/fivem-static.json');
          if (staticRes.ok) {
            const staticData = await staticRes.json();
            if (Array.isArray(staticData.data)) {
              samples = staticData.data;
            }
          }
        } catch (e) {
          console.error('無法獲取靜態歷史數據', e);
        }
      }

      // 僅保留目前 servers 內的 id
      const validIds = new Set(servers.map((s) => s.id));
      const filtered = samples.filter((s) => s && validIds.has(s.id));
      filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // 建立唯一時間標籤（到分鐘），並映射索引
      const labelsUniq: string[] = [];
      const labelTimes: Date[] = [];
      const labelIdx = new Map<string, number>();
      for (const it of filtered) {
        const dt = new Date(it.timestamp);
        const label = formatTimeLabel(dt);
        if (!labelIdx.has(label)) {
          labelIdx.set(label, labelsUniq.length);
          labelsUniq.push(label);
          labelTimes.push(dt);
        }
      }

      // 依 labels 長度建立每台伺服器的曲線，預設 0
      const nextMap: Record<string, { t: Date; v: number }[]> = {};
      servers.forEach((s) => {
        nextMap[s.id] = labelsUniq.map((_, i) => ({ t: labelTimes[i], v: 0 }));
      });

      // 將樣本填入對應索引
      for (const it of filtered) {
        const dt = new Date(it.timestamp);
        const label = formatTimeLabel(dt);
        const idx = labelIdx.get(label);
        if (idx === undefined) continue;
        const v = typeof it.players === 'number' ? it.players : 0;
        nextMap[it.id][idx] = { t: labelTimes[idx], v };
      }

      setLabels(labelsUniq);
      setSeriesMap(nextMap);
    } catch (e) {
      console.error('獲取歷史數據失敗', e);
    }
  }, [servers]);

  const pollOnce = useCallback(async () => {
    if (!servers.length) return;
    setLoading(true);
    const now = new Date();
    const label = formatTimeLabel(now);

    try {
      // 嘗試從 API 獲取數據
      const snapshots = await Promise.all(servers.map((s) => fetchSnapshot(s.id)));

      // 檢查是否所有快照都為空，如果是則使用靜態數據
      const allNull = snapshots.every(snap => snap === null);

      if (allNull) {
        // 使用靜態數據
        try {
          const staticRes = await fetch('./data/fivem-static.json');
          if (staticRes.ok) {
            const staticData = await staticRes.json();
            if (Array.isArray(staticData.data) && staticData.data.length > 0) {
              // 使用最新的靜態數據作為當前數據
              const latestData = new Map();
              staticData.data.forEach((item: { id: string; timestamp: string; players?: number }) => {
                if (!latestData.has(item.id) || 
                    (latestData.get(item.id) && new Date(latestData.get(item.id).timestamp) < new Date(item.timestamp))) {
                  latestData.set(item.id, item);
                }
              });

              setLabels((prev) => [...prev, label]);
              setSeriesMap((prev) => {
                const next = { ...prev };
                servers.forEach((s) => {
                  const latestItem = latestData.get(s.id);
                  const v = latestItem?.players ?? 0;
                  next[s.id] = [...(next[s.id] ?? []), { t: now, v }];
                });
                return next;
              });
            }
          }
        } catch (e) {
          console.error('無法獲取靜態數據', e);
        }
      } else {
        // 使用 API 數據
        setLabels((prev) => [...prev, label]);
        setSeriesMap((prev) => {
          const next = { ...prev };
          servers.forEach((s, i) => {
            const snap = snapshots[i];
            const v = snap?.players ?? 0;
            next[s.id] = [...(next[s.id] ?? []), { t: now, v }];
          });
          return next;
        });
      }
    } catch (e) {
      console.error('輪詢數據失敗', e);
    } finally {
      setLoading(false);
    }
  }, [servers, fetchSnapshot]);

  const combinedSeries = useMemo(() => {
    if (!servers.length || !labels.length) return [] as number[];
    // Combine by summing latest value per server for each label index
    const length = labels.length;
    const combined: number[] = new Array(length).fill(0);
    servers.forEach((s) => {
      const arr = seriesMap[s.id] ?? [];
      arr.forEach((point, idx) => {
        combined[idx] += point.v;
      });
    });
    return combined;
  }, [labels, servers, seriesMap]);

  const chartData = useMemo(() => {
    const datasets: any[] = servers.map((s, idx) => ({
      label: s.name,
      data: (seriesMap[s.id] ?? []).map((p) => p.v),
      borderColor: s.color || COLORS[idx % COLORS.length],
      backgroundColor: (s.color || COLORS[idx % COLORS.length]) + '33',
      tension: 0.3,
    }));

    // Add combined line
    if (servers.length > 1 && combinedSeries.length) {
      datasets.push({
        label: '整體在線數 (合計)',
        data: combinedSeries,
        borderColor: '#111827',
        backgroundColor: '#11182733',
        tension: 0.25,
        segment: { borderDash: [6, 6] },
      });
    }

    return {
      labels,
      datasets,
    };
  }, [servers, seriesMap, labels, combinedSeries]);

  const latestPerServer = useMemo(() => {
    const m: Record<string, number> = {};
    servers.forEach((s) => {
      const arr = seriesMap[s.id] ?? [];
      m[s.id] = arr.length ? arr[arr.length - 1].v : 0;
    });
    return m;
  }, [servers, seriesMap]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    interaction: { mode: 'nearest' as const, intersect: false },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5 },
      },
    },
  }), []);

  const startPolling = useCallback(() => {
    // First shot immediately
    pollOnce();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(pollOnce, pollingMs);
  }, [pollingMs, pollOnce]);

  const stopPolling = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    fetchServers();
    return () => stopPolling();
  }, [fetchServers, stopPolling]);

  // 自動開始監控：伺服器清單載入後即以 1 分鐘輪詢，並先載入歷史
  useEffect(() => {
    if (servers.length) {
      fetchHistory();
    }
    if (servers.length && !timerRef.current) {
      startPolling();
    }
  }, [servers, startPolling, fetchHistory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-3 py-1.5 rounded-md bg-green-600 text-white">自動監控中</span>
        <span className="text-sm text-gray-700">每 1 分鐘更新</span>
        <span className="text-sm text-gray-500">最近更新：{labels.length ? labels[labels.length - 1] : '—'}</span>
        {loading && <span className="text-sm text-blue-600">更新中…</span>}
      </div>

      <div className="rounded-lg border border-gray-200 p-4 bg-white">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* 即時統計摘要 */}
      <div className="rounded-lg border border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium">即時在線統計</div>
          <div className="text-sm text-gray-500">更新於 {labels.length ? labels[labels.length - 1] : '—'}</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {servers.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2">
              <div className="text-sm text-gray-700">{s.name}</div>
              <div className="text-sm font-semibold" style={{ color: s.color || '#111827' }}>{latestPerServer[s.id] ?? 0} 人</div>
            </div>
          ))}
        </div>
        {servers.length > 1 && (
          <div className="mt-3 flex items-center justify-end text-sm">
            <div className="mr-2 text-gray-600">合計</div>
            <div className="font-semibold">{combinedSeries.length ? combinedSeries[combinedSeries.length - 1] : 0} 人</div>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        若未顯示數據，請在環境變數 <code>NEXT_PUBLIC_FIVEM_SERVERS</code> 設定固定伺服器清單。
      </div>
    </div>
  );
}

const COLORS = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#f43f5e', // rose-500
  '#84cc16', // lime-500
];