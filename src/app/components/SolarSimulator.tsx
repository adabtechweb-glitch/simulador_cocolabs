import { useState, useEffect, useRef } from 'react';
import { Zap, Grid3x3, Maximize, TrendingUp, X, ZoomIn, ChevronUp, ChevronDown, Info, Lock } from 'lucide-react';
import consumptionImageIcon from '../assets/consumption_image_icon.png';
import estimatedInvestmentIcon from '../assets/estimated_investment_icon.svg';
import monthlySavingsIcon from '../assets/monthly_savings_icon.svg';
import solarPanelsIcon from '../assets/solar_panels_icon.svg';
import emailIcon from '../assets/main_icon.svg';
import whatsappIcon from '../assets/whatsapp_icon.svg';
import { showSolarAlert } from './alert-custom';

export function SolarSimulator() {
  // --- ESTADOS ---
  const [consumption, setConsumption] = useState(150);
  const [inputValue, setInputValue] = useState('150');
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Estado persistente del formulario
  const [formData, setFormData] = useState({
    name: '',
    contactType: 'whatsapp' as 'whatsapp' | 'email',
    whatsapp: '', 
    email: ''     
  });

  // --- REFERENCIAS (REFS) ---
  // Se agregan todas las que pide tu JSX para evitar errores de "Cannot find name"
  const sliderRef = useRef<HTMLInputElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const consumptionDisplayRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // --- CONSTANTES DE NEGOCIO ---
  const CONSTANTS = {
    HORAS_EFECTIVAS: 3.5,
    POTENCIA_PANEL_W: 620,
    AREA_POR_PANEL_M2: 3.3,
    INTERCEPTO: 12127227.5,
    PENDIENTE: 25341.4494,
    TARIFA_ENERGIA: 900,
    FACTOR_RETAIL: 1.3248,
    FACTOR_INDUSTRIAL: 1.0848
  };

  // --- LÓGICA DE CÁLCULO ---
  const calculateResults = (consumo: number) => {
    const potenciaPico = (consumo / 30) / CONSTANTS.HORAS_EFECTIVAS;
    const paneles = Math.floor((potenciaPico * 1000) / CONSTANTS.POTENCIA_PANEL_W);
    const area = Math.floor(paneles * CONSTANTS.AREA_POR_PANEL_M2);
    const precioBase = CONSTANTS.INTERCEPTO + (CONSTANTS.PENDIENTE * consumo);
    const factor = consumo <= 3000 ? CONSTANTS.FACTOR_RETAIL : CONSTANTS.FACTOR_INDUSTRIAL;

    return {
      precio: Math.round(precioBase * factor),
      paneles,
      area,
      potenciaPico: parseFloat(potenciaPico.toFixed(2)),
      ahorro: Math.round(consumo * CONSTANTS.TARIFA_ENERGIA),
    };
  };

  const results = calculateResults(consumption);

  // --- HANDLERS DE CONSUMO (SOLUCIONA ERRORES DE BOTONES +/-) ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setConsumption(Math.max(150, Math.min(15000, numValue)));
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    const finalValue = isNaN(numValue) ? consumption : Math.max(150, Math.min(15000, numValue));
    setConsumption(finalValue);
    setInputValue(finalValue.toString());
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

  // --- LÓGICA DE ETIQUETAS (SOLUCIONA ERROR getConsumptionLabel) ---
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

  // --- HANDLERS DEL FORMULARIO ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const targetField = name || formData.contactType;
    setFormData(prev => ({ ...prev, [targetField]: value }));
  };

  const handleContactMethodChange = (method: 'whatsapp' | 'email') => {
    setFormData(prev => ({ ...prev, contactType: method }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmail = formData.contactType === 'email';
    const contactValue = isEmail ? formData.email : formData.whatsapp;

    // --- VALIDACIONES POR CASOS ---

    // Caso 1: Nombre vacío o muy corto
    if (formData.name.trim().length < 3) {
      setShowQuoteForm(false);
      showSolarAlert('error', 'Nombre incompleto', 'Por favor, ingresa tu nombre completo.');
      return; // Detiene la ejecución aquí
    }

    // Caso 2: Validación de Email
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactValue)) {
        setShowQuoteForm(false);
        showSolarAlert('error', 'Correo inválido', 'La dirección de correo electrónico no es correcta.');
        return; // Detiene la ejecución aquí
      }
    } 
    
    // Caso 3: Validación de Teléfono (WhatsApp)
    else {
      const phoneRegex = /^\d{7,15}$/;
      if (!phoneRegex.test(contactValue)) {
        setShowQuoteForm(false);
        showSolarAlert('error', 'Número inválido', 'El número de WhatsApp debe tener entre 7 y 15 dígitos numéricos.');
        return; // Detiene la ejecución aquí
      }
    }

    // --- SI PASA TODAS LAS VALIDACIONES, SE EJECUTA EL ENVÍO ---
    
    const payload = {
      clientData: {
        name: formData.name,
        contact: contactValue,
        contactType: formData.contactType,
        segmento: consumption <= 3000 ? 'Hogar' : 'Empresa',
        ciudad: '',        
        departamento: ''   
      },
      simulationResults: {
        monthlyConsumption: consumption,
        estimatedInvestment: results.precio,
        panelsCount: results.paneles, 
        requiredArea: results.area,
        peakPower: results.potenciaPico,
        monthlySavings: results.ahorro
      }
    };

    try {
      const response = await fetch(`${window.location.origin}/submit-to-google.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setShowQuoteForm(false);
        const successMsg = isEmail
          ? 'Tu propuesta llegará pronto a tu correo. ¡No olvides revisar tu bandeja!' 
          : '¡Perfecto! Te enviaremos un mensaje por WhatsApp en breve.';
          
        showSolarAlert('success', '¡Recibido!', successMsg);

        // Reinicia los campos de texto del formulario
        setFormData({ name: '', contactType: 'whatsapp', whatsapp: '', email: '' });

        // Reinicia el valor del simulador y su campo de texto a 150 (o tu valor inicial)
        setConsumption(150);
        setInputValue('150');
      } else {
        showSolarAlert('error', 'Error de servidor', 'No pudimos procesar los datos. Intenta más tarde.');
      }
    } catch (error) {
      showSolarAlert('error', 'Error de conexión', 'No hubo respuesta del servidor.');
    }
  };

  // --- EFECTOS ---
  useEffect(() => {
    setInputValue(consumption.toString());
  }, [consumption]);

  // Este efecto se encarga de avisarle a WordPress que mueva el scroll
  useEffect(() => {
    // Si cualquiera de los dos modales se abre, avisamos al padre
    if (showQuoteForm || showModal) {
      window.parent.postMessage({ type: 'SOLAR_SIM_CENTER_MODAL' }, '*');
    }
  }, [showQuoteForm, showModal]); // Escucha ambos estados

  // --- HELPERS ---
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  return (
    <section 
      className="relative w-full min-h-screen flex flex-col items-center justify-start px-4 pt-16 pb-16 overflow-hidden"
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
            
            <div className="relative" ref={consumptionDisplayRef}>
              <div 
                className="relative rounded-lg sm:rounded-xl px-3 sm:px-6 py-3 sm:py-4 border-2 mx-auto"
                style={{
                  background: 'rgba(50, 40, 30, 0.5)',
                  borderColor: 'rgba(244, 154, 43, 0.3)',
                  boxShadow: '0 0 20px rgba(244, 154, 43, 0.15)',
                  width: 'max-content',
                  maxWidth: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div className="flex items-center justify-center gap-2 sm:gap-4 flex-nowrap">
                  {/* Decrement Button */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={handleDecrement}
                      onMouseEnter={() => setShowTooltip('decrement')}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md transition-all hover:bg-opacity-30 active:scale-95 flex items-center justify-center"
                      style={{
                        background: 'rgba(244, 154, 43, 0.12)',
                        border: '1px solid rgba(244, 154, 43, 0.2)',
                        color: '#F49A2B',
                        cursor: 'pointer'
                      }}
                      aria-label="Disminuir consumo"
                    >
                      <ChevronDown className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={2} />
                    </button>
                  </div>

                  {/* Input Field + kWh Label Container */}
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <input
                      ref={inputRef}
                      type="number"
                      min="150"
                      max="15000"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center bg-transparent border-none outline-none"
                      style={{ 
                        color: '#F49A2B',
                        width: `${inputValue.toString().length + 0.5}ch`,
                        minWidth: '2ch',
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield',
                        cursor: 'text'
                      }}
                    />
                    <span 
                      className="text-base sm:text-2xl font-medium"
                      style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Montserrat, sans-serif' }}
                    >
                      kWh
                    </span>
                  </div>

                  {/* Increment Button */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={handleIncrement}
                      onMouseEnter={() => setShowTooltip('increment')}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md transition-all hover:bg-opacity-30 active:scale-95 flex items-center justify-center"
                      style={{
                        background: 'rgba(244, 154, 43, 0.12)',
                        border: '1px solid rgba(244, 154, 43, 0.2)',
                        color: '#F49A2B',
                        cursor: 'pointer'
                      }}
                      aria-label="Aumentar consumo"
                    >
                      <ChevronUp className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={2} />
                    </button>
                  </div>
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
            ref={el => { cardsRef.current[0] = el; }}
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
                <img src={estimatedInvestmentIcon} alt="Inversión" className="w-6 h-6" />
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
            ref={el => { cardsRef.current[1] = el; }}
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
                <img src={monthlySavingsIcon} alt="Ahorro" className="w-6 h-6" />
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
            ref={el => { cardsRef.current[2] = el; }}
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
                <img src={solarPanelsIcon} alt="Paneles" className="w-6 h-6" />
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
              /* onClick={handleGoToForm} */
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
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            backdropFilter: 'blur(8px)',
            // Importante: fixed relativo al iframe para que el cálculo 
            // de WordPress lo deje en el centro del viewport
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          onClick={() => {
            setShowModal(false);
            setIsZoomed(false);
          }}
        >
          <div 
            className="relative w-full max-w-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cierre y resto del contenido que ya tienes */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute -top-12 right-0 md:-right-4 p-2 text-orange-500"
            >
              <X size={24} />
            </button>
            
            <img 
              src={consumptionImageIcon} 
              className="w-full h-auto rounded-lg shadow-2xl border border-orange-500/30"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
            
            <p className="mt-4 text-white/60 text-sm">Haz clic afuera para cerrar</p>
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
            {/* Form Container */}
            <div 
              className="rounded-2xl px-6 pb-6 pt-4 md:px-8 md:pb-8 md:pt-2"
              style={{
                background: 'rgba(30, 30, 30, 0.95)',
                border: '2px solid rgba(244, 154, 43, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Contenedor del Botón */}
              <div className="flex justify-end mb-2 md:mt-2"> 
                <button
                  onClick={() => setShowQuoteForm(false)}
                  className="p-1.5 rounded-full transition-all hover:scale-110 active:scale-90"
                  style={{
                    background: 'rgba(244, 154, 43, 0.15)',
                    border: '1px solid rgba(244, 154, 43, 0.4)',
                    color: '#F49A2B',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

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
              <form onSubmit={handleSubmit}>
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
                    name="name"
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
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, contactType: 'email' })}
                      className="flex-1 min-w-[140px] px-3 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                      style={{
                        background: formData.contactType === 'email' ? '#F49A2B' : 'rgba(50, 50, 50, 0.8)',
                        color: formData.contactType === 'email' ? '#000' : 'rgba(255, 255, 255, 0.7)',
                        border: `1px solid ${formData.contactType === 'email' ? '#F49A2B' : 'rgba(244, 154, 43, 0.3)'}`,
                        fontFamily: 'Montserrat, sans-serif'
                      }}
                    >
                      <img src={emailIcon} alt="" className="w-5 h-5 flex-shrink-0" 
                          style={{ filter: formData.contactType === 'email' ? 'none' : 'brightness(0.8)' }} />
                      <span>Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, contactType: 'whatsapp' })}
                      className="flex-1 min-w-[140px] px-3 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                      style={{
                        background: formData.contactType === 'whatsapp' ? '#F49A2B' : 'rgba(50, 50, 50, 0.8)',
                        color: formData.contactType === 'whatsapp' ? '#000' : 'rgba(255, 255, 255, 0.7)',
                        border: `1px solid ${formData.contactType === 'whatsapp' ? '#F49A2B' : 'rgba(244, 154, 43, 0.3)'}`,
                        fontFamily: 'Montserrat, sans-serif'
                      }}
                    >
                      <img src={whatsappIcon} alt="" className="w-5 h-5 flex-shrink-0"
                          style={{ filter: formData.contactType === 'whatsapp' ? 'none' : 'brightness(0.8)' }} />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Contact Input con persistencia */}
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
                    // Aquí conectamos con la llave específica del estado para que no se borre al cambiar
                    value={formData.contactType === 'email' ? formData.email : formData.whatsapp}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      [formData.contactType]: e.target.value 
                    })}
                    placeholder={formData.contactType === 'email' ? 'ejemplo@correo.com' : '300 123 4567'}
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
                  className="mb-6 p-4 rounded-xl"
                  style={{
                    background: 'rgba(244, 154, 43, 0.05)',
                    border: '1px solid rgba(244, 154, 43, 0.2)'
                  }}
                >
                  <p 
                    className="text-[13px] font-bold mb-3 text-center"
                    style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Resumen de tu Simulación
                  </p>
                  
                  <div className="flex flex-row items-center justify-center w-full border-t border-white/5 pt-3 px-2"> 
                    <div 
                      className="flex items-center text-[clamp(10px,3.2vw,14px)] font-bold whitespace-nowrap" 
                      style={{ color: '#F49A2B', fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <span>{consumption} kWh/mes</span>
                      <span className="px-1 opacity-40 text-[10px]">•</span>
                      <span>{results.paneles} paneles</span>
                      <span className="px-1 opacity-40 text-[10px]">•</span>
                      <span>{formatCurrency(results.precio)}</span>
                    </div>
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
                  style={{ color: 'rgb(244, 154, 43)', fontFamily: 'Montserrat, sans-serif' }}
                >
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs">
                    <Lock className="w-3.5 h-3.5" strokeWidth={2} />
                  <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'Montserrat, sans-serif' }}>
                    Al enviar este formulario, aceptas nuestra{" "}
                    <a 
                      href={`${window.location.origin}/politica-de-privacidad`} 
                      target="__blank" 
                      rel="noopener noreferrer" 
                      className="underline hover:text-[#F49A2B] transition-colors"
                      style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      Política de Privacidad
                    </a>
                  </span>
                </span>
                </p>

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