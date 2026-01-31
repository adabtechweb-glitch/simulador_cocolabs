import { useState } from 'react';
import { Zap, TrendingUp, Grid3x3, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { initMicrointeractions, cleanupMicrointeractions } from './microinteractions.js';

export function SolarQuotationModule() {
  const [consumption, setConsumption] = useState(521);

  // Initialize microinteractions after component mounts
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initMicrointeractions();
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanupMicrointeractions();
    };
  }, []);

  // Calculation logic
  const calculateResults = (kwh: number) => {
    const kwhPrice = 650;
    const systemPowerKwp = (kwh / 120).toFixed(2);
    const panelCount = Math.ceil(parseFloat(systemPowerKwp) / 0.45);
    const requiredArea = panelCount * 2;
    const investment = Math.round(parseFloat(systemPowerKwp) * 3500000);
    const monthlySavings = Math.round(kwh * kwhPrice * 0.85);
    
    return {
      investment,
      monthlySavings,
      systemPowerKwp,
      panelCount,
      requiredArea
    };
  };

  const results = calculateResults(consumption);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden" style={{ backgroundColor: '#0C2638', fontFamily: 'Manrope, sans-serif' }}>
      {/* Aurora-inspired atmospheric background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(244, 154, 43, 0.3) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(26, 184, 215, 0.2) 0%, transparent 70%)' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white leading-tight">
            ¡Simula tu proyecto!
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white/90" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ¿Cuál es tu consumo de energía promedio mensual?
          </h2>
          <p className="text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Obtén un resultado personalizado en tiempo real. Ajusta el dial según tu consumo mensual y visualiza en tiempo real los detalles estimados de tu sistema solar.
          </p>
        </div>

        {/* Main Control Section */}
        <div className="relative mb-12">
          <div className="relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
            {/* Energy flow accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, transparent 0%, #F49A2B 50%, transparent 100%)' }}></div>
            
            {/* Consumption Display - Hero Element */}
            <div className="text-center mb-10">
              <div className="inline-block relative">
                {/* Glow effect behind number */}
                <div className="absolute inset-0 blur-2xl opacity-50" style={{ backgroundColor: '#F49A2B' }}></div>
                
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 rounded-2xl px-12 py-8" data-consumption-display>
                  <div className="flex items-baseline justify-center gap-3">
                    <span className="text-7xl md:text-8xl font-bold tracking-tight text-white" style={{ fontFamily: 'Manrope, sans-serif' }} data-consumption-value>
                      {consumption}
                    </span>
                    <span className="text-3xl md:text-4xl font-medium" style={{ color: '#F49A2B', fontFamily: 'Montserrat, sans-serif' }}>
                      kWh
                    </span>
                  </div>
                  <div className="mt-4 text-sm font-medium text-white/60 uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Consumo mensual
                  </div>
                </div>
              </div>
            </div>

            {/* Precision Slider */}
            <div className="max-w-3xl mx-auto">
              <div className="relative px-4 py-8">
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="10"
                  value={consumption}
                  onChange={(e) => setConsumption(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer energy-slider"
                />
                
                {/* Scale markers */}
                <div className="flex justify-between mt-6 px-1">
                  <div className="text-center">
                    <div className="w-px h-3 bg-white/30 mx-auto mb-2"></div>
                    <span className="text-sm font-medium text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>100</span>
                  </div>
                  <div className="text-center">
                    <div className="w-px h-3 bg-white/30 mx-auto mb-2"></div>
                    <span className="text-sm font-medium text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>300</span>
                  </div>
                  <div className="text-center">
                    <div className="w-px h-3 bg-white/30 mx-auto mb-2"></div>
                    <span className="text-sm font-medium text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>500</span>
                  </div>
                  <div className="text-center">
                    <div className="w-px h-3 bg-white/30 mx-auto mb-2"></div>
                    <span className="text-sm font-medium text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>700</span>
                  </div>
                  <div className="text-center">
                    <div className="w-px h-3 bg-white/30 mx-auto mb-2"></div>
                    <span className="text-sm font-medium text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>900</span>
                  </div>
                </div>
              </div>

              {/* Consumption level indicator */}
              <div className="flex items-center justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/40"></div>
                  <span className="text-sm font-medium text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>Bajo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1AB8D7' }}></div>
                  <span className="text-sm font-medium text-white/70" style={{ fontFamily: 'Montserrat, sans-serif' }}>Medio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F49A2B' }}></div>
                  <span className="text-sm font-medium text-white/80" style={{ fontFamily: 'Montserrat, sans-serif' }}>Alto</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid - Data Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* Investment Panel */}
          <div className="relative group" data-card data-panel>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full hover:border-white/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white/80" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-white/50 uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>Inversión</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2 tracking-tight">
                {formatCurrency(results.investment)}
              </div>
              <div className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                IVA incluido
              </div>
            </div>
          </div>

          {/* Savings Panel - Highlighted */}
          <div className="relative group" data-card data-panel data-panel-highlight>
            <div className="absolute inset-0 rounded-xl blur-lg opacity-30" style={{ background: 'linear-gradient(135deg, #F49A2B, #1AB8D7)' }}></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 rounded-xl p-6 h-full transition-all duration-300" style={{ borderColor: '#F49A2B' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(244, 154, 43, 0.2)' }}>
                  <Zap className="w-5 h-5" style={{ color: '#F49A2B' }} strokeWidth={2} />
                </div>
                <span className="text-sm font-medium uppercase tracking-wider" style={{ color: '#F49A2B', fontFamily: 'Montserrat, sans-serif' }}>Ahorro</span>
              </div>
              <div className="text-3xl font-bold text-white mb-2 tracking-tight">
                {formatCurrency(results.monthlySavings)}
              </div>
              <div className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Mensual estimado
              </div>
            </div>
          </div>

          {/* System Panel */}
          <div className="relative group" data-card data-panel>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full hover:border-white/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Grid3x3 className="w-5 h-5 text-white/80" strokeWidth={2} />
                </div>
                <span className="text-sm font-medium text-white/50 uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>Sistema</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-white mb-1 tracking-tight">{results.panelCount}</div>
                  <div className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>Paneles solares</div>
                </div>
                <div className="h-px bg-white/10"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-bold text-white">{results.systemPowerKwp} kWp</div>
                    <div className="text-xs text-white/50" style={{ fontFamily: 'Montserrat, sans-serif' }}>Potencia</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{results.requiredArea} m²</div>
                    <div className="text-xs text-white/50" style={{ fontFamily: 'Montserrat, sans-serif' }}>Área</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button className="group relative inline-flex items-center gap-3 text-white font-bold px-10 py-5 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden" style={{ backgroundColor: '#F49A2B' }} data-cta-button>
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <span className="relative text-lg">Cotizar mi sistema solar</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <p className="mt-6 text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Sin compromiso · Respuesta en menos de 24 horas
          </p>
        </div>

        {/* Technical footer */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/40" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Cálculo basado en condiciones estándar de irradiación solar en Colombia · 
            Los valores son estimaciones referenciales
          </p>
        </div>
      </div>

      <style>{`
        .energy-slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F49A2B, #e08820);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(244, 154, 43, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 3px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .energy-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #F49A2B, #e08820);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(244, 154, 43, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 3px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .energy-slider::-webkit-slider-thumb:hover {
          background: linear-gradient(135deg, #ff9f1a, #F49A2B);
          box-shadow: 0 0 30px rgba(244, 154, 43, 0.8), 0 4px 12px rgba(0, 0, 0, 0.4);
          transform: scale(1.1);
        }

        .energy-slider::-moz-range-thumb:hover {
          background: linear-gradient(135deg, #ff9f1a, #F49A2B);
          box-shadow: 0 0 30px rgba(244, 154, 43, 0.8), 0 4px 12px rgba(0, 0, 0, 0.4);
          transform: scale(1.1);
        }

        .energy-slider::-webkit-slider-thumb:active {
          box-shadow: 0 0 40px rgba(244, 154, 43, 1), 0 6px 16px rgba(0, 0, 0, 0.5);
        }

        .energy-slider::-moz-range-thumb:active {
          box-shadow: 0 0 40px rgba(244, 154, 43, 1), 0 6px 16px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </section>
  );
}