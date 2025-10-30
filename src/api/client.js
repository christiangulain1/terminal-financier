import Papa from 'papaparse';

// ⚙️ Mode de fonctionnement : 'api' ou 'local'
const MODE = 'local'; // ← change à 'api' pour revenir aux appels Alpha Vantage
const API_KEY = 'demo';

export async function fetchStockData(symbol = 'AAPL') {
  if (MODE === 'local') {
    console.log('📊 Mode DEMO LOCAL activé');
    const response = await fetch('/data/demo.csv');
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, { header: true });
    const data = parsed.data.map(row => ({
      date: row.timestamp,
      open: parseFloat(row.open),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      close: parseFloat(row.close),
      volume: parseInt(row.volume)
    }));

    return data;
  }

  // Sinon, mode API réel
  const response = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${API_KEY}`
  );
  const json = await response.json();

  if (!json['Time Series (Daily)']) {
    throw new Error('Erreur API AlphaVantage ou limite atteinte.');
  }

  const data = Object.entries(json['Time Series (Daily)']).map(([date, values]) => ({
    date,
    open: parseFloat(values['1. open']),
    high: parseFloat(values['2. high']),
    low: parseFloat(values['3. low']),
    close: parseFloat(values['4. close']),
    volume: parseInt(values['6. volume'])
  }));

  return data.reverse();
}