import { SMA, EMA, RSI, MACD } from "technicalindicators";

export function calculateIndicators(data) {
  const closes = data.map((d) => d.Close);

  const sma = SMA.calculate({ period: 3, values: closes });
  const ema = EMA.calculate({ period: 3, values: closes });
  const rsi = RSI.calculate({ period: 6, values: closes });
  const macd = MACD.calculate({
    values: closes,
    fastPeriod: 5,
    slowPeriod: 8,
    signalPeriod: 3,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  });

  return data.map((d, i) => ({
    ...d,
    SMA: sma[i - (data.length - sma.length)] || null,
    EMA: ema[i - (data.length - ema.length)] || null,
    RSI: rsi[i - (data.length - rsi.length)] || null,
    MACD: macd[i - (data.length - macd.length)]?.MACD || null,
  }));
}
