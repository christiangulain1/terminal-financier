import React, { useEffect, useState } from "react";
import { fetchDemoData } from "./api/loadCSV.js";
import { calculateIndicators } from "./api/indicators.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charge le CSV de démo et calcule les indicateurs
        const rawData = await fetchDemoData();
        const processedData = calculateIndicators(rawData);
        setData(processedData);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600">
        Chargement des données financières...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-red-500">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Tableau de bord financier 📊
      </h1>

      {/* Graphique principal */}
      <div className="bg-white p-4 rounded-2xl shadow mb-8">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Close" stroke="#007aff" dot={false} name="Prix de clôture" />
            <Line type="monotone" dataKey="SMA" stroke="#34d399" dot={false} name="Moyenne mobile (SMA)" />
            <Line type="monotone" dataKey="EMA" stroke="#f59e0b" dot={false} name="Moyenne exp (EMA)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau des données */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Clôture</th>
              <th className="px-4 py-2">SMA</th>
              <th className="px-4 py-2">EMA</th>
              <th className="px-4 py-2">RSI</th>
              <th className="px-4 py-2">MACD</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{row.Date}</td>
                <td className="px-4 py-2 text-blue-600">{row.Close?.toFixed(2)}</td>
                <td className="px-4 py-2 text-green-600">{row.SMA?.toFixed(2)}</td>
                <td className="px-4 py-2 text-yellow-600">{row.EMA?.toFixed(2)}</td>
                <td className="px-4 py-2 text-purple-600">{row.RSI?.toFixed(2)}</td>
                <td className="px-4 py-2 text-red-600">{row.MACD?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
