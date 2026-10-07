import { useState, useEffect, useRef } from 'react';
import {
  Sun,
  ArrowRight,
  Phone,
  Mail,
  SunMedium,
  TrendingDown,
  Leaf,
  Info,
  X,
  ZoomIn,
  Lock,
  MapPin,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import consumptionImageIcon from '../assets/consumption_image_icon.png';
import { showSolarAlert } from './alert-custom';
import { useVisibleFrame, isPhoneViewport } from '@/app/hooks/useVisibleFrame';

function AdabTechLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 742.55 148.55"
      className={className}
      aria-label="Adab.Tech"
    >
      <path fill="#f5992b" d="M43.43,89.31h37.88l-19.02-56.35-18.85,56.35ZM92.71,123.1l-8.02-23.75h-44.62l-7.95,23.75h-11.21L54.3,23.34h16.23l33.39,99.75h-11.21Z"/>
      <path fill="#f5992b" d="M149.6,56.36c-5.34,0-9.82,1.34-13.31,3.98-3.48,2.62-6.09,6.22-7.76,10.68-1.65,4.4-2.49,9.38-2.49,14.82s.85,10.51,2.52,14.93c1.7,4.48,4.29,8.08,7.72,10.71,3.45,2.64,7.82,3.98,12.97,3.98s9.71-1.3,13.14-3.88c3.41-2.56,5.96-6.13,7.59-10.61,1.6-4.42,2.41-9.51,2.41-15.13s-.82-10.77-2.45-15.17c-1.65-4.46-4.18-8-7.52-10.51-3.36-2.53-7.66-3.8-12.82-3.8M147.69,125.21c-6.88,0-12.86-1.73-17.76-5.13-4.92-3.42-8.77-8.15-11.44-14.06-2.69-5.94-4.05-12.73-4.05-20.18s1.36-14.23,4.05-20.15c2.67-5.89,6.52-10.59,11.43-13.99,4.9-3.38,10.85-5.1,17.69-5.1s12.89,1.71,17.6,5.09c1.48,1.06,2.91,2.31,4.25,3.72l1.5,1.57V23.34h10.88v99.76h-9.48v-10.22l-1.53,1.87c-1.68,2.04-3.57,3.82-5.62,5.31-4.71,3.42-10.61,5.16-17.53,5.16"/>
      <path fill="#f5992b" d="M250.79,85.19c-2.58.37-5.14.73-7.67,1.05-4.02.53-7.8,1.08-11.23,1.63-3.51.56-6.73,1.26-9.58,2.06-2.15.68-4.17,1.58-6.01,2.66-1.91,1.12-3.48,2.55-4.65,4.27-1.2,1.77-1.81,3.93-1.81,6.44,0,2.21.57,4.35,1.7,6.35,1.13,2.02,2.92,3.68,5.29,4.93,2.35,1.24,5.43,1.86,9.18,1.86,4.62,0,8.69-.85,12.11-2.52,3.42-1.67,6.21-3.92,8.31-6.67,2.09-2.75,3.47-5.8,4.11-9.07.65-2.33,1.04-5.02,1.14-7.96.05-1.58.09-2.97.11-4.17l.02-1.02-1.01.14ZM224.09,125.21c-5.51,0-10.17-1.02-13.85-3.03-3.67-2.01-6.48-4.68-8.33-7.95-1.86-3.28-2.81-6.93-2.81-10.85s.73-7.19,2.16-9.96c1.44-2.78,3.51-5.14,6.18-7.02,2.71-1.91,5.98-3.43,9.72-4.53,3.54-.96,7.59-1.83,12.02-2.55,4.45-.72,9.02-1.4,13.58-2,2.93-.39,5.73-.77,8.43-1.14l.78-.1-.03-.78c-.19-5.91-1.63-10.47-4.27-13.54-2.98-3.45-8.13-5.19-15.31-5.19-4.75,0-8.97,1.11-12.54,3.3-3.42,2.09-5.91,5.39-7.41,9.81l-10.28-3.1c1.84-6.07,5.23-10.92,10.08-14.43,5.09-3.68,11.91-5.54,20.28-5.54,6.74,0,12.59,1.21,17.41,3.61,4.74,2.36,8.2,5.98,10.27,10.74,1.04,2.27,1.71,4.75,1.98,7.39.28,2.71.42,5.59.42,8.54v46.21h-9.4v-13.9l-1.59,2.44c-2.47,3.79-5.56,6.83-9.17,9.01-5,3.02-11.16,4.56-18.3,4.56"/>
      <path fill="#f5992b" d="M314.79,56.36c-5.1,0-9.4,1.28-12.78,3.8-3.36,2.51-5.9,6.05-7.55,10.51-1.62,4.4-2.45,9.51-2.45,15.17s.81,10.71,2.41,15.13c1.63,4.49,4.18,8.06,7.59,10.61,3.42,2.57,7.84,3.88,13.14,3.88s9.51-1.34,12.96-3.98c3.43-2.63,6.03-6.23,7.72-10.71,1.67-4.42,2.52-9.44,2.52-14.93s-.85-10.42-2.52-14.83c-1.7-4.46-4.3-8.05-7.75-10.67-3.48-2.64-7.95-3.98-13.28-3.98M316.7,125.21c-6.93,0-12.82-1.73-17.53-5.16-2.05-1.49-3.95-3.28-5.62-5.31l-1.54-1.87v10.22h-9.47V23.34h10.88v33.64l1.5-1.57c1.35-1.41,2.79-2.67,4.28-3.73,4.74-3.38,10.65-5.09,17.58-5.09s12.8,1.71,17.73,5.1c4.94,3.39,8.79,8.1,11.43,13.99,2.66,5.92,4.01,12.7,4.01,20.15s-1.35,14.25-4.01,20.19c-2.64,5.91-6.49,10.64-11.43,14.05-4.93,3.41-10.92,5.13-17.8,5.13"/>
      <polygon fill="#1ab8d6" points="447.03 123.1 447.03 33.52 412.42 33.52 412.42 23.34 492.45 23.34 492.45 33.52 457.84 33.52 457.84 123.1 447.03 123.1"/>
      <path fill="#1ab8d6" d="M526.16,56.14c-7.99,0-14.17,2.62-18.36,7.8-3.12,3.85-5.1,8.99-5.87,15.3l-.12.97h47.05l-.11-.96c-.7-6.75-2.58-12.08-5.56-15.84-3.82-4.82-9.56-7.27-17.03-7.27M526.3,125.21c-7.27,0-13.71-1.63-19.11-4.84-5.4-3.22-9.67-7.77-12.68-13.55-3.02-5.79-4.55-12.66-4.55-20.42s1.51-15.28,4.49-21.21c2.96-5.91,7.15-10.53,12.46-13.74,5.31-3.21,11.64-4.84,18.83-4.84s13.87,1.73,19.08,5.14c5.21,3.41,9.18,8.35,11.8,14.69,2.56,6.19,3.71,13.63,3.45,22.13h-58.47l.06.92c.48,7.45,2.55,13.45,6.14,17.83,4.19,5.12,10.23,7.72,17.93,7.72,5.17,0,9.73-1.2,13.56-3.58,3.64-2.26,6.57-5.49,8.72-9.61l10.44,3.6c-2.87,6.12-7.12,10.95-12.63,14.36-5.78,3.59-12.35,5.4-19.53,5.4"/>
      <path fill="#1ab8d6" d="M608.62,125.21c-7.5,0-13.95-1.7-19.16-5.04-5.21-3.34-9.26-8.02-12.02-13.91-2.78-5.92-4.21-12.77-4.25-20.36.05-7.71,1.51-14.62,4.35-20.51,2.83-5.86,6.92-10.51,12.16-13.81,5.24-3.3,11.65-4.97,19.06-4.97,7.82,0,14.64,1.94,20.27,5.77,5.37,3.65,9.09,8.66,11.07,14.91l-10.8,3.25c-1.72-4.21-4.37-7.55-7.89-9.95-3.73-2.53-8.03-3.81-12.79-3.81-5.38,0-9.88,1.28-13.4,3.79-3.51,2.51-6.15,6.01-7.85,10.4-1.68,4.33-2.55,9.35-2.6,14.93.09,8.63,2.13,15.68,6.06,21,3.98,5.4,9.97,8.14,17.79,8.14,5.14,0,9.46-1.2,12.86-3.57,3.21-2.24,5.74-5.46,7.52-9.58l11.02,2.88c-2.57,6.46-6.49,11.49-11.66,14.97-5.42,3.64-12.06,5.49-19.74,5.49"/>
      <path fill="#1ab8d6" d="M710.69,123.1v-37.26c0-3.61-.34-7.15-1-10.53-.68-3.41-1.83-6.54-3.41-9.29-1.62-2.8-3.85-5.04-6.62-6.66-2.78-1.62-6.3-2.44-10.48-2.44-3.26,0-6.25.57-8.9,1.69-2.68,1.13-5,2.83-6.91,5.06-1.91,2.22-3.39,5.05-4.43,8.41-1.03,3.34-1.55,7.3-1.55,11.78v39.23h-10.96V23.34h9.54v37.01l1.57-2.12c2.22-3.01,4.95-5.49,8.1-7.34,4.66-2.75,10.24-4.14,16.58-4.14,4.79,0,8.91.76,12.26,2.25,3.35,1.49,6.16,3.51,8.38,5.99,2.23,2.51,4,5.32,5.28,8.35,1.28,3.07,2.2,6.26,2.73,9.46.53,3.23.8,6.29.8,9.09v41.21h-10.95Z"/>
      <path fill="#1ab8d6" d="M410.7,79.56c0,9.25-7.5,16.75-16.75,16.75s-16.76-7.5-16.76-16.75,7.5-16.75,16.76-16.75,16.75,7.5,16.75,16.75"/>
    </svg>
  );
}
const SOLAR_API_BASE = 'https://simulador-adabtech-1faf32f78070.herokuapp.com/api';
const SOLAR_SIMULATOR_ID = 'cc7110e6-0e5d-443e-858d-b4a77db9246b';
const SOLAR_SIMULATOR_KEY = 'DtivwlVNvffJCBU7qQZUQ8Rn8gItHptS';
const QUOTE_REDIRECT_URL = 'https://adabtech.com/forms/quote';

