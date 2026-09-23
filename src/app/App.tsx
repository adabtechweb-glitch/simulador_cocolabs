import { useState } from 'react';
import { SolarSimulator } from '@/app/components/SolarSimulator';
import { EVConnectorSimulator } from '@/app/components/EVConnectorSimulator';
import { Zap, Sun } from 'lucide-react';

type Tab = 'solar' | 'ev';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('solar');

  return (
    <div className="bg-black">
      {/* Tab switcher */}
      <div className="bg-black border-b border-white/15">
        <div className="max-w-4xl mx-auto px-4 flex gap-2 pt-2">
          <button
            onClick={() => setActiveTab('solar')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all ${
              activeTab === 'solar'
                ? 'bg-[#F49A2B]/15 text-[#F49A2B] border border-[#F49A2B]/45 border-b-transparent'
                : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
          >
            <Sun className="w-4 h-4" />
            Solar
          </button>
          <button
            onClick={() => setActiveTab('ev')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all ${
              activeTab === 'ev'
                ? 'bg-[#1AB8D7]/15 text-[#1AB8D7] border border-[#1AB8D7]/45 border-b-transparent'
                : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent'
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
