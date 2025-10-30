// src/api/indicators.js
import { SMA, RSI } from "technicalindicators";

export function calculateIndicators(data) {
  const closeValues = data.map(d => d.Close);

  const smaValues = SMA.calculate({ period: 3, values: closeValues });
  const rsiValues = RSI.calculate({ period: 3, values: closeValues });

  return data.map((d, i) => ({
    ...d,
    SMA: i >= 2 ? smaValues[i - 2] : null,
    RSI: i >= 2 ? rsiValues[i - 2] : null
  }));
}