type LocationMode = 'idle' | 'detecting' | 'detected' | 'manual';

type QuoteFormData = {
  name: string;
  contactType: 'whatsapp' | 'email';
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  department: string;
  location_maps: string;
};

type GeoCoords = { lat: number; lon: number };

type MunicipalityOption = {
  municipality: string;
  department?: string;
  region_name?: string;
};

type RegionSuggestion = {
  region_id: string | number;
  display: string;
  region_name: string;
  hsp_avg?: number;
  tariff_cop_per_kwh?: number;
};

const emptyQuoteForm = (): QuoteFormData => ({
  name: '',
  contactType: 'whatsapp',
  whatsapp: '',
  email: '',
  address: '',
  city: '',
  department: '',
  location_maps: '',
});

function solarApiBase() {
  const base = SOLAR_API_BASE.replace(/\/$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
}

function cleanPlaceName(value: string) {
  return (value || '')
    .replace(/^per[ií]metro\s+urbano\s+(de\s+)?/i, '')
    .replace(/^zona\s+urbana\s+(de\s+)?/i, '')
    .replace(/^area\s+metropolitana\s+(de\s+)?/i, '')
    .replace(/^área\s+metropolitana\s+(de\s+)?/i, '')
    .replace(/^municipio\s+de\s+/i, '')
    .replace(/^distrito\s+de\s+/i, '')
    .trim();
}

async function reverseGeocode(lat: number, lon: number) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es`
  );
  const data = await response.json();
  const address = data.address || {};
  const city =
    [address.city, address.town, address.municipality, address.village, address.county, data.name]
      .map((part: string | undefined) => cleanPlaceName((part || '').trim()))
      .filter(Boolean)[0] || '';
  const street = [
    cleanPlaceName((address.road || '').trim()),
    cleanPlaceName((address.house_number || '').trim()),
    cleanPlaceName((address.neighbourhood || address.suburb || address.quarter || '').trim()),
  ]
    .filter(Boolean)
    .join(', ');
  const department = cleanPlaceName((address.state || address.region || address.state_district || '').trim());
  const label = [address.road, address.neighbourhood || address.suburb || address.quarter, city, department]
    .filter(Boolean)
    .join(', ');
  return { address: street, city, department, label };
}

async function submitSolarQuote(payload: Record<string, unknown>) {
  try {
    const response = await fetch(`${solarApiBase()}/quotations/from-simulator/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Simulator-Key': SOLAR_SIMULATOR_KEY,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error(`Error ${response.status}:`, await response.text());
      return false;
    }
    return !!(await response.json()).id;
  } catch (error) {
    console.error('Error submitting quote:', error);
    return false;
  }
}

export function SolarSimulator() {
  // --- ESTADOS ---
  const [consumption, setConsumption] = useState(300);
  const [inputValue, setInputValue] = useState('300');
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [tarifaEnergia, setTarifaEnergia] = useState(900);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado persistente del formulario
  const [formData, setFormData] = useState<QuoteFormData>(emptyQuoteForm);
  const [locationMode, setLocationMode] = useState<LocationMode>('idle');
  const [coords, setCoords] = useState<GeoCoords | null>(null);
  const [regionSuggestions, setRegionSuggestions] = useState<RegionSuggestion[]>([]);
  const [regionId, setRegionId] = useState<string | number | null>(null);
  const [sunHours, setSunHours] = useState(3.5);
  const [panelPowerW, setPanelPowerW] = useState(620);
  const [areaPerPanelM2, setAreaPerPanelM2] = useState(3.3);
  const [municipalities, setMunicipalities] = useState<MunicipalityOption[]>([]);
  const [showMunicipalityList, setShowMunicipalityList] = useState(false);

  // --- REFERENCIAS (REFS) ---
  const municipalitySearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const municipalityBoxRef = useRef<HTMLDivElement>(null);

  // --- CONSTANTES DE NEGOCIO ---
  const CONSTANTS = {
    INTERCEPTO: 12127227.5,
    PENDIENTE: 25341.4494,
    FACTOR_RETAIL: 1.3728,
    FACTOR_INDUSTRIAL: 1.0848
  };

  // --- LÓGICA DE CÁLCULO ---
  const calculateResults = (consumo: number) => {
    // Forzamos que el cálculo use al menos 300 aunque el estado diga menos
    const consumoValidado = Math.max(300, consumo);

    const potenciaPico = (consumoValidado / 30) / sunHours;
    const paneles = Math.ceil((potenciaPico * 1000) / panelPowerW);
    const area = Math.round(paneles * areaPerPanelM2 * 100) / 100;
    const precioBase = CONSTANTS.INTERCEPTO + (CONSTANTS.PENDIENTE * consumoValidado);
    const factor = consumoValidado <= 3000 ? CONSTANTS.FACTOR_RETAIL : CONSTANTS.FACTOR_INDUSTRIAL;

    return {
      precio: Math.round(precioBase * factor),
      paneles,
      area,
      potenciaPico: parseFloat(potenciaPico.toFixed(2)),
      ahorro: Math.round(consumoValidado * tarifaEnergia),
    };
  };

  const results = calculateResults(consumption);

  // --- HANDLERS DE CONSUMO (SOLUCIONA ERRORES DE BOTONES +/-) ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setConsumption(Math.max(300, Math.min(30000, numValue)));
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    const finalValue = isNaN(numValue) ? consumption : Math.max(300, Math.min(30000, numValue));
    setConsumption(finalValue);
    setInputValue(finalValue.toString());
  };

  const handleIncrement = () => {
    const newValue = Math.min(30000, consumption + 100);
    setConsumption(newValue);
    setInputValue(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(300, consumption - 100);
    setConsumption(newValue);
    setInputValue(newValue.toString());
  };

  // --- LÓGICA DE ETIQUETAS (SOLUCIONA ERROR getConsumptionLabel) ---
  const getConsumptionLevel = () => {
    if (consumption < 1000) return 'bajo';
    if (consumption < 3000) return 'medio';
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

  const showAlert = async (icon: any, title: string, message: string) => {
    setIsAlertOpen(true); // Activa el centrado en el useEffect
    return await showSolarAlert(icon, title, message); // Llama a tu función de figma/src/app/components/alert-custom.tsx
  };

  const detectRegion = async (city: string) => {
    if (!city.trim()) return;
    try {
      const response = await fetch(`${solarApiBase()}/quotations/simulator-detect-region/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Simulator-Key': SOLAR_SIMULATOR_KEY,
        },
        body: JSON.stringify({ city, simulatorId: SOLAR_SIMULATOR_ID }),
      });
      const data = await response.json();
      if (data.matched_by === 'ambiguous' && data.suggestions?.length) {
        setRegionSuggestions(data.suggestions);
      } else {
        setRegionSuggestions([]);
        if (data.region?.id) {
          setRegionId(data.region.id);
          if (data.region.hsp_avg) setSunHours(data.region.hsp_avg);
          if (data.region.tariff_cop_per_kwh) setTarifaEnergia(data.region.tariff_cop_per_kwh);
        }
      }
    } catch {
      // Producción ignora el fallo y deja la simulación con los valores actuales.
    }
  };

  const detectLocation = () => {
    setLocationMode('detecting');
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const place = await reverseGeocode(latitude, longitude);
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      setCoords({ lat: latitude, lon: longitude });
      setFormData((prev) => ({
        ...prev,
        address: place.address,
        city: place.city,
        department: place.department,
        location_maps: mapsUrl,
      }));
      setLocationMode('detected');
      if (place.city) detectRegion(place.city);
    }, () => {
      setLocationMode('manual');
    }, { timeout: 10000 });
  };

  const formatDetectedLocation = () =>
    [formData.address, formData.city, formData.department].map((part) => part.trim()).filter(Boolean).join(', ');

  const onDetectedLocationChange = (value: string) => {
    setFormData({ ...formData, address: value, city: '', department: '' });
    setRegionSuggestions([]);
    setRegionId(null);
  };

  const onManualAddressChange = (value: string) => {
    onDetectedLocationChange(value);
    if (municipalitySearchTimer.current) clearTimeout(municipalitySearchTimer.current);
    if (value.trim().length < 2) {
      setMunicipalities([]);
      setShowMunicipalityList(false);
      return;
    }
    municipalitySearchTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `${solarApiBase()}/quotations/simulator-municipalities/?q=${encodeURIComponent(value.trim())}`,
          { headers: { 'X-Simulator-Key': SOLAR_SIMULATOR_KEY } }
        );
        if (!response.ok) return;
        const list: MunicipalityOption[] = await response.json();
        setMunicipalities(list);
        setShowMunicipalityList(list.length > 0);
      } catch {
        setMunicipalities([]);
      }
    }, 280);
  };

  const selectMunicipality = (item: MunicipalityOption) => {
    const address = item.department ? `${item.municipality}, ${item.department}` : item.municipality;
    setFormData((prev) => ({
      ...prev,
      address,
      city: item.municipality,
      department: item.department || '',
    }));
    setShowMunicipalityList(false);
    setMunicipalities([]);
    setRegionSuggestions([]);
    detectRegion(item.municipality);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmail = formData.contactType === 'email';
    const contactValue = isEmail ? formData.email : formData.whatsapp;

    // --- VALIDACIONES POR CASOS ---

    // --- NUEVA VALIDACIÓN DE CONSUMO MÍNIMO ---
    if (consumption < 300) {
      setShowQuoteForm(false);
      showAlert('error', 'Consumo insuficiente', 'El consumo mínimo para realizar la simulación es de 300 kWh/mes.');
      return;
    }

    // Caso 1: Nombre vacío o muy corto
    if (formData.name.trim().length < 3) {
      setShowQuoteForm(false);
      showAlert('error', 'Nombre incompleto', 'Por favor, ingresa tu nombre completo.');
      return; // Detiene la ejecución aquí
    }

    // Caso 2: Validación de Email
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // 1. Extraemos el dominio completo
      const domain = contactValue.split('@')[1]?.toLowerCase() || "";

      // 2. Definimos dominios y TLDs prohibidos según RFC 2606
      const reservedDomains = ['example.com', 'example.net', 'example.org'];
      const reservedTLDs = ['.test', '.example', '.invalid', '.localhost'];

      const isReservedDomain = reservedDomains.includes(domain);
      const isReservedTLD = reservedTLDs.some(tld => domain.endsWith(tld));

      if (!emailRegex.test(contactValue) || isReservedDomain || isReservedTLD) {

        let errorMsg = 'La dirección de correo electrónico no es correcta.';
        if (isReservedDomain || isReservedTLD) {
          errorMsg = 'Parece que estás usando un dominio de prueba. Por seguridad, requerimos una dirección de correo activa.';
        }

        setShowQuoteForm(false);
        showAlert('error', 'Correo inválido', errorMsg);
        return;
      }
    }

    // Caso 3: Validación de Teléfono (WhatsApp)
    else {
      const phoneRegex = /^\d{7,15}$/;
      // Verifica si todos los números son iguales (ej: "9999999")
      const isAllSameDigits = contactValue.split('').every(char => char === contactValue[0]);

      if (!phoneRegex.test(contactValue) || isAllSameDigits) {
        setShowQuoteForm(false);
        showAlert(
          'error',
          'Teléfono inválido',
          isAllSameDigits
            ? 'El número no puede contener solo dígitos repetidos.'
            : 'El número debe tener entre 7 y 15 dígitos numéricos.'
        );
        return;
      }
    }

    const locationIsValid = locationMode === 'manual'
      ? formData.address.trim().length > 2
      : formData.city.trim().length >= 2 || formData.department.trim().length >= 2;

    if (!locationIsValid) {
      setShowQuoteForm(false);
      showAlert('error', 'Ubicación incompleta', 'Ingresa una dirección válida para ubicar la instalación.');
      return;
    }

    const locationLabel = locationMode === 'manual' ? formData.address : formatDetectedLocation();
    const cityValue = formData.city.trim() || locationLabel.trim();
    const departmentValue = formData.department.trim();

    setIsSubmitting(true);

    const payload = {
      clientData: {
        name: formData.name,
        contact: contactValue,
        contactType: formData.contactType,
        segmento: consumption <= 3000 ? 'Hogar' : 'Empresa',
        ciudad: locationLabel.trim() || cityValue,
        departamento: departmentValue
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

    const quotePayload = {
      clientName: formData.name,
      email: formData.email,
      phone: formData.whatsapp,
      city: locationLabel.trim() || cityValue,
      department: departmentValue,
      location_maps: formData.location_maps || locationLabel,
      regionId: regionId ?? undefined,
      monthlyConsumption: consumption,
      estimatedInvestment: results.precio,
      panelCount: results.paneles,
      requiredArea: results.area,
      peakPower: results.potenciaPico,
      simulatorId: SOLAR_SIMULATOR_ID,
    };

    try {
      const [googleResult] = await Promise.all([
        fetch(`${window.location.origin}/submit-to-google.php/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then((response) => response.json()).catch(() => null),
        submitSolarQuote(quotePayload).catch(() => null),
      ]);

      if (googleResult?.status === 'success') {
        setShowQuoteForm(false);
        const successMsg = isEmail
          ? 'Tu propuesta llegará pronto a tu correo. ¡No olvides revisar tu bandeja!'
          : '¡Perfecto! Te enviaremos un mensaje por WhatsApp en breve.';

        showAlert('success', '¡Recibido!', successMsg);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setFormData(emptyQuoteForm());
        setRegionSuggestions([]);
        setRegionId(null);
        setConsumption(300);
        setInputValue('300');

        if (window.top) {
          window.top.location.href = QUOTE_REDIRECT_URL;
        } else {
          window.location.href = QUOTE_REDIRECT_URL;
        }
      } else {
        showAlert('error', 'Error de servidor', 'No pudimos procesar los datos. Intenta más tarde.');
      }
    } catch {
      showAlert('error', 'Error de conexión', 'No hubo respuesta del servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- EFECTOS ---
  useEffect(() => {
    setInputValue(consumption.toString());
  }, [consumption]);

  // Este efecto se encarga de avisarle a WordPress que mueva el scroll
  useEffect(() => {
    if (showQuoteForm || showModal || isAlertOpen) {
      window.parent.postMessage({ type: 'SOLAR_SIM_CENTER_MODAL' }, '*');

      if (isAlertOpen) {
        setTimeout(() => setIsAlertOpen(false), 100);
      }
    }
  }, [showQuoteForm, showModal, isAlertOpen]);

  // Reporta la altura real del contenido al padre (iframe WordPress)
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    const reportHeight = () => {
      const height = Math.ceil(root.getBoundingClientRect().height);
      if (height < 100) return;
      try {
        window.parent.postMessage({ type: 'resize', height }, '*');
      } catch {
        // El simulador no está embebido.
      }
    };
    reportHeight();
    const observer = new ResizeObserver(reportHeight);
    observer.observe(root);
    const timer = window.setInterval(reportHeight, 800);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  const visibleBox = useVisibleFrame(showQuoteForm || showModal);
  const isPhone = isPhoneViewport();
  const modalGutter = visibleBox.height < 700 ? 12 : 20;
  const modalMaxHeight = Math.max(160, visibleBox.height - modalGutter * 2);

  useEffect(() => {
    if (!showQuoteForm || !isPhone) return;
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') return;
      window.setTimeout(() => {
        target.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'nearest' });
      }, 120);
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, [showQuoteForm, isPhone, visibleBox.height]);

  useEffect(() => {
    const fetchTarifa = async () => {
      try {
        // Usamos window.location.origin para que funcione en local y producción automáticamente
        const response = await fetch(`${window.location.origin}/submit-to-google.php`, {
          method: 'GET'
        });

        const result = await response.json();

        if (result.status && result.data) {
          // Convertimos a número por seguridad
          setTarifaEnergia(Number(result.data));
        }
      } catch (error) {
        console.error("Error obteniendo la tarifa:", error);
        // Si falla, se queda con el valor por defecto (900) para no romper la simulación
      }
    };

    fetchTarifa();
  }, []);

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (municipalityBoxRef.current && !municipalityBoxRef.current.contains(event.target as Node)) {
        setShowMunicipalityList(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  useEffect(() => {
    const fetchSimulatorConfig = async () => {
      try {
        const response = await fetch(`${solarApiBase()}/quotations/simulator-config/${SOLAR_SIMULATOR_ID}/`, {
          headers: { 'X-Simulator-Key': SOLAR_SIMULATOR_KEY },
        });
        if (!response.ok) return;
        const config = await response.json();
        if (config.panelPowerW) setPanelPowerW(config.panelPowerW);
        if (config.areaPerPanelM2) setAreaPerPanelM2(config.areaPerPanelM2);
        if (config.sunHoursPerDay) setSunHours(config.sunHoursPerDay);
      } catch {
        // Si falla, se quedan los valores por defecto de producción.
      }
    };

    fetchSimulatorConfig();
  }, []);

  // --- HELPERS ---
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="bg-black font-[Manrope]">
      {/* Header */}
      <header className="bg-black">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <AdabTechLogo className="h-9 w-auto" />
          <div className="flex items-center gap-2 bg-[#F49A2B]/15 border border-[#F49A2B]/30 rounded-full px-4 py-1.5">
            <Sun className="w-4 h-4 text-[#F49A2B]" />
            <span className="text-[#F49A2B] text-xs font-bold tracking-widest uppercase">
              Simulador Solar
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-black relative overflow-hidden">
        <div
          className="absolute -top-20 -right-40 w-[600px] h-56 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(244,154,43,0.22) 0%, rgba(255,180,50,0.12) 45%, rgba(200,80,20,0.06) 75%, transparent 100%)',
            filter: 'blur(48px)',
            transform: 'rotate(-15deg)',
          }}
        />
        <div
          className="absolute top-1/3 -left-32 w-72 h-40 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(220,80,40,0.18) 0%, rgba(244,154,43,0.10) 50%, transparent 100%)',
            filter: 'blur(40px)',
            transform: 'rotate(10deg)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-[340px] h-12 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,200,60,0.14), rgba(244,154,43,0.16), transparent)',
            filter: 'blur(20px)',
            transform: 'rotate(-8deg)',
          }}
        />
        <div
          className="absolute -bottom-10 left-1/4 w-80 h-40 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(220,100,20,0.14) 0%, rgba(244,154,43,0.08) 55%, transparent 100%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute bottom-8 right-12 w-20 h-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(26,184,215,0.10) 0%, transparent 70%)',
            filter: 'blur(16px)',
          }}
        />

        <div className="max-w-4xl mx-auto px-5 pt-6 md:pt-14 pb-5 md:pb-10 relative">
          <div className="flex items-center justify-center mb-4 md:mb-8">
            <div className="inline-flex items-center gap-2.5 bg-[#F49A2B]/10 border border-[#F49A2B]/25 rounded-full px-5 py-2">
              <span className="w-2 h-2 rounded-full bg-[#F49A2B] animate-pulse" />
              <span className="text-[#F49A2B] text-xs font-bold tracking-widest uppercase">
                Solución de energía solar
              </span>
            </div>
          </div>

          <div className="text-center mb-3 md:mb-5">
            <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-[1.15] tracking-tight mb-2 md:mb-4">
              Genera tu propia energía y<br />
              <span className="text-[#F49A2B]">ahorra desde el primer mes</span>
            </h1>
            <p className="text-white/55 text-base md:text-xl max-w-xl mx-auto leading-relaxed font-light">
              Calcula cuánto puedes ahorrar con energía solar y obtén en tiempo real la inversión y el sistema ideal para tu hogar o empresa.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 my-4 md:my-10">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-[#1AB8D7]/25 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[#1AB8D7]/50" />
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-[#1AB8D7]/25 to-transparent" />
          </div>

          <div className="hidden md:grid grid-cols-3 gap-4 mb-10">
            {[
              {
                icon: TrendingDown,
                title: 'Ahorro desde el primer mes',
                desc: 'Reduce tu factura de servicios y protégete de las alzas de tarifas.',
                accent: 'orange',
              },
              {
                icon: SunMedium,
                title: 'Energía limpia y propia',
                desc: 'Genera electricidad renovable en tu techo y disminuye tu huella de carbono.',
                accent: 'orange',
              },
              {
                icon: Leaf,
                title: 'Acompañamiento continuo',
                desc: 'La instalación es solo el comienzo. Mantenemos tu sistema produciendo al máximo.',
                accent: 'cyan',
              },
            ].map(({ icon: Icon, title, desc, accent }) => (
              <div
                key={title}
                className={`flex gap-4 bg-white/4 border rounded-2xl px-5 py-5 transition-all group ${
                  accent === 'orange'
                    ? 'border-[#F49A2B]/12 hover:bg-white/7 hover:border-[#F49A2B]/25'
                    : 'border-white/8 hover:bg-white/7 hover:border-[#1AB8D7]/20'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    accent === 'orange'
                      ? 'bg-[#F49A2B]/15 group-hover:bg-[#F49A2B]/25'
                      : 'bg-[#1AB8D7]/15 group-hover:bg-[#1AB8D7]/25'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${accent === 'orange' ? 'text-[#F49A2B]' : 'text-[#1AB8D7]'}`}
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <h3 className="text-white text-sm font-bold mb-1">{title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-[#F49A2B]/70 text-xs font-bold tracking-widest uppercase animate-pulse">
              Calcula tu sistema solar
            </span>
            <button
              type="button"
              onClick={() =>
                document.querySelector('input[type="number"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
              className="flex flex-col items-center gap-1 animate-bounce cursor-pointer focus:outline-none"
              aria-label="Ir al simulador"
            >
              <div className="w-px h-5 bg-gradient-to-b from-transparent to-[#F49A2B]/60" />
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-[#F49A2B]/70">
                <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Main card */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 pb-8">
        <div className="rounded-3xl border border-white/10 bg-[rgba(30,30,30,0.6)] backdrop-blur-md overflow-hidden">
          <div className="md:flex md:flex-row">
            {/* Left: Input */}
            <div className="p-8 md:p-10 flex flex-col justify-between md:flex-1">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-[#F49A2B]/15 flex items-center justify-center flex-shrink-0">
                    <Sun className="w-4 h-4 text-[#F49A2B]" />
                  </div>
                  <h2 className="text-white text-lg font-extrabold leading-snug">
                    ¿Cuántos kWh consumes al mes?
                  </h2>
                </div>
                <div className="flex items-start gap-1.5 mb-5 pl-13">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Es el consumo en kWh que aparece en tu factura de energía. Si no lo tienes a la mano, elige un valor aproximado.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="flex-shrink-0 p-1 rounded-full bg-[#F49A2B]/10 border border-[#F49A2B]/30 text-[#F49A2B] hover:bg-[#F49A2B]/20 transition-colors mt-0.5"
                    aria-label="Ver ejemplo de factura"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 mb-5">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    aria-label="Disminuir consumo"
                    className="w-13 h-13 rounded-xl border-2 border-[#F49A2B] text-[#F49A2B] flex items-center justify-center hover:bg-[#F49A2B]/10 active:scale-95 transition-all text-2xl font-light select-none"
                  >
                    −
                  </button>
                  <div className="flex flex-col items-center gap-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      min="300"
                      max="30000"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className="w-32 h-20 text-center text-4xl font-extrabold text-white border-2 border-white/10 rounded-xl focus:border-[#F49A2B] focus:outline-none focus:ring-4 focus:ring-[#F49A2B]/20 transition-all bg-black/40 placeholder:text-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-slate-400 text-xs font-semibold tracking-wide">kWh / mes</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    aria-label="Aumentar consumo"
                    className="w-13 h-13 rounded-xl bg-[#F49A2B] text-white flex items-center justify-center hover:bg-[#d9841f] active:scale-95 transition-all text-2xl font-light select-none shadow-lg shadow-[#F49A2B]/30"
                  >
                    +
                  </button>
                </div>

                <div className="mb-2 px-1">
                  <div className="flex justify-between mb-1.5 px-0.5">
                    <span className="text-white/50 text-[10px] font-semibold">Bajo</span>
                    <span className="text-white/50 text-[10px] font-semibold">Medio</span>
                    <span className="text-white/50 text-[10px] font-semibold">Alto</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="30000"
                    step="50"
                    value={consumption}
                    onChange={(e) => setConsumption(Number(e.target.value))}
                    className="w-full h-2 appearance-none cursor-pointer rounded-full outline-none solar-slider"
                    style={{
                      background: 'linear-gradient(90deg, #1ab8d7 0%, #facc15 35%, #fb923c 70%, #f97316 100%)',
                    }}
                  />
                  <div className="flex justify-between mt-1.5 px-0.5">
                    <span className="text-white/40 text-[10px] font-semibold">300 kWh</span>
                    <span className="text-white/40 text-[10px] font-semibold">30 000 kWh</span>
                  </div>
                </div>

                <p className="text-center text-sm text-white/55 mt-2">
                  {getConsumptionLabel()}
                </p>
              </div>
            </div>

            <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            {/* Right: Results */}
            <div className="flex flex-col justify-center md:p-10 md:flex-1">
              <div className="mx-8 mb-8 md:m-0">
                <div className="rounded-2xl bg-gradient-to-br from-[#0C2638] via-[#0d3550] to-[#0e3d5e] p-8 text-center shadow-xl shadow-[#0C2638]/20 relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#F49A2B]/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full bg-[#F49A2B] animate-pulse" />
                      <span className="text-[#F49A2B] text-xs font-bold uppercase tracking-widest">
                        Cotización en vivo · Adab.Tech Solar
                      </span>
                    </div>
                    <p className="text-white/50 text-sm mb-1">Inversión estimada del sistema</p>
                    <div className="text-white text-4xl font-extrabold mb-1 tracking-tight">
                      {formatCurrency(results.precio)}
                    </div>
                    <p className="text-white/40 text-xs mb-4">
                      {consumption} kWh/mes · IVA incluido
                    </p>

                    <div className="flex flex-col gap-2 mb-6">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 rounded-xl p-3">
                          <p className="text-[#F49A2B] text-lg font-extrabold leading-none">{results.paneles}</p>
                          <p className="text-white/50 text-[10px] mt-1">
                            paneles · {results.potenciaPico} kWp
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3">
                          <p className="text-[#F49A2B] text-lg font-extrabold leading-none">{results.area} m²</p>
                          <p className="text-white/50 text-[10px] mt-1">área</p>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                        <p className="text-white/50 text-[10px]">ahorro/mes estimado</p>
                        <p className="text-[#F49A2B] text-base font-extrabold leading-none">
                          {formatCurrency(results.ahorro)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowQuoteForm(true);
                        detectLocation();
                      }}
                      className="w-full py-4 rounded-xl bg-[#F49A2B] text-white font-extrabold text-base flex items-center justify-center gap-2 hover:bg-[#d9841f] active:scale-[0.98] transition-all shadow-lg shadow-[#F49A2B]/25"
                    >
                      <ArrowRight className="w-5 h-5" />
                      Solicitar mi cotización
                    </button>
                    <p className="text-white/30 text-xs mt-3">Sin compromiso · Te contactamos hoy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-4 leading-relaxed max-w-sm mx-auto">
          Los valores son estimativos. Un especialista Adab.Tech confirmará el sistema ideal en una visita gratuita.
        </p>
      </div>

      {/* Invoice lightbox */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] overflow-hidden bg-black/80 backdrop-blur-sm"
          onClick={() => {
            setShowModal(false);
            setIsZoomed(false);
          }}
        >
          <div
            className="absolute flex items-center justify-center overflow-hidden"
            style={{
              top: visibleBox.top,
              left: visibleBox.left,
              width: visibleBox.width,
              height: visibleBox.height,
              padding: modalGutter,
            }}
          >
            <div
              className="relative w-full max-w-xl flex flex-col items-center min-h-0"
              style={{ maxHeight: modalMaxHeight }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setIsZoomed(false);
                }}
                className="absolute -top-12 right-0 p-2.5 rounded-full bg-[#F49A2B]/30 border-2 border-[#F49A2B]/60 text-[#F49A2B] hover:scale-110 transition-all"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              <div
                className="relative rounded-2xl overflow-auto border-2 border-[#F49A2B]/30 bg-[#1e1e1e] w-full"
                style={{
                  maxHeight: Math.max(120, modalMaxHeight - 48),
                  cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                }}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {!isZoomed && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-[#F49A2B]/30 border border-[#F49A2B]/60 text-[#F49A2B] animate-pulse pointer-events-none z-10">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                )}
                <img
                  src={consumptionImageIcon}
                  alt="Consumo en factura"
                  className="w-full h-auto block transition-transform duration-300"
                  style={{
                    transform: isZoomed ? 'scale(1.8)' : 'scale(1)',
                    transformOrigin: 'center center',
                    maxHeight: isZoomed ? undefined : Math.max(120, modalMaxHeight - 48),
                    objectFit: 'contain',
                  }}
                />
              </div>
              <p className="text-center mt-3 text-sm font-medium text-white/70 shrink-0">
                {isZoomed ? 'Haz clic para reducir' : 'Haz clic en la imagen para ampliar'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quote form modal */}
      {showQuoteForm && (
        <div
          className="fixed inset-0 z-[9999] overflow-hidden bg-black/60 backdrop-blur-sm"
          onClick={() => setShowQuoteForm(false)}
        >
          <div
            className={`absolute flex justify-center overflow-hidden ${
              isPhone ? 'items-start' : 'items-center'
            }`}
            style={{
              top: visibleBox.top,
              left: visibleBox.left,
              width: visibleBox.width,
              height: visibleBox.height,
              paddingLeft: modalGutter,
              paddingRight: modalGutter,
              paddingTop: isPhone ? modalGutter : 0,
            }}
          >
            <div
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden min-h-0"
              style={{ maxHeight: modalMaxHeight }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#0C2638] px-6 py-5 flex items-center justify-between shrink-0">
                <div>
                  <p className="text-[#F49A2B] text-xs font-bold uppercase tracking-widest mb-0.5">
                    Adab.Tech Solar
                  </p>
                  <h3 className="text-white text-lg font-extrabold">Solicitar cotización</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuoteForm(false)}
                  className="text-white/40 hover:text-white text-2xl leading-none transition-colors w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>

              <div
                className="quote-modal-scroll min-h-0 overflow-y-auto overscroll-contain"
                style={{ maxHeight: Math.max(120, modalMaxHeight - 88) }}
              >
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div className="bg-[#F49A2B]/8 border border-[#F49A2B]/20 rounded-xl px-4 py-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#0C2638]/55 text-sm">{consumption} kWh/mes</span>
                      <span className="text-[#0C2638] font-extrabold text-sm">
                        {formatCurrency(results.precio)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#F49A2B]/15 pt-1.5">
                      <span className="text-[#0C2638]/55 text-sm">Paneles estimados</span>
                      <span className="text-[#0C2638] font-extrabold text-sm">
                        {results.paneles} paneles
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#0C2638] text-sm font-bold mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Carlos Rodríguez"
                      className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 text-[#0C2638] text-base focus:border-[#F49A2B] focus:outline-none focus:ring-4 focus:ring-[#F49A2B]/15 transition-all bg-slate-50 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0C2638] text-sm font-bold mb-2">
                      ¿Cómo prefiere que lo contactemos?
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, contactType: 'whatsapp' })}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                          formData.contactType === 'whatsapp'
                            ? 'bg-[#0C2638] text-white border-[#0C2638] shadow-md'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, contactType: 'email' })}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                          formData.contactType === 'email'
                            ? 'bg-[#0C2638] text-white border-[#0C2638] shadow-md'
                            : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        Correo
                      </button>
                    </div>

                    {formData.contactType === 'email' ? (
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nombre@correo.com"
                        className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 text-[#0C2638] text-base focus:border-[#F49A2B] focus:outline-none focus:ring-4 focus:ring-[#F49A2B]/15 transition-all bg-slate-50 placeholder:text-slate-400"
                      />
                    ) : (
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="Ej: 300 123 4567"
                        className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 text-[#0C2638] text-base focus:border-[#F49A2B] focus:outline-none focus:ring-4 focus:ring-[#F49A2B]/15 transition-all bg-slate-50 placeholder:text-slate-400"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-[#0C2638] text-sm font-bold mb-2">
                      Ubicación del lugar de instalación
                    </label>

                    {locationMode === 'idle' && (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={detectLocation}
                          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-[#F49A2B]/40 bg-[#F49A2B]/10 text-[#0C2638] text-sm font-bold hover:bg-[#F49A2B]/15 active:scale-[0.98] transition-all"
                        >
                          <MapPin className="w-4 h-4 text-[#F49A2B]" />
                          Detectar mi ubicación
                        </button>
                        <button
                          type="button"
                          onClick={() => setLocationMode('manual')}
                          className="text-center text-slate-400 text-xs font-medium hover:text-[#F49A2B] transition-colors"
                        >
                          Ingresar manualmente
                        </button>
                      </div>
                    )}

                    {locationMode === 'detecting' && (
                      <div className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-slate-200 bg-slate-50">
                        <Loader2 className="w-4 h-4 text-[#F49A2B] animate-spin flex-shrink-0" />
                        <span className="text-slate-500 text-sm">Detectando ubicación…</span>
                      </div>
                    )}

                    {locationMode === 'detected' && (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="text-emerald-600 text-xs font-semibold">
                            Ubicación detectada · puedes editarla
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formatDetectedLocation()}
                            onChange={(e) => onDetectedLocationChange(e.target.value)}
                            placeholder="Dirección, Ciudad, Departamento"
                            className="flex-1 px-4 py-4 rounded-xl border-2 border-emerald-400 text-[#0C2638] text-base focus:border-[#F49A2B] focus:outline-none focus:ring-4 focus:ring-[#F49A2B]/15 transition-all bg-slate-50 placeholder:text-slate-400"
                          />
                          {coords && (
                            <a
                              href={`https://www.google.com/maps?q=${coords.lat},${coords.lon}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Ver en Google Maps"
                              className="flex items-center justify-center px-3 rounded-xl border-2 border-emerald-400 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all shrink-0"
                            >
                              <MapPin className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              address: '',
                              city: '',
                              department: '',
                              location_maps: '',
                            }));
                            setLocationMode('manual');
                          }}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#F49A2B]/40 bg-[#F49A2B]/10 text-[#0C2638] text-sm font-bold hover:bg-[#F49A2B]/15 transition-all"
                        >
                          <MapPin className="w-4 h-4 text-[#F49A2B]" />
                          No estoy en el lugar de instalación
                        </button>
                      </div>
                    )}

                    {locationMode === 'manual' && (
                      <div className="flex flex-col gap-2">
                        <div ref={municipalityBoxRef} className="relative">
                          <input
                            type="text"
                            required
                            value={formData.address}
                            onChange={(e) => onManualAddressChange(e.target.value)}
                            onFocus={() => {
                              if (municipalities.length > 0) setShowMunicipalityList(true);
                            }}
                            onBlur={(e) => {
                              if (!showMunicipalityList) detectRegion(e.target.value);
                            }}
                            placeholder="Ciudad o municipio"
                            className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 text-[#0C2638] text-base focus:border-[#F49A2B] focus:outline-none focus:ring-4 focus:ring-[#F49A2B]/15 transition-all bg-slate-50 placeholder:text-slate-400"
                          />
                          {showMunicipalityList && municipalities.length > 0 && (
                            <div className="absolute top-[calc(100%+2px)] left-0 right-0 z-[100] bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden">
                              {municipalities.map((item, index) => (
                                <button
                                  key={`${item.municipality}-${item.department ?? ''}-${index}`}
                                  type="button"
                                  onMouseDown={(event) => {
                                    event.preventDefault();
                                    selectMunicipality(item);
                                  }}
                                  className="w-full px-4 py-2.5 text-left hover:bg-[#F49A2B]/10 transition-colors flex items-center justify-between gap-2"
                                >
                                  <span className="text-sm text-[#0C2638]">
                                    {item.municipality}
                                    {item.department && (
                                      <span className="text-slate-400 ml-1">— {item.department}</span>
                                    )}
                                  </span>
                                  <span className="text-[11px] text-[#F49A2B] font-semibold whitespace-nowrap">
                                    {item.region_name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <span className="text-slate-400 text-[11px]">
                            Escribe la ciudad y elige de la lista
                          </span>
                          <button
                            type="button"
                            onClick={detectLocation}
                            className="text-xs flex items-center gap-1 text-[#F49A2B] hover:underline shrink-0"
                          >
                            <MapPin className="w-3 h-3" />
                            Usar mi ubicación
                          </button>
                        </div>
                        {regionSuggestions.length > 0 && (
                          <div className="bg-[#F49A2B]/8 border border-[#F49A2B]/25 rounded-xl px-3 py-2.5">
                            <p className="text-[#0C2638] text-xs font-semibold mb-2">
                              Este municipio existe en varias regiones. Selecciona la correcta:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {regionSuggestions.map((suggestion) => (
                                <button
                                  key={suggestion.region_id}
                                  type="button"
                                  onClick={() => {
                                    setRegionId(suggestion.region_id);
                                    setRegionSuggestions([]);
                                    if (suggestion.hsp_avg) setSunHours(suggestion.hsp_avg);
                                    if (suggestion.tariff_cop_per_kwh) {
                                      setTarifaEnergia(suggestion.tariff_cop_per_kwh);
                                    }
                                  }}
                                  className="bg-[#F49A2B]/15 border border-[#F49A2B]/40 rounded-lg px-2.5 py-1 text-xs text-[#0C2638] font-medium hover:bg-[#F49A2B]/25 transition-colors"
                                >
                                  {suggestion.display} → {suggestion.region_name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#0C2638] text-white font-extrabold text-base flex items-center justify-center gap-2 hover:bg-[#0a1f2f] active:scale-[0.98] transition-all shadow-lg shadow-[#0C2638]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#0C2638] disabled:active:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Procesando solicitud...
                      </>
                    ) : (
                      <>
                        <Sun className="w-4 h-4 text-[#F49A2B]" />
                        Enviar solicitud
                      </>
                    )}
                  </button>

                  <div className="text-center space-y-2">
                    <p className="text-slate-400 text-xs inline-flex items-center justify-center gap-1.5 flex-wrap">
                      <Lock className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                      <span>
                        Al enviar este formulario, aceptas nuestra{' '}
                        <a
                          href={`${window.location.origin}/politica-de-privacidad`}
                          target="__blank"
                          rel="noopener noreferrer"
                          className="text-[#F49A2B] font-semibold hover:underline"
                        >
                          Política de Privacidad
                        </a>
                      </span>
                    </p>
                    <p className="text-slate-400 text-xs inline-flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
                      Tus datos están protegidos y no serán compartidos con terceros
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .quote-modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(244, 154, 43, 0.55) transparent;
        }
        .quote-modal-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .quote-modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(244, 154, 43, 0.45);
          border-radius: 999px;
        }
        .solar-slider::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #F49A2B;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(244,154,43,0.55), 0 2px 6px rgba(0,0,0,0.2);
          border: 3px solid rgba(255,255,255,0.6);
          transition: all 0.2s ease;
        }
        .solar-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #F49A2B;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(244,154,43,0.55), 0 2px 6px rgba(0,0,0,0.2);
          border: 3px solid rgba(255,255,255,0.6);
          transition: all 0.2s ease;
        }
        .solar-slider::-webkit-slider-thumb:hover {
          transform: scale(1.12);
          box-shadow: 0 0 24px rgba(244,154,43,0.8), 0 4px 10px rgba(0,0,0,0.25);
        }
      `}</style>
    </div>
  );
}
