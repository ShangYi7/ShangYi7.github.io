import { NextRequest, NextResponse } from 'next/server';

// 翻譯請求介面
interface TranslateRequest {
  text: string;
  source: string;
  target: string;
}

// 翻譯回應介面
interface TranslateResponse {
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

// Google Translate API 回應格式
interface GoogleTranslateResponse {
  0: Array<[string, string]>;
  2: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json();
    const { text, source = 'auto', target = 'en' } = body;

    // 驗證輸入
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // 如果來源和目標語言相同，直接返回原文
    if (source === target) {
      return NextResponse.json({
        sourceText: text,
        translatedText: text,
        sourceLang: source,
        targetLang: target,
      });
    }

    // 構建 Google Translate API URL
    // 使用免費的 translate.googleapis.com API（Chrome 翻譯擴展使用的同一個）
    const apiUrl = new URL('https://translate.googleapis.com/translate_a/single');
    apiUrl.searchParams.set('client', 'gtx');
    apiUrl.searchParams.set('sl', source);
    apiUrl.searchParams.set('tl', target);
    apiUrl.searchParams.set('dt', 't');
    apiUrl.searchParams.set('q', text);

    // 發送請求到 Google Translate API
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data: GoogleTranslateResponse = await response.json();
    
    // 解析翻譯結果
    let translatedText = '';
    if (data[0] && Array.isArray(data[0])) {
      translatedText = data[0].map(item => item[0]).join('');
    }

    // 檢測到的來源語言
    const detectedSourceLang = data[2] || source;

    const result: TranslateResponse = {
      sourceText: text,
      translatedText: translatedText || text,
      sourceLang: detectedSourceLang,
      targetLang: target,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Translation API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Translation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// 支援 GET 請求（用於測試）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('q') || searchParams.get('text');
  const source = searchParams.get('source') || searchParams.get('sl') || 'auto';
  const target = searchParams.get('target') || searchParams.get('tl') || 'en';

  if (!text) {
    return NextResponse.json(
      { error: 'Text parameter is required' },
      { status: 400 }
    );
  }

  // 重用 POST 邏輯
  const mockRequest = {
    json: async () => ({ text, source, target })
  } as NextRequest;

  return POST(mockRequest);
}