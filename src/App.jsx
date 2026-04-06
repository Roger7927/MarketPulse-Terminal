// (c) 2026 Guillermo Roger Hernandez Chandia - ADS
import { useState, useEffect } from 'react';
import AssetCard from './components/AssetCard';

function App() {
  const [assets, setAssets] = useState([
    { name: "Bitcoin", symbol: "BTCUSDT", price: 0, history: [0], color: "#F7931A" },
    { name: "Ethereum", symbol: "ETHUSDT", price: 0, history: [0], color: "#627EEA" },
    { name: "Solana", symbol: "SOLUSDT", price: 0, history: [0], color: "#14F195" },
    { name: "Cardano", symbol: "ADAUSDT", price: 0, history: [0], color: "#0033AD" }
  ]);

  const [logs, setLogs] = useState(["CONECTANDO À BINANCE API...", "AGUARDANDO DADOS REAIS..."]);

  // Lógica de ADS: Função para buscar dados externos (Async/Await)
  const fetchPrices = async () => {
    try {
      // Buscando preços de vários ativos de uma vez
      const response = await fetch('https://api.binance.com/api/v3/ticker/price');
      const data = await response.json();

      setAssets(current => current.map(asset => {
        const marketPrice = data.find(item => item.symbol === asset.symbol);
        const newPrice = parseFloat(marketPrice.price);
        
        // Gerenciar o histórico (Fila de 20 pontos)
        const newHistory = asset.history[0] === 0 ? [newPrice] : [...asset.history, newPrice].slice(-20);
        
        return {
          ...asset,
          price: newPrice,
          history: newHistory,
          isUp: newPrice >= (asset.history[asset.history.length - 1] || newPrice),
          change: asset.history[0] !== 0 ? ((newPrice - asset.history[0]) / asset.history[0]) * 100 : 0
        };
      }));

      setLogs(prev => [`[INFO] DADOS ATUALIZADOS VIA BINANCE`, ...prev].slice(0, 5));

    } catch (error) {
      setLogs(prev => [`[ERRO] FALHA NA CONEXÃO: ${error.message}`, ...prev].slice(0, 5));
    }
  };

  useEffect(() => {
    fetchPrices(); // Primeira busca ao ligar o motor
    const timer = setInterval(fetchPrices, 5000); // Atualiza a cada 5 segundos (Tempo Real)
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#080809] text-white p-6 md:p-16 flex flex-col gap-10">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="text-6xl font-black italic tracking-tighter">
            MARKET<span className="text-yellow-500">PULSE</span>
          </h1>
          <p className="text-[10px] font-black text-gray-500 tracking-[0.5em] mt-2 uppercase underline decoration-yellow-500/50">
            DADOS REAIS // BINANCE CLOUD // ITAPEVI v8.0
          </p>
        </div>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {assets.map((asset, idx) => (
          <AssetCard key={idx} {...asset} />
        ))}
      </main>

      <section className="bg-[#111112] border border-white/5 rounded-2xl p-8">
        <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Monitor de Rede (Network)</h2>
        <div className="space-y-2 font-mono text-[10px]">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-4 opacity-70">
              <span className="text-blue-500">[{new Date().toLocaleTimeString()}]</span>
              <span className={log.includes('ERRO') ? 'text-red-500' : 'text-green-500'}>{log}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-[9px] text-gray-800 font-bold uppercase tracking-widest text-center">
        (c) 2026 Guillermo Roger Hernandez Chandia - ADS // API REST INTEGRATED
      </footer>
    </div>
  );
}

export default App;