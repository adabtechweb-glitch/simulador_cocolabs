import { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  Ruler,
  BatteryCharging,
  Brain,
  Home,
  TrendingDown,
  MapPin,
  Loader2,
} from "lucide-react";
import { simulateQuotation, createQuotationFromSimulator, type EVSimulateResponse } from "@/app/lib/evApi";
import { useVisibleFrame } from "@/app/hooks/useVisibleFrame";

type LocationMode = "idle" | "detecting" | "detected" | "manual";

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es`
  );
  const data = await res.json();
  const addr = data.address || {};
  const city = addr.city || addr.town || addr.municipality || addr.county || "";
  const parts = [
    addr.road,
    addr.neighbourhood || addr.suburb || addr.quarter,
    city,
    addr.state,
  ].filter(Boolean);
  return (parts as string[]).join(", ") || data.display_name || `${lat}, ${lon}`;
}

function AdabTechLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 742.55 148.55"
      className={className}
      aria-label="Adab.Tech"
    >
      {/* Adab — orange */}
      <path fill="#f5992b" d="M43.43,89.31h37.88l-19.02-56.35-18.85,56.35ZM92.71,123.1l-8.02-23.75h-44.62l-7.95,23.75h-11.21L54.3,23.34h16.23l33.39,99.75h-11.21Z"/>
      <path fill="#f5992b" d="M149.6,56.36c-5.34,0-9.82,1.34-13.31,3.98-3.48,2.62-6.09,6.22-7.76,10.68-1.65,4.4-2.49,9.38-2.49,14.82s.85,10.51,2.52,14.93c1.7,4.48,4.29,8.08,7.72,10.71,3.45,2.64,7.82,3.98,12.97,3.98s9.71-1.3,13.14-3.88c3.41-2.56,5.96-6.13,7.59-10.61,1.6-4.42,2.41-9.51,2.41-15.13s-.82-10.77-2.45-15.17c-1.65-4.46-4.18-8-7.52-10.51-3.36-2.53-7.66-3.8-12.82-3.8M147.69,125.21c-6.88,0-12.86-1.73-17.76-5.13-4.92-3.42-8.77-8.15-11.44-14.06-2.69-5.94-4.05-12.73-4.05-20.18s1.36-14.23,4.05-20.15c2.67-5.89,6.52-10.59,11.43-13.99,4.9-3.38,10.85-5.1,17.69-5.1s12.89,1.71,17.6,5.09c1.48,1.06,2.91,2.31,4.25,3.72l1.5,1.57V23.34h10.88v99.76h-9.48v-10.22l-1.53,1.87c-1.68,2.04-3.57,3.82-5.62,5.31-4.71,3.42-10.61,5.16-17.53,5.16"/>
      <path fill="#f5992b" d="M250.79,85.19c-2.58.37-5.14.73-7.67,1.05-4.02.53-7.8,1.08-11.23,1.63-3.51.56-6.73,1.26-9.58,2.06-2.15.68-4.17,1.58-6.01,2.66-1.91,1.12-3.48,2.55-4.65,4.27-1.2,1.77-1.81,3.93-1.81,6.44,0,2.21.57,4.35,1.7,6.35,1.13,2.02,2.92,3.68,5.29,4.93,2.35,1.24,5.43,1.86,9.18,1.86,4.62,0,8.69-.85,12.11-2.52,3.42-1.67,6.21-3.92,8.31-6.67,2.09-2.75,3.47-5.8,4.11-9.07.65-2.33,1.04-5.02,1.14-7.96.05-1.58.09-2.97.11-4.17l.02-1.02-1.01.14ZM224.09,125.21c-5.51,0-10.17-1.02-13.85-3.03-3.67-2.01-6.48-4.68-8.33-7.95-1.86-3.28-2.81-6.93-2.81-10.85s.73-7.19,2.16-9.96c1.44-2.78,3.51-5.14,6.18-7.02,2.71-1.91,5.98-3.43,9.72-4.53,3.54-.96,7.59-1.83,12.02-2.55,4.45-.72,9.02-1.4,13.58-2,2.93-.39,5.73-.77,8.43-1.14l.78-.1-.03-.78c-.19-5.91-1.63-10.47-4.27-13.54-2.98-3.45-8.13-5.19-15.31-5.19-4.75,0-8.97,1.11-12.54,3.3-3.42,2.09-5.91,5.39-7.41,9.81l-10.28-3.1c1.84-6.07,5.23-10.92,10.08-14.43,5.09-3.68,11.91-5.54,20.28-5.54,6.74,0,12.59,1.21,17.41,3.61,4.74,2.36,8.2,5.98,10.27,10.74,1.04,2.27,1.71,4.75,1.98,7.39.28,2.71.42,5.59.42,8.54v46.21h-9.4v-13.9l-1.59,2.44c-2.47,3.79-5.56,6.83-9.17,9.01-5,3.02-11.16,4.56-18.3,4.56"/>
      <path fill="#f5992b" d="M314.79,56.36c-5.1,0-9.4,1.28-12.78,3.8-3.36,2.51-5.9,6.05-7.55,10.51-1.62,4.4-2.45,9.51-2.45,15.17s.81,10.71,2.41,15.13c1.63,4.49,4.18,8.06,7.59,10.61,3.42,2.57,7.84,3.88,13.14,3.88s9.51-1.34,12.96-3.98c3.43-2.63,6.03-6.23,7.72-10.71,1.67-4.42,2.52-9.44,2.52-14.93s-.85-10.42-2.52-14.83c-1.7-4.46-4.3-8.05-7.75-10.67-3.48-2.64-7.95-3.98-13.28-3.98M316.7,125.21c-6.93,0-12.82-1.73-17.53-5.16-2.05-1.49-3.95-3.28-5.62-5.31l-1.54-1.87v10.22h-9.47V23.34h10.88v33.64l1.5-1.57c1.35-1.41,2.79-2.67,4.28-3.73,4.74-3.38,10.65-5.09,17.58-5.09s12.8,1.71,17.73,5.1c4.94,3.39,8.79,8.1,11.43,13.99,2.66,5.92,4.01,12.7,4.01,20.15s-1.35,14.25-4.01,20.19c-2.64,5.91-6.49,10.64-11.43,14.05-4.93,3.41-10.92,5.13-17.8,5.13"/>
      {/* .Tech — cyan */}
      <polygon fill="#1ab8d6" points="447.03 123.1 447.03 33.52 412.42 33.52 412.42 23.34 492.45 23.34 492.45 33.52 457.84 33.52 457.84 123.1 447.03 123.1"/>
      <path fill="#1ab8d6" d="M526.16,56.14c-7.99,0-14.17,2.62-18.36,7.8-3.12,3.85-5.1,8.99-5.87,15.3l-.12.97h47.05l-.11-.96c-.7-6.75-2.58-12.08-5.56-15.84-3.82-4.82-9.56-7.27-17.03-7.27M526.3,125.21c-7.27,0-13.71-1.63-19.11-4.84-5.4-3.22-9.67-7.77-12.68-13.55-3.02-5.79-4.55-12.66-4.55-20.42s1.51-15.28,4.49-21.21c2.96-5.91,7.15-10.53,12.46-13.74,5.31-3.21,11.64-4.84,18.83-4.84s13.87,1.73,19.08,5.14c5.21,3.41,9.18,8.35,11.8,14.69,2.56,6.19,3.71,13.63,3.45,22.13h-58.47l.06.92c.48,7.45,2.55,13.45,6.14,17.83,4.19,5.12,10.23,7.72,17.93,7.72,5.17,0,9.73-1.2,13.56-3.58,3.64-2.26,6.57-5.49,8.72-9.61l10.44,3.6c-2.87,6.12-7.12,10.95-12.63,14.36-5.78,3.59-12.35,5.4-19.53,5.4"/>
      <path fill="#1ab8d6" d="M608.62,125.21c-7.5,0-13.95-1.7-19.16-5.04-5.21-3.34-9.26-8.02-12.02-13.91-2.78-5.92-4.21-12.77-4.25-20.36.05-7.71,1.51-14.62,4.35-20.51,2.83-5.86,6.92-10.51,12.16-13.81,5.24-3.3,11.65-4.97,19.06-4.97,7.82,0,14.64,1.94,20.27,5.77,5.37,3.65,9.09,8.66,11.07,14.91l-10.8,3.25c-1.72-4.21-4.37-7.55-7.89-9.95-3.73-2.53-8.03-3.81-12.79-3.81-5.38,0-9.88,1.28-13.4,3.79-3.51,2.51-6.15,6.01-7.85,10.4-1.68,4.33-2.55,9.35-2.6,14.93.09,8.63,2.13,15.68,6.06,21,3.98,5.4,9.97,8.14,17.79,8.14,5.14,0,9.46-1.2,12.86-3.57,3.21-2.24,5.74-5.46,7.52-9.58l11.02,2.88c-2.57,6.46-6.49,11.49-11.66,14.97-5.42,3.64-12.06,5.49-19.74,5.49"/>
      <path fill="#1ab8d6" d="M710.69,123.1v-37.26c0-3.61-.34-7.15-1-10.53-.68-3.41-1.83-6.54-3.41-9.29-1.62-2.8-3.85-5.04-6.62-6.66-2.78-1.62-6.3-2.44-10.48-2.44-3.26,0-6.25.57-8.9,1.69-2.68,1.13-5,2.83-6.91,5.06-1.91,2.22-3.39,5.05-4.43,8.41-1.03,3.34-1.55,7.3-1.55,11.78v39.23h-10.96V23.34h9.54v37.01l1.57-2.12c2.22-3.01,4.95-5.49,8.1-7.34,4.66-2.75,10.24-4.14,16.58-4.14,4.79,0,8.91.76,12.26,2.25,3.35,1.49,6.16,3.51,8.38,5.99,2.23,2.51,4,5.32,5.28,8.35,1.28,3.07,2.2,6.26,2.73,9.46.53,3.23.8,6.29.8,9.09v41.21h-10.95Z"/>
      {/* dot between Adab and Tech */}
      <path fill="#1ab8d6" d="M410.7,79.56c0,9.25-7.5,16.75-16.75,16.75s-16.76-7.5-16.76-16.75,7.5-16.75,16.76-16.75,16.75,7.5,16.75,16.75"/>
    </svg>
  );
}
const PRESET_METERS = [20, 30, 40, 50];

function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function EVConnectorSimulator() {
  const [metros, setMetros] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [contactType, setContactType] = useState<"whatsapp" | "email">("whatsapp");
  const [nombre, setNombre] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [locationMode, setLocationMode] = useState<LocationMode>("idle");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [modalSent, setModalSent] = useState(false);
  const [quote, setQuote] = useState<EVSimulateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const metrosNum = parseInt(metros, 10) || 0;
  const isValid = metrosNum > 0;
  const hasQuote = quote !== null;
  const canRequestQuote = hasQuote && !isLoading && !error;

  useEffect(() => {
    if (!(metrosNum > 0)) {
      setQuote(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await simulateQuotation(metrosNum, controller.signal);
        setQuote(result);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setQuote(null);
        setError(
          err instanceof Error
            ? err.message
            : "No pudimos calcular el precio. Intenta de nuevo."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [metrosNum]);

  const handleIncrement = () => setMetros((prev) => String((parseInt(prev, 10) || 0) + 1));

  const handleDecrement = () => {
    const current = parseInt(metros, 10) || 0;
    if (current > 0) setMetros(String(current - 1));
  };

  const handleMetrosChange = (val: string) => {
    if (val === "" || /^\d+$/.test(val)) setMetros(val);
  };

  const handleDetectLocation = () => {
    setLocationMode("detecting");
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const cityName = await reverseGeocode(latitude, longitude);
          setUbicacion(cityName);
          setLocationMode("detected");
        } catch {
          setLocationMode("manual");
          setLocationError("La detección de ubicación falló, por favor ingrésala manualmente.");
        }
      },
      () => {
        setLocationMode("manual");
        setLocationError("La detección de ubicación falló, por favor ingrésala manualmente.");
      },
      { timeout: 10000 }
    );
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!(metrosNum > 0) || !nombre.trim() || !ubicacion.trim() || !contactValue.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createQuotationFromSimulator({
        linearMeters: metrosNum,
        clientName: nombre,
        location: ubicacion,
        ...(contactType === "email"
          ? { clientEmail: contactValue }
          : { clientPhone: contactValue }),
      });
      setModalSent(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "No pudimos enviar tu solicitud. Intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalSent(false);
    setNombre("");
    setContactValue("");
    setUbicacion("");
    setLocationMode("idle");
    setLocationError(null);
    setContactType("whatsapp");
    setSubmitError(null);
    setIsSubmitting(false);
  };

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const reportHeight = () => {
      const height = Math.ceil(root.getBoundingClientRect().height);
      if (height < 100) return;
      try {
        window.parent.postMessage({ type: "resize", height }, "*");
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

  useEffect(() => {
    if (!showModal) return;
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    try {
      window.parent.postMessage({ type: "SOLAR_SIM_CENTER_MODAL" }, "*");
    } catch {
      // Sin página padre, el modal se queda en el viewport del simulador.
    }
    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [showModal]);

  const visibleBox = useVisibleFrame(showModal);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(76);
  const modalGutter = visibleBox.height < 700 ? 12 : 20;
  const modalMaxHeight = Math.max(160, visibleBox.height - modalGutter * 2);
  const formMaxHeight = Math.max(120, modalMaxHeight - headerHeight);

  useLayoutEffect(() => {
    if (!showModal || !headerRef.current) return;
    setHeaderHeight(headerRef.current.offsetHeight);
  }, [showModal, visibleBox.height]);

  return (
    <div className="bg-black font-[Manrope]">
      {/* ── Header ── */}
      <header className="bg-black">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <AdabTechLogo className="h-9 w-auto" />
          <div className="flex items-center gap-2 bg-[#1AB8D7]/15 border border-[#1AB8D7]/30 rounded-full px-4 py-1.5">
            <BatteryCharging className="w-4 h-4 text-[#1AB8D7]" />
            <span className="text-[#1AB8D7] text-xs font-bold tracking-widest uppercase">
              Simulador EV
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(26, 184, 215, 0.25) 0%, transparent 70%)" }}
          />
        </div>
        {/* punto cálido sutil — naranja muy tenue */}
        <div
          className="absolute bottom-8 right-12 w-20 h-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(244,154,43,0.12) 0%, transparent 70%)",
            filter: "blur(16px)",
          }}
        />

        <div className="max-w-4xl mx-auto px-5 pt-6 md:pt-14 pb-5 md:pb-10 relative">
          {/* Category label */}
          <div className="flex items-center justify-center mb-4 md:mb-8">
            <div className="inline-flex items-center gap-2.5 bg-[#1AB8D7]/10 border border-[#1AB8D7]/25 rounded-full px-5 py-2">
              <span className="w-2 h-2 rounded-full bg-[#1AB8D7] animate-pulse" />
              <span className="text-[#1AB8D7] text-xs font-bold tracking-widest uppercase">
                Solución para movilidad eléctrica
              </span>
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center mb-3 md:mb-5">
            <h1 className="text-white text-3xl md:text-5xl font-extrabold leading-[1.15] tracking-tight mb-2 md:mb-4">
              Carga tu vehículo en casa,<br />
              <span className="text-[#1AB8D7]">con total comodidad</span>
            </h1>
            <p className="text-white/55 text-base md:text-xl max-w-xl mx-auto leading-relaxed font-light">
              Sin esperas, sin desplazamientos y con la tranquilidad de iniciar cada día con energía completa.
            </p>
          </div>

          {/* Divider line */}
          <div className="flex items-center justify-center gap-4 my-4 md:my-10">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-[#F49A2B]/25 to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[#F49A2B]/50" />
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-[#F49A2B]/25 to-transparent" />
          </div>

          {/* Value props — ocultas en mobile para que quepa la flecha */}
          <div className="hidden md:grid grid-cols-3 gap-4 mb-10">
            {[
              {
                icon: Brain,
                title: "Carga inteligente",
                desc: "Administra el proceso de carga según tu rutina diaria.",
                accent: "cyan",
              },
              {
                icon: Home,
                title: "Comodidad total",
                desc: "Olvídate de depender de puntos externos.",
                accent: "cyan",
              },
              {
                icon: TrendingDown,
                title: "Ahorro y eficiencia",
                desc: "Optimiza el consumo energético y reduce tus costos de movilidad.",
                accent: "orange",
              },
            ].map(({ icon: Icon, title, desc, accent }) => (
              <div
                key={title}
                className={`flex gap-4 bg-white/4 border rounded-2xl px-5 py-5 transition-all group ${
                  accent === "orange"
                    ? "border-[#F49A2B]/12 hover:bg-white/7 hover:border-[#F49A2B]/25"
                    : "border-white/8 hover:bg-white/7 hover:border-[#1AB8D7]/20"
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  accent === "orange"
                    ? "bg-[#F49A2B]/15 group-hover:bg-[#F49A2B]/25"
                    : "bg-[#1AB8D7]/15 group-hover:bg-[#1AB8D7]/25"
                }`}>
                  <Icon
                    className={`w-5 h-5 ${accent === "orange" ? "text-[#F49A2B]" : "text-[#1AB8D7]"}`}
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

          {/* Scroll cue */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[#1AB8D7]/70 text-xs font-bold tracking-widest uppercase animate-pulse">
              Calcula tu instalación
            </span>
            <button
              onClick={() =>
                document.querySelector('input[type="number"]')?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className="flex flex-col items-center gap-1 animate-bounce cursor-pointer focus:outline-none"
              aria-label="Ir al simulador"
            >
              <div className="w-px h-5 bg-gradient-to-b from-transparent to-[#1AB8D7]/60" />
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-[#1AB8D7]/70">
                <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Main card ── */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 pb-8">
        <div className="rounded-3xl border border-white/10 bg-[rgba(30,30,30,0.6)] backdrop-blur-md overflow-hidden">
          <div className="md:flex md:flex-row">

            {/* ── Columna izquierda: Input ── */}
            <div className="p-8 md:p-10 flex flex-col justify-between md:flex-1">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-[#1AB8D7]/15 flex items-center justify-center flex-shrink-0">
                    <Ruler className="w-4 h-4 text-[#1AB8D7]" />
                  </div>
                  <h2 className="text-white text-lg font-extrabold leading-snug">
                    ¿Cuántos metros necesita la instalación?
                  </h2>
                </div>
                <p className="text-slate-400 text-sm mb-5 pl-13 leading-relaxed">
                  Es la distancia desde el tablero eléctrico hasta donde desea ubicar el cargador de su vehículo.
                </p>

                <div className="flex items-center justify-center gap-4 mb-5">
                  <button
                    onClick={handleDecrement}
                    aria-label="Reducir un metro"
                    className="w-13 h-13 rounded-xl border-2 border-[#1AB8D7] text-[#1AB8D7] flex items-center justify-center hover:bg-[#1AB8D7]/10 active:scale-95 transition-all text-2xl font-light select-none"
                  >
                    −
                  </button>
                  <div className="flex flex-col items-center gap-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={metros}
                      onChange={(e) => handleMetrosChange(e.target.value)}
                      placeholder="0"
                      min="0"
                      step="1"
                      className="w-32 h-20 text-center text-4xl font-extrabold text-white border-2 border-white/10 rounded-xl focus:border-[#1AB8D7] focus:outline-none focus:ring-4 focus:ring-[#1AB8D7]/20 transition-all bg-black/40 placeholder:text-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-slate-400 text-xs font-semibold tracking-wide">metros lineales</span>
                  </div>
                  <button
                    onClick={handleIncrement}
                    aria-label="Agregar un metro"
                    className="w-13 h-13 rounded-xl bg-[#1AB8D7] text-white flex items-center justify-center hover:bg-[#139db8] active:scale-95 transition-all text-2xl font-light select-none shadow-lg shadow-[#1AB8D7]/30"
                  >
                    +
                  </button>
                </div>

                <div>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_METERS.map((m) => {
                      const active = parseInt(metros, 10) === m && metros !== "";
                      return (
                        <button
                          key={m}
                          onClick={() => setMetros(String(m))}
                          className={`flex flex-col items-center py-2 px-1 rounded-xl border-2 transition-all active:scale-95 ${
                            active
                              ? "bg-[#1AB8D7]/15 text-white border-[#1AB8D7]"
                              : "border-white/15 text-white/70 hover:border-[#1AB8D7] hover:text-[#1AB8D7] bg-transparent"
                          }`}
                        >
                          <span className={`text-[13px] font-bold ${active ? "text-[#1AB8D7]" : "text-white"}`}>
                            {m} m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Divisor vertical desktop */}
            <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            {/* ── Columna derecha: Resultado ── */}
            <div className="flex flex-col justify-center md:p-10 md:flex-1">
              {isValid ? (
                <div className="mx-8 mb-8 md:m-0">
                  <div className="rounded-2xl bg-gradient-to-br from-[#0C2638] via-[#0d3550] to-[#0e3d5e] p-8 text-center shadow-xl shadow-[#0C2638]/20 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#1AB8D7]/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-[#1AB8D7] animate-pulse" />
                        <span className="text-[#1AB8D7] text-xs font-bold uppercase tracking-widest">
                          Cotización en vivo · Adab.Tech EV
                        </span>
                      </div>
                      <p className="text-white/50 text-sm mb-1">Precio estimado de instalación</p>

                      {error ? (
                        <div className="mb-6">
                          <p className="text-white text-lg font-bold mb-2">No pudimos calcular el precio</p>
                          <p className="text-white/50 text-sm leading-relaxed">{error}</p>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`text-white text-4xl font-extrabold mb-1 tracking-tight transition-opacity ${
                              isLoading && !hasQuote ? "opacity-40" : isLoading ? "opacity-60" : "opacity-100"
                            }`}
                          >
                            {hasQuote ? formatCOP(quote.total_price) : "—"}
                          </div>
                          <p className="text-white/40 text-xs mb-6">
                            {metrosNum} metro{metrosNum !== 1 ? "s" : ""} · IVA incluido
                            {isLoading ? " · Calculando…" : ""}
                          </p>
                        </>
                      )}

                      <button
                        onClick={() => setShowModal(true)}
                        disabled={!canRequestQuote}
                        className="w-full py-4 rounded-xl bg-[#1AB8D7] text-white font-extrabold text-base flex items-center justify-center gap-2 hover:bg-[#139db8] active:scale-[0.98] transition-all shadow-lg shadow-[#1AB8D7]/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1AB8D7] disabled:active:scale-100"
                      >
                        <ArrowRight className="w-5 h-5" />
                        Solicitar mi cotización
                      </button>
                      <p className="text-white/30 text-xs mt-3">Sin compromiso · Te contactamos hoy</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex flex-col items-center justify-center h-full text-center px-10 py-16">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <Zap className="w-8 h-8 text-white/40" strokeWidth={1.5} />
                  </div>
                  <p className="text-white/40 text-sm font-medium leading-relaxed">
                    Ingresa los metros o selecciona el tipo de parqueadero para ver tu estimado al instante
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* footer note */}
        <p className="text-center text-slate-400 text-xs mt-4 leading-relaxed max-w-sm mx-auto">
          Los precios son estimativos. Un técnico de Adab.Tech confirmará el valor exacto previa visita de diagnóstico.
        </p>
      </div>

      {/* ── Modal de contacto ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm"
          onClick={handleModalClose}
        >
          <div
            className="absolute flex items-center justify-center overflow-hidden"
            style={{
              top: visibleBox.top,
              left: visibleBox.left,
              width: visibleBox.width,
              height: visibleBox.height,
              paddingLeft: modalGutter,
              paddingRight: modalGutter,
            }}
          >
            <div
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl flex flex-col overflow-hidden min-h-0"
              style={{ maxHeight: modalMaxHeight }}
              onClick={(e) => e.stopPropagation()}
            >

            {/* Header */}
            <div ref={headerRef} className="bg-[#0C2638] px-6 py-5 flex items-center justify-between shrink-0">
              <div>
                <p className="text-[#1AB8D7] text-xs font-bold uppercase tracking-widest mb-0.5">
                  Adab.Tech EV
                </p>
                <h3 className="text-white text-lg font-extrabold">Solicitar cotización</h3>
              </div>
              <button
                onClick={handleModalClose}
                className="text-white/40 hover:text-white text-2xl leading-none transition-colors w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10"
              >
                ×
              </button>
            </div>

            <div
              className="ev-modal-scroll min-h-0 overflow-y-auto overscroll-contain"
              style={{ maxHeight: formMaxHeight }}
            >
            {modalSent ? (
              /* ── Éxito ── */
              <div className="p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-[#1AB8D7]/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#1AB8D7]" />
                </div>
                <h4 className="text-[#0C2638] text-xl font-extrabold mb-2">¡Listo!</h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Recibimos tu solicitud. Te contactaremos muy pronto para confirmar los detalles de tu instalación.
                </p>
                <button
                  onClick={handleModalClose}
                  className="px-8 py-3 rounded-xl bg-[#0C2638] text-white font-bold text-sm hover:bg-[#0a1f2f] transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              /* ── Formulario ── */
              <form onSubmit={handleModalSubmit} className="p-6 space-y-5">

                {/* Chip precio */}
                <div className="flex items-center justify-between bg-[#0C2638]/5 border border-[#0C2638]/10 rounded-xl px-4 py-3">
                  <span className="text-[#0C2638]/55 text-sm">{metrosNum} m · estimado</span>
                  <span className="text-[#0C2638] font-extrabold text-sm">
                    {hasQuote ? formatCOP(quote.total_price) : "—"}
                  </span>
                </div>

                {/* Campo 1: Nombre */}
                <div>
                  <label className="block text-[#0C2638] text-sm font-bold mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carlos Rodríguez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 text-[#0C2638] text-base focus:border-[#1AB8D7] focus:outline-none focus:ring-4 focus:ring-[#1AB8D7]/15 transition-all bg-slate-50 placeholder:text-slate-400"
                  />
                </div>

                {/* Campo 2: Ubicación */}
                <div>
                  <label className="block text-[#0C2638] text-sm font-bold mb-2">
                    Ubicación del lugar de instalación
                  </label>

                  {locationMode === "idle" && (
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleDetectLocation}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-[#1AB8D7]/40 bg-[#1AB8D7]/10 text-[#0C2638] text-sm font-bold hover:bg-[#1AB8D7]/15 active:scale-[0.98] transition-all"
                      >
                        <MapPin className="w-4 h-4 text-[#1AB8D7]" />
                        Detectar ubicación
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocationMode("manual")}
                        className="text-center text-slate-400 text-xs font-medium hover:text-[#1AB8D7] transition-colors"
                      >
                        Ingresar manualmente
                      </button>
                    </div>
                  )}

                  {locationMode === "detecting" && (
                    <div className="w-full flex items-center gap-3 px-4 py-4 rounded-xl border-2 border-slate-200 bg-slate-50">
                      <Loader2 className="w-4 h-4 text-[#1AB8D7] animate-spin flex-shrink-0" />
                      <span className="text-slate-500 text-sm">Detectando ubicación…</span>
                    </div>
                  )}

                  {(locationMode === "detected" || locationMode === "manual") && (
                    <div className="flex flex-col gap-2">
                      {locationMode === "detected" && (
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="text-emerald-600 text-xs font-semibold">
                            Ubicación detectada · puedes editarla
                          </span>
                        </div>
                      )}
                      <input
                        type="text"
                        required
                        placeholder="Ej: Calle 45 #12-34, Bogotá"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        className={`w-full px-4 py-4 rounded-xl border-2 text-[#0C2638] text-base focus:border-[#1AB8D7] focus:outline-none focus:ring-4 focus:ring-[#1AB8D7]/15 transition-all bg-slate-50 placeholder:text-slate-400 ${
                          locationMode === "detected" ? "border-emerald-400" : "border-slate-200"
                        }`}
                      />
                      {locationMode === "manual" && (
                        <button
                          type="button"
                          onClick={handleDetectLocation}
                          className="text-center text-[#1AB8D7] text-xs font-medium hover:underline"
                        >
                          Intentar detectar automáticamente
                        </button>
                      )}
                    </div>
                  )}

                  {locationError && (
                    <p className="text-amber-600 text-xs mt-2 leading-relaxed">{locationError}</p>
                  )}
                </div>

                {/* Campo 3: Toggle WhatsApp / Correo */}
                <div>
                  <label className="block text-[#0C2638] text-sm font-bold mb-2">
                    ¿Cómo prefiere que lo contactemos?
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => { setContactType("whatsapp"); setContactValue(""); }}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        contactType === "whatsapp"
                          ? "bg-[#0C2638] text-white border-[#0C2638] shadow-md"
                          : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => { setContactType("email"); setContactValue(""); }}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        contactType === "email"
                          ? "bg-[#0C2638] text-white border-[#0C2638] shadow-md"
                          : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      Correo
                    </button>
                  </div>

                  {/* Campo 3: Valor de contacto */}
                  <input
                    type={contactType === "email" ? "email" : "tel"}
                    inputMode={contactType === "whatsapp" ? "numeric" : "email"}
                    required
                    placeholder={
                      contactType === "whatsapp"
                        ? "Ej: 300 123 4567"
                        : "nombre@correo.com"
                    }
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 text-[#0C2638] text-base focus:border-[#1AB8D7] focus:outline-none focus:ring-4 focus:ring-[#1AB8D7]/15 transition-all bg-slate-50 placeholder:text-slate-400"
                  />
                </div>

                {/* Botón enviar */}
                {submitError && (
                  <p className="text-red-500 text-sm text-center leading-relaxed">
                    {submitError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#0C2638] text-white font-extrabold text-base flex items-center justify-center gap-2 hover:bg-[#0a1f2f] active:scale-[0.98] transition-all shadow-lg shadow-[#0C2638]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#0C2638] disabled:active:scale-100"
                >
                  <Zap className="w-4 h-4 text-[#1AB8D7]" />
                  {isSubmitting ? "Enviando…" : "Enviar"}
                </button>

                <p className="text-center text-slate-400 text-xs">
                Tus datos están protegidos de acuerdo a Ley de protección de datos personales en Colombia 1581 de 2012.
                </p>
              </form>
            )}
            </div>
            </div>
          </div>
          <style>{`
            .ev-modal-scroll {
              scrollbar-width: thin;
              scrollbar-color: rgba(12, 38, 56, 0.45) transparent;
            }
            .ev-modal-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .ev-modal-scroll::-webkit-scrollbar-thumb {
              background: rgba(12, 38, 56, 0.35);
              border-radius: 999px;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
