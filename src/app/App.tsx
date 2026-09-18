import { useState } from 'react';
import { SolarSimulator } from '@/app/components/SolarSimulator';
import { EVConnectorSimulator } from '@/app/components/EVConnectorSimulator';
import { Zap, Sun } from 'lucide-react';

type Tab = 'solar' | 'ev';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('solar');

  return (
    <div>
      {/* Tab switcher */}
      <div className="bg-[#0C2638] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 flex gap-1 pt-2">
          <button
            onClick={() => setActiveTab('solar')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all ${
              activeTab === 'solar'
                ? 'bg-white text-[#0C2638]'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sun className="w-4 h-4" />
            Solar
          </button>
          <button
            onClick={() => setActiveTab('ev')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all ${
              activeTab === 'ev'
                ? 'bg-white text-[#0C2638]'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap className="w-4 h-4" />
            Conector EV
          </button>
        </div>
      </div>

      {activeTab === 'solar' ? <SolarSimulator /> : <EVConnectorSimulator />}
    </div>
  );
}
