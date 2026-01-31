import { useState, useEffect, useRef } from 'react';
import { Zap, Grid3x3, Maximize, TrendingUp, X, ZoomIn, ChevronUp, ChevronDown, Info, Lock } from 'lucide-react';
import consumoImage from '../assets/88da93ae54bd930670ffafb5fdbabc0ac277e928.png';
import icono1 from '../assets/88da93ae54bd930670ffafb5fdbabc0ac277e928.png';
import icono2 from '../assets/88da93ae54bd930670ffafb5fdbabc0ac277e928.png';
import icono3 from '../assets/88da93ae54bd930670ffafb5fdbabc0ac277e928.png';
import emailIcon from '../assets/88da93ae54bd930670ffafb5fdbabc0ac277e928.png';
import whatsappIcon from '../assets/88da93ae54bd930670ffafb5fdbabc0ac277e928.png';

export function SolarSimulator() {
  const [consumption, setConsumption] = useState(150);
  const [showModal, setShowModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [inputValue, setInputValue] = useState('150');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    contactType: 'email' as 'email' | 'whatsapp'
  });
  const sliderRef = useRef<HTMLInputElement>(null);
  const consumptionDisplayRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // ============================================
  // CÁLCULOS EXACTOS - ADABTECH
  // INTERPOLACIÓN LINEAL ENTRE VALORES ANCLA
  // ============================================
  
  // Valores ancla fijos (NO MODIFICAR)
  const ANCHOR_MIN = {
    consumo: 150,
    precioCOP: 20643265,
    paneles: 2,
    areaM2: 5,
    potenciaKwp: 1.43
  };
  
  const ANCHOR_MAX = {
    consumo: 15000,
    precioCOP: 402918140,
    paneles: 236,
    areaM2: 590,
    potenciaKwp: 1142.86
  };
  
  /**
   * Interpolación lineal entre dos puntos
   * Fórmula: minValue + ((consumoMensual - 150) / (15000 - 150)) * (maxValue - minValue)
   */
  const interpolate = (consumoMensual: number, minValue: number, maxValue: number): number => {
    const rangeConsumo = ANCHOR_MAX.consumo - ANCHOR_MIN.consumo;
    const rangeValue = maxValue - minValue;
    const offset = consumoMensual - ANCHOR_MIN.consumo;
    
    return minValue + (offset / rangeConsumo) * rangeValue;
  };
  
  /**
   * Calcula todos los parámetros del sistema solar usando interpolación lineal
   * NO usa fórmulas de ingeniería solar
   */
  const calculateResults = (consumoMensual: number) => {
    // Precio COP - interpolación lineal
    const precioCOP = interpolate(
      consumoMensual,
      ANCHOR_MIN.precioCOP,
      ANCHOR_MAX.precioCOP
    );
    
    // Número de paneles - interpolación lineal, redondeado a entero
    const paneles = interpolate(
      consumoMensual,
      ANCHOR_MIN.paneles,
      ANCHOR_MAX.paneles
    );
    
    // Área en m² - interpolación lineal, redondeado a entero
    const areaM2 = interpolate(
      consumoMensual,
      ANCHOR_MIN.areaM2,
      ANCHOR_MAX.areaM2
    );
    
    // Potencia en kWp - interpolación lineal, 2 decimales
    const potenciaKwp = interpolate(
      consumoMensual,
      ANCHOR_MIN.potenciaKwp,
      ANCHOR_MAX.potenciaKwp
    );
    
    // Ahorro mensual estimado (basado en consumo)
    // Asumiendo precio promedio de $650 COP por kWh
    const ahorroMensual = consumoMensual * 650;
    
    return {
      precio: Math.round(precioCOP),
      paneles: Math.round(paneles),
      area: Math.round(areaM2),
      potenciaPico: parseFloat(potenciaKwp.toFixed(2)),
      ahorro: Math.round(ahorroMensual)
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

  const getConsumptionLevel = () => {
    if (consumption < 1000) return 'bajo';
    if (consumption < 5000) return 'medio';
    return 'alto';
  };

  const getConsumptionLabel = () => {
    const level = getConsumptionLevel();
    if (level === 'bajo') return 'Residencial - Consumo bajo';
    if (level === 'medio') return 'Residencial/Comercial - Consumo medio';
    return 'Comercial/Industrial - Consumo alto';
  };

  // Handlers para input manual
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(150, Math.min(15000, numValue));
      setConsumption(clampedValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue)) {
      setInputValue(consumption.toString());
    } else {
      const clampedValue = Math.max(150, Math.min(15000, numValue));
      setConsumption(clampedValue);
      setInputValue(clampedValue.toString());
    }
  };

  const handleIncrement = () => {
    const newValue = Math.min(15000, consumption + 100);
    setConsumption(newValue);
    setInputValue(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(150, consumption - 100);
    setConsumption(newValue);
    setInputValue(newValue.toString());
  };

  // Sincronizar input con consumption
  useEffect(() => {
    setInputValue(consumption.toString());
  }, [consumption]);

  // Microinteractions
  useEffect(() => {
    const slider = sliderRef.current;
    const sliderContainer = sliderContainerRef.current;
    const consumptionDisplay = consumptionDisplayRef.current;
    const ctaButton = ctaButtonRef.current;
    const infoButton = infoButtonRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

    if (!slider || !sliderContainer || !consumptionDisplay || !ctaButton) return;

    let isDragging = false;
    let glowElement: HTMLDivElement | null = null;

    // Slider glow element
    glowElement = document.createElement('div');
    glowElement.style.position = 'absolute';
    glowElement.style.inset = '-4px';
    glowElement.style.borderRadius = '9999px';
    glowElement.style.opacity = '0';
    glowElement.style.pointerEvents = 'none';
    glowElement.style.background = 'linear-gradient(90deg, transparent 0%, rgba(244, 154, 43, 0.4) 50%, transparent 100%)';
    glowElement.style.filter = 'blur(12px)';
    glowElement.style.transition = 'opacity 200ms ease-out';
    sliderContainer.appendChild(glowElement);

    // Slider interactions
    const handleFocus = () => {
      if (glowElement) glowElement.style.opacity = '0.5';
    };

    const handleBlur = () => {
      if (!isDragging && glowElement) glowElement.style.opacity = '0';
    };

    const handleMouseDown = () => {
      isDragging = true;
      if (glowElement) {
        glowElement.style.transition = 'opacity 200ms ease-out';
        glowElement.style.opacity = '0.8';
      }
    };

    const handleInput = () => {
      if (isDragging && consumptionDisplay) {
        consumptionDisplay.style.transition = 'transform 100ms ease-out';
        consumptionDisplay.style.transform = 'scale(1.02)';
        setTimeout(() => {
          consumptionDisplay.style.transform = 'scale(1)';
        }, 100);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      if (glowElement) {
        glowElement.style.transition = 'opacity 300ms ease-out';
        glowElement.style.opacity = '0';
      }
    };

    const handleMouseEnter = () => {
      if (!isDragging && glowElement) glowElement.style.opacity = '0.3';
    };

    const handleMouseLeave = () => {
      if (!isDragging && glowElement) glowElement.style.opacity = '0';
    };

    slider.addEventListener('focus', handleFocus);
    slider.addEventListener('blur', handleBlur);
    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('input', handleInput);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseup', handleMouseUp);

    // CTA button effects
    let buttonGlowContainer: HTMLDivElement | null = null;

    buttonGlowContainer = document.createElement('div');
    buttonGlowContainer.style.position = 'absolute';
    buttonGlowContainer.style.inset = '0';
    buttonGlowContainer.style.borderRadius = 'inherit';
    buttonGlowContainer.style.overflow = 'hidden';
    buttonGlowContainer.style.pointerEvents = 'none';
    buttonGlowContainer.style.zIndex = '0';
    ctaButton.appendChild(buttonGlowContainer);

    const buttonMouseEnter = () => {
      const glow = document.createElement('div');
      glow.style.position = 'absolute';
      glow.style.width = '0';
      glow.style.height = '0';
      glow.style.borderRadius = '50%';
      glow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)';
      glow.style.transform = 'translate(-50%, -50%)';
      glow.style.transition = 'all 400ms ease-out';
      glow.style.left = '50%';
      glow.style.top = '50%';
      
      if (buttonGlowContainer) buttonGlowContainer.appendChild(glow);
      
      requestAnimationFrame(() => {
        glow.style.width = '200%';
        glow.style.height = '200%';
        glow.style.opacity = '0';
      });
      
      setTimeout(() => {
        if (glow.parentElement) glow.remove();
      }, 400);

      ctaButton.style.boxShadow = '0 0 30px rgba(244, 154, 43, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4)';
    };

    const buttonMouseLeave = () => {
      ctaButton.style.boxShadow = '';
    };

    const buttonMouseDown = () => {
      ctaButton.style.transition = 'transform 200ms ease-out';
      ctaButton.style.transform = 'scale(0.98)';
    };

    const buttonMouseUp = () => {
      ctaButton.style.transform = '';
    };

    ctaButton.addEventListener('mouseenter', buttonMouseEnter);
    ctaButton.addEventListener('mouseleave', buttonMouseLeave);
    ctaButton.addEventListener('mousedown', buttonMouseDown);
    ctaButton.addEventListener('mouseup', buttonMouseUp);

    // Info button effects (same as CTA button)
    let infoButtonGlowContainer: HTMLDivElement | null = null;

    if (infoButton) {
      infoButtonGlowContainer = document.createElement('div');
      infoButtonGlowContainer.style.position = 'absolute';
      infoButtonGlowContainer.style.inset = '0';
      infoButtonGlowContainer.style.borderRadius = 'inherit';
      infoButtonGlowContainer.style.overflow = 'hidden';
      infoButtonGlowContainer.style.pointerEvents = 'none';
      infoButtonGlowContainer.style.zIndex = '0';
      infoButton.appendChild(infoButtonGlowContainer);

      const infoButtonMouseEnter = () => {
        const glow = document.createElement('div');
        glow.style.position = 'absolute';
        glow.style.width = '0';
        glow.style.height = '0';
        glow.style.borderRadius = '50%';
        glow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)';
        glow.style.transform = 'translate(-50%, -50%)';
        glow.style.transition = 'all 400ms ease-out';
        glow.style.left = '50%';
        glow.style.top = '50%';
        
        if (infoButtonGlowContainer) infoButtonGlowContainer.appendChild(glow);
        
        requestAnimationFrame(() => {
          glow.style.width = '200%';
          glow.style.height = '200%';
          glow.style.opacity = '0';
        });
        
        setTimeout(() => {
          if (glow.parentElement) glow.remove();
        }, 400);

        infoButton.style.boxShadow = '0 0 30px rgba(244, 154, 43, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4)';
      };

      const infoButtonMouseLeave = () => {
        infoButton.style.boxShadow = '';
      };

      const infoButtonMouseDown = () => {
        infoButton.style.transition = 'transform 200ms ease-out';
        infoButton.style.transform = 'scale(0.98)';
      };

      const infoButtonMouseUp = () => {
        infoButton.style.transform = '';
      };

      infoButton.addEventListener('mouseenter', infoButtonMouseEnter);
      infoButton.addEventListener('mouseleave', infoButtonMouseLeave);
      infoButton.addEventListener('mousedown', infoButtonMouseDown);
      infoButton.addEventListener('mouseup', infoButtonMouseUp);
    }

    return () => {
      slider.removeEventListener('focus', handleFocus);
      slider.removeEventListener('blur', handleBlur);
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('input', handleInput);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseup', handleMouseUp);
      ctaButton.removeEventListener('mouseenter', buttonMouseEnter);
      ctaButton.removeEventListener('mouseleave', buttonMouseLeave);
      ctaButton.removeEventListener('mousedown', buttonMouseDown);
      ctaButton.removeEventListener('mouseup', buttonMouseUp);
      if (glowElement && glowElement.parentElement) glowElement.remove();
      if (buttonGlowContainer && buttonGlowContainer.parentElement) buttonGlowContainer.remove();
      if (infoButtonGlowContainer && infoButtonGlowContainer.parentElement) infoButtonGlowContainer.remove();
    };
  }, []);

  return (
    <section 
      className="relative w-full min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden"
      style={{
        background: '#000000',
        fontFamily: 'Manrope, sans-serif'
      }}
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(26, 184, 215, 0.25) 0%, transparent 70%)' }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight"
            style={{ color: '#F49A2B' }}
          >
            Simula tu sistema solar en minutos
          </h1>
          <h2 
            className="text-2xl md:text-3xl font-semibold mb-5 text-white"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Calcula tu consumo promedio mensual de energía y descubre cuánto puedes ahorrar con energía solar.
          </h2>
          <p 
            className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto"
            style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Montserrat, sans-serif' }}
          >
            Obtén un resultado personalizado en tiempo real. Ajusta el consumo mensual y visualiza de inmediato la inversión estimada, el ahorro mensual y las características del sistema solar ideal para tu hogar o empresa.
          </p>

          {/* Info Button */}
          <div className="mt-6">
            <button
              ref={infoButtonRef}
              onClick={() => setShowModal(true)}
              className="relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm overflow-hidden"
              style={{
                background: 'rgba(30, 30, 30, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#F49A2B',
                cursor: 'pointer',
                position: 'relative',
                fontFamily: 'Montserrat, sans-serif',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Ver dónde aparece el consumo en mi factura</span>
            </button>
          </div>
        </div>

        {/* Main Simulator Card */}
        <div 
          className="relative rounded-2xl p-8 md:p-12 mb-8"
          style={{
            background: 'rgba(30, 30, 30, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Consumption Display */}
          <div className="text-center mb-12">
            {/* Título con icono info */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6 px-4">
              <p 
                className="text-sm md:text-base font-medium uppercase tracking-wider text-center"
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Montserrat, sans-serif' }}
              >
                ¿Cuánta energía consumes al mes?
              </p>
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowModal(true)}
                  onMouseEnter={() => setShowTooltip('question')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="p-1.5 rounded-full transition-all hover:scale-110 flex items-center justify-center"
                  style={{
                    background: 'rgba(244, 154, 43, 0.2)',
                    border: '1px solid rgba(244, 154, 43, 0.4)',
                    color: '#F49A2B',
                    cursor: 'pointer'
                  }}
                  aria-label="Ver ejemplo de factura"
                >
                  <Info className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                
                {/* Tooltip */}
                {showTooltip === 'question' && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap z-50"
                    style={{
                      background: 'rgba(244, 154, 43, 0.95)',
                      color: '#000',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    Ver ejemplo de factura
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45"
                      style={{ background: 'rgba(244, 154, 43, 0.95)' }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="inline-block relative" ref={consumptionDisplayRef}>
              <div 
                className="relative rounded-lg sm:rounded-xl px-2 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-2 mx-auto"
                style={{
                  background: 'rgba(50, 40, 30, 0.5)',
                  borderColor: 'rgba(244, 154, 43, 0.3)',
                  boxShadow: '0 0 20px rgba(244, 154, 43, 0.15)',
                  width: 'fit-content',
                  maxWidth: '95%'
                }}
              >
                <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-4 justify-center">
                  {/* Decrement Button - Soft Style */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={handleDecrement}
                      onMouseEnter={() => setShowTooltip('decrement')}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-md transition-all hover:bg-opacity-30 active:scale-95"
                      style={{
                        background: 'rgba(244, 154, 43, 0.12)',
                        border: '1px solid rgba(244, 154, 43, 0.2)',
                        color: '#F49A2B',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-label="Disminuir consumo"
                    >
                      <ChevronDown className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6" strokeWidth={2} />
                    </button>
                    {showTooltip === 'decrement' && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap z-50"
                        style={{
                          background: 'rgba(244, 154, 43, 0.95)',
                          color: '#000',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 600,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        Disminuir -100 kWh
                        <div
                          className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                          style={{ background: 'rgba(244, 154, 43, 0.95)' }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Input Field - Editable */}
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="number"
                      min="150"
                      max="15000"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      onMouseEnter={() => setShowTooltip('display')}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center bg-transparent border-none outline-none"
                      style={{ 
                        color: '#F49A2B',
                        width: 'auto',
                        minWidth: '80px',
                        maxWidth: '180px',
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield',
                        cursor: 'text'
                      }}
                    />
                    {showTooltip === 'display' && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap z-50"
                        style={{
                          background: 'rgba(244, 154, 43, 0.95)',
                          color: '#000',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 600,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        Haz clic para editar el valor
                        <div
                          className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                          style={{ background: 'rgba(244, 154, 43, 0.95)' }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Increment Button - Soft Style */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={handleIncrement}
                      onMouseEnter={() => setShowTooltip('increment')}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-md transition-all hover:bg-opacity-30 active:scale-95"
                      style={{
                        background: 'rgba(244, 154, 43, 0.12)',
                        border: '1px solid rgba(244, 154, 43, 0.2)',
                        color: '#F49A2B',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-label="Aumentar consumo"
                    >
                      <ChevronUp className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6" strokeWidth={2} />
                    </button>
                    {showTooltip === 'increment' && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2.5 py-1.5 rounded-md text-xs whitespace-nowrap z-50"
                        style={{
                          background: 'rgba(244, 154, 43, 0.95)',
                          color: '#000',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: 600,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        Aumentar +100 kWh
                        <div
                          className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                          style={{ background: 'rgba(244, 154, 43, 0.95)' }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* kWh Label - Outside buttons */}
                  <span 
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium ml-1 sm:ml-2 flex-shrink-0"
                    style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    kWh
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Section */}
          <div className="max-w-3xl mx-auto mb-4">
            <div className="relative px-4 py-3" ref={sliderContainerRef} style={{ position: 'relative' }}>
              <input
                ref={sliderRef}
                type="range"
                min="150"
                max="15000"
                step="50"
                value={consumption}
                onChange={(e) => setConsumption(Number(e.target.value))}
                onMouseEnter={() => setShowTooltip('slider')}
                onMouseLeave={() => setShowTooltip(null)}
                className="w-full h-2 appearance-none cursor-pointer slider-custom"
                style={{
                  background: 'linear-gradient(90deg, #1ab8d7 0%, #facc15 35%, #fb923c 70%, #f97316 100%)',
                  borderRadius: '9999px',
                  outline: 'none'
                }}
              />
              
              {/* Tooltip del slider */}
              {showTooltip === 'slider' && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-0 -mt-12 px-3 py-1.5 rounded-md text-xs whitespace-nowrap z-50"
                  style={{
                    background: 'rgba(244, 154, 43, 0.95)',
                    color: '#000',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Arrastra para ajustar el consumo
                  <div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                    style={{ background: 'rgba(244, 154, 43, 0.95)' }}
                  ></div>
                </div>
              )}
              
              {/* Slider Labels */}
              <div className="flex justify-between mt-3 px-2">
                <span 
                  className="text-sm font-medium"
                  style={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Bajo
                </span>
                <span 
                  className="text-sm font-medium"
                  style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Medio
                </span>
                <span 
                  className="text-sm font-medium"
                  style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Alto
                </span>
              </div>
            </div>

            {/* Consumption Level Label */}
            <div className="text-center mt-2">
              <p 
                className="text-sm"
                style={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: 'Montserrat, sans-serif' }}
              >
                {getConsumptionLabel()}
              </p>
            </div>
          </div>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Investment Card */}
          <div 
            ref={(el) => cardsRef.current[0] = el}
            className="rounded-xl p-6"
            style={{
              background: 'rgba(30, 30, 30, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="relative z-10 flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(244, 154, 43, 0.15)' }}
              >
                <img src={icono1} alt="Inversión" className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div 
                  className="text-xl font-bold mb-1"
                  style={{ color: '#F49A2B' }}
                >
                  {formatCurrency(results.precio).replace(/\s/g, '')}
                </div>
                <div 
                  className="text-xs font-medium mb-1"
                  style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Inversión estimada
                </div>
                <div 
                  className="text-xs"
                  style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  (IVA incluido)
                </div>
              </div>
            </div>
          </div>

          {/* Savings Card */}
          <div 
            ref={(el) => cardsRef.current[1] = el}
            className="rounded-xl p-6"
            style={{
              background: 'rgba(30, 30, 30, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="relative z-10 flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(244, 154, 43, 0.15)' }}
              >
                <img src={icono2} alt="Ahorro" className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div 
                  className="text-xl font-bold mb-1"
                  style={{ color: '#F49A2B' }}
                >
                  {formatCurrency(results.ahorro).replace(/\s/g, '')}
                </div>
                <div 
                  className="text-xs font-medium mb-1"
                  style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Ahorro mensual aprox.
                </div>
                <div 
                  className="text-xs"
                  style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Reducción en factura eléctrica
                </div>
              </div>
            </div>
          </div>

          {/* System Card */}
          <div 
            ref={(el) => cardsRef.current[2] = el}
            className="rounded-xl p-6"
            style={{
              background: 'rgba(30, 30, 30, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="relative z-10 flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(244, 154, 43, 0.15)' }}
              >
                <img src={icono3} alt="Paneles" className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div 
                  className="text-xl font-bold mb-1"
                  style={{ color: '#F49A2B' }}
                >
                  {results.paneles}
                </div>
                <div 
                  className="text-xs font-medium mb-1"
                  style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Paneles solares
                </div>
                <div 
                  className="text-xs"
                  style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  {results.potenciaPico} kWp · {results.area} m² aprox.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="relative inline-block">
            <button
              ref={ctaButtonRef}
              onClick={() => setShowQuoteForm(true)}
              onMouseEnter={() => setShowTooltip('ctaButton')}
              onMouseLeave={() => setShowTooltip(null)}
              className="relative inline-flex items-center justify-center px-10 py-4 rounded-xl font-bold text-lg overflow-hidden"
              style={{
                background: '#F49A2B',
                color: '#000',
                border: 'none',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Cotizar mi sistema solar</span>
            </button>

            {/* Tooltip CTA Button */}
            {showTooltip === 'ctaButton' && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 px-3 py-2 rounded-lg text-sm whitespace-nowrap z-50"
                style={{
                  background: 'rgba(244, 154, 43, 0.95)',
                  color: '#000',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}
              >
                Haz clic para solicitar tu cotización personalizada
                <div
                  className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                  style={{ background: 'rgba(244, 154, 43, 0.95)' }}
                ></div>
              </div>
            )}
          </div>
          
          <p 
            className="mt-4 text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: 'Montserrat, sans-serif' }}
          >
            Atención personalizada · Respuesta garantizada en menos de 24 horas
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 md:p-8"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => {
            setShowModal(false);
            setIsZoomed(false);
          }}
        >
          <div 
            className="relative w-full"
            style={{
              maxWidth: isZoomed ? '900px' : '700px',
              maxHeight: '90vh',
              transition: 'max-width 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
                setIsZoomed(false);
              }}
              className="absolute -top-14 right-0 p-3 rounded-full transition-all hover:scale-110"
              style={{
                background: 'rgba(244, 154, 43, 0.3)',
                border: '2px solid rgba(244, 154, 43, 0.6)',
                color: '#F49A2B',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoom Indicator */}
            {!isZoomed && (
              <div 
                className="absolute top-4 right-4 p-2 rounded-full animate-pulse"
                style={{
                  background: 'rgba(244, 154, 43, 0.3)',
                  border: '1px solid rgba(244, 154, 43, 0.6)',
                  color: '#F49A2B',
                  zIndex: 10,
                  pointerEvents: 'none'
                }}
              >
                <ZoomIn className="w-5 h-5" />
              </div>
            )}

            {/* Image Container */}
            <div 
              className="relative rounded-xl overflow-auto"
              style={{
                background: 'rgba(30, 30, 30, 0.95)',
                border: '2px solid rgba(244, 154, 43, 0.3)',
                cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                maxHeight: '75vh'
              }}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img 
                src={consumoImage} 
                alt="Consumo en factura"
                className="w-full h-auto transition-transform duration-300"
                style={{
                  transform: isZoomed ? 'scale(1.8)' : 'scale(1)',
                  transformOrigin: 'center center',
                  display: 'block'
                }}
              />
            </div>

            {/* Instructions */}
            <p 
              className="text-center mt-4 text-sm font-medium"
              style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontFamily: 'Montserrat, sans-serif' 
              }}
            >
              {isZoomed ? '🔍 Haz clic para reducir' : '🔍 Haz clic en la imagen para ampliar'}
            </p>
          </div>
        </div>
      )}

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 md:p-8"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setShowQuoteForm(false)}
        >
          <div 
            className="relative w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowQuoteForm(false)}
              className="absolute -top-12 right-0 p-2.5 rounded-full transition-all hover:scale-110"
              style={{
                background: 'rgba(244, 154, 43, 0.3)',
                border: '2px solid rgba(244, 154, 43, 0.6)',
                color: '#F49A2B',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Form Container */}
            <div 
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: 'rgba(30, 30, 30, 0.95)',
                border: '2px solid rgba(244, 154, 43, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h3 
                  className="text-2xl md:text-3xl font-bold mb-2"
                  style={{ color: '#F49A2B', fontFamily: 'Manrope, sans-serif' }}
                >
                  Solicita tu cotización
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  Completa tus datos y te enviaremos una cotización personalizada
                </p>
              </div>

              {/* Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                console.log('Form submitted:', { ...formData, consumption, results });
                alert('¡Gracias! Recibirás tu cotización en menos de 24 horas.');
                setShowQuoteForm(false);
                setFormData({ name: '', contact: '', contactType: 'email' });
              }}>
                {/* Name Input */}
                <div className="mb-4">
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2"
                    style={{
                      background: 'rgba(50, 50, 50, 0.8)',
                      border: '1px solid rgba(244, 154, 43, 0.3)',
                      fontFamily: 'Montserrat, sans-serif'
                    }}
                  />
                </div>

                {/* Contact Type Toggle */}
                <div className="mb-4">
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Preferencia de contacto
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, contactType: 'email' })}
                      className="flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-3"
                      style={{
                        background: formData.contactType === 'email' ? '#F49A2B' : 'rgba(50, 50, 50, 0.8)',
                        color: formData.contactType === 'email' ? '#000' : 'rgba(255, 255, 255, 0.7)',
                        border: `1px solid ${formData.contactType === 'email' ? '#F49A2B' : 'rgba(244, 154, 43, 0.3)'}`,
                        fontFamily: 'Montserrat, sans-serif'
                      }}
                    >
                      <img 
                        src={emailIcon} 
                        alt="" 
                        className="w-5 h-5 flex-shrink-0" 
                        style={{
                          filter: formData.contactType === 'email' ? 'none' : 'brightness(0.8)'
                        }}
                      />
                      <span className="flex-1 text-left">Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, contactType: 'whatsapp' })}
                      className="flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-3"
                      style={{
                        background: formData.contactType === 'whatsapp' ? '#F49A2B' : 'rgba(50, 50, 50, 0.8)',
                        color: formData.contactType === 'whatsapp' ? '#000' : 'rgba(255, 255, 255, 0.7)',
                        border: `1px solid ${formData.contactType === 'whatsapp' ? '#F49A2B' : 'rgba(244, 154, 43, 0.3)'}`,
                        fontFamily: 'Montserrat, sans-serif'
                      }}
                    >
                      <img 
                        src={whatsappIcon} 
                        alt="" 
                        className="w-5 h-5 flex-shrink-0" 
                        style={{
                          filter: formData.contactType === 'whatsapp' ? 'none' : 'brightness(0.8)'
                        }}
                      />
                      <span className="flex-1 text-left">WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Contact Input */}
                <div className="mb-6">
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {formData.contactType === 'email' ? 'Correo electrónico' : 'Número de WhatsApp'}
                  </label>
                  <input
                    type={formData.contactType === 'email' ? 'email' : 'tel'}
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder={formData.contactType === 'email' ? 'ejemplo@correo.com' : '+57 300 123 4567'}
                    className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all focus:ring-2"
                    style={{
                      background: 'rgba(50, 50, 50, 0.8)',
                      border: '1px solid rgba(244, 154, 43, 0.3)',
                      fontFamily: 'Montserrat, sans-serif'
                    }}
                  />
                </div>

                {/* Summary */}
                <div 
                  className="mb-6 p-4 rounded-lg"
                  style={{
                    background: 'rgba(244, 154, 43, 0.1)',
                    border: '1px solid rgba(244, 154, 43, 0.3)'
                  }}
                >
                  <p 
                    className="text-xs font-medium mb-2"
                    style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Resumen de tu simulación:
                  </p>
                  <div className="space-y-1">
                    <p 
                      className="text-sm font-bold"
                      style={{ color: '#F49A2B', fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {consumption} kWh/mes · {results.paneles} paneles · {formatCurrency(results.precio)}
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: '#F49A2B',
                    color: '#000',
                    fontFamily: 'Montserrat, sans-serif',
                    boxShadow: '0 4px 12px rgba(244, 154, 43, 0.4)'
                  }}
                >
                  Enviar solicitud
                </button>

                <p 
                  className="text-center text-xs mt-4"
                  style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" strokeWidth={2} />
                    Tus datos están protegidos y no serán compartidos con terceros
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .slider-custom::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #F49A2B;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(244, 154, 43, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 3px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .slider-custom::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #F49A2B;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(244, 154, 43, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 3px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .slider-custom::-webkit-slider-thumb:hover {
          background: #ff9f1a;
          box-shadow: 0 0 30px rgba(244, 154, 43, 0.8), 0 4px 12px rgba(0, 0, 0, 0.4);
          transform: scale(1.1);
        }

        .slider-custom::-moz-range-thumb:hover {
          background: #ff9f1a;
          box-shadow: 0 0 30px rgba(244, 154, 43, 0.8), 0 4px 12px rgba(0, 0, 0, 0.4);
          transform: scale(1.1);
        }

        .slider-custom::-webkit-slider-thumb:active {
          box-shadow: 0 0 40px rgba(244, 154, 43, 1), 0 6px 16px rgba(0, 0, 0, 0.5);
        }

        .slider-custom::-moz-range-thumb:active {
          box-shadow: 0 0 40px rgba(244, 154, 43, 1), 0 6px 16px rgba(0, 0, 0, 0.5);
        }

        /* Ocultar spinners del input number */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </section>
  );
}