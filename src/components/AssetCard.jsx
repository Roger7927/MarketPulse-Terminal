// (c) 2026 Guillermo Roger Hernandez Chandia - ADS

const AssetCard = ({ name, symbol, price, change, isUp, history, color }) => {
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;

  const points = history.map((p, i) => {
    const x = (i * 1440) / (history.length - 1);
    const y = 280 - ((p - min) / range) * 180; 
    return `${x},${y}`;
  }).join(' ');

  const closedPoints = `${points} 1440,320 0,320`;

  return (
    <div className="relative group bg-[#161618] border border-white/5 p-6 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:border-white/20">
      
      {/* GRÁFICO NEON MULTICOR */}
      <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-70 transition-all duration-700">
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`grad-${symbol}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
            </linearGradient>
            
            <filter id={`glow-${symbol}`}>
               <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={color} floodOpacity="1"/>
            </filter>
          </defs>
          
          <polygon fill={`url(#grad-${symbol})`} points={closedPoints} />

          <polyline
            fill="none"
            stroke={color} 
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
            filter={`url(#glow-${symbol})`}
            className="transition-all duration-1000"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black opacity-50 uppercase tracking-[0.3em]" style={{ color: color }}>{name}</span>
            <h3 className="text-3xl font-black text-white mt-1.5 tracking-tighter italic">{symbol}</h3>
          </div>
          <div className={`px-3 py-1 rounded-lg text-[10px] font-black border ${isUp ? 'text-green-400 border-green-500/20 bg-green-500/10' : 'text-red-400 border-red-500/20 bg-red-500/10'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          </div>
        </div>

        <div className="mt-24">
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Live Value</p>
          <p className="text-5xl font-mono font-black text-white tracking-tighter tabular-nums">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;