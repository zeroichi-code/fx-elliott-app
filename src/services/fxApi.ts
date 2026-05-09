import { Candle, CurrencyPair, TimeFrame } from '../types';

const BASE_URL = 'https://api.twelvedata.com/time_series';

function intervalForTimeFrame(tf: TimeFrame): string {
  switch (tf) {
    case '1min': return '1min';
    case '5min': return '5min';
    case '15min': return '15min';
    case '30min': return '30min';
    case '60min': return '1h';
    case 'daily': return '1day';
    case 'weekly': return '1week';
    default: return '1day';
  }
}

export async function fetchCandles(
  pair: CurrencyPair,
  timeFrame: TimeFrame,
  apiKey: string,
  outputSize: 'compact' | 'full' = 'compact'
): Promise<Candle[]> {
  const interval = intervalForTimeFrame(timeFrame);
  const size = outputSize === 'full' ? 5000 : 200;
  const url = `${BASE_URL}?symbol=${encodeURIComponent(pair)}&interval=${interval}&outputsize=${size}&apikey=${apiKey}&format=JSON`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`APIエラー: ${res.status}`);

  const data = await res.json();

  if (data.status === 'error' || data.code) {
    const msg: string = data.message || '';
    if (data.code === 401 || /api ?key/i.test(msg)) {
      throw new Error('APIキーが無効または制限されています。設定で有効なAPIキーを入力してください。');
    }
    if (data.code === 429 || /limit/i.test(msg)) {
      throw new Error('APIレート制限に達しました。しばらく待ってから再試行してください。');
    }
    throw new Error(msg || 'APIエラーが発生しました。');
  }

  const values = data.values;
  if (!values || !Array.isArray(values) || values.length === 0) {
    throw new Error('データが返されませんでした。通貨ペアまたは時間足を確認してください。');
  }

  return values
    .map((v: Record<string, string>) => ({
      time: v.datetime,
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close),
    }))
    .reverse();
}

export function generateDemoCandles(pair: CurrencyPair, count: number = 100): Candle[] {
  const basePrice = pair.includes('JPY') ? 150.0 : 1.08;
  const candles: Candle[] = [];
  let price = basePrice;
  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const volatility = pair.includes('JPY') ? 0.003 : 0.002;
    const open = price;
    const change = (Math.random() - 0.48) * basePrice * volatility;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * basePrice * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * basePrice * volatility * 0.5;
    price = close;
    candles.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(pair.includes('JPY') ? 3 : 5)),
      high: parseFloat(high.toFixed(pair.includes('JPY') ? 3 : 5)),
      low: parseFloat(low.toFixed(pair.includes('JPY') ? 3 : 5)),
      close: parseFloat(close.toFixed(pair.includes('JPY') ? 3 : 5)),
    });
  }

  return candles;
}
