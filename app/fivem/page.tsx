import FivemMonitor from '@/components/fivem/FivemMonitor';

export const metadata = {
  title: 'FiveM 伺服器玩家監控',
  description: '監控固定伺服器在線人數，提供各服與整合曲線圖。',
};

export default function Page() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">FiveM 伺服器玩家監控</h1>
      <p className="text-gray-600">
        本頁面可監控固定伺服器遊玩人數，並同時顯示各個伺服器的曲線圖與合計曲線。
        如需指定伺服器，請在環境變數 <code>NEXT_PUBLIC_FIVEM_SERVERS</code> 填入清單。
      </p>
      <FivemMonitor />
      <div className="text-sm text-gray-500">
        參考：<a className="underline" href="https://blog.cre0809.com/archives/453/" target="_blank" rel="noreferrer">相關統計頁面</a>
      </div>
    </div>
  );
}