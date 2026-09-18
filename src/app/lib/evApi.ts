export type EVSimulateResponse = {
  total_price: number;
  advance_payment: number;
  operating_payment: number;
  intercept: number;
  slope: number;
  margin: number;
  advance_percent: number;
  linear_meters: number;
};

export type EVCreateQuotationInput = {
  linearMeters: number;
  clientName: string;
  location: string;
  clientEmail?: string;
  clientPhone?: string;
};

export type EVCreateQuotationResponse = {
  id: string;
  simulated: boolean;
  total_price: number | null;
  advance_payment: number | null;
  operating_payment: number | null;
  delivery?: {
    emailSent: boolean;
    whatsappSent: boolean;
    warnings: string[];
  };
};

export class EVApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'EVApiError';
    this.status = status;
  }
}

function getEvConfig() {
  const baseUrl = import.meta.env.VITE_EV_API_BASE_URL as string | undefined;
  const simulatorId = import.meta.env.VITE_EV_SIMULATOR_ID as string | undefined;
  const simulatorKey = import.meta.env.VITE_EV_SIMULATOR_KEY as string | undefined;

  if (!baseUrl || !simulatorId || !simulatorKey) {
    throw new EVApiError('Falta configuración EV (VITE_EV_*).', 0);
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ''),
    simulatorId,
    simulatorKey,
  };
}

async function evFetch(
  path: string,
  body: Record<string, unknown>,
  signal?: AbortSignal
): Promise<Response> {
  const { baseUrl, simulatorKey } = getEvConfig();
  const url = `${baseUrl}${path}`;

  try {
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Simulator-Key': simulatorKey,
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw new EVApiError('No se pudo conectar con el servicio de cotización.', 0);
  }
}

export async function simulateQuotation(
  linearMeters: number,
  signal?: AbortSignal
): Promise<EVSimulateResponse> {
  if (!(linearMeters > 0)) {
    throw new EVApiError('linear_meters debe ser mayor que 0.', 400);
  }

  const { simulatorId } = getEvConfig();
  const response = await evFetch(
    '/ev/quotations/simulate/',
    {
      simulator_id: simulatorId,
      linear_meters: linearMeters,
    },
    signal
  );

  if (!response.ok) {
    const messages: Record<number, string> = {
      400: 'Parámetros de simulación inválidos.',
      401: 'No autorizado para simular cotizaciones.',
      404: 'Simulador EV no encontrado.',
    };
    throw new EVApiError(
      messages[response.status] ?? `Error al simular cotización (${response.status}).`,
      response.status
    );
  }

  return (await response.json()) as EVSimulateResponse;
}

export async function createQuotationFromSimulator(
  input: EVCreateQuotationInput,
  signal?: AbortSignal
): Promise<EVCreateQuotationResponse> {
  const clientName = input.clientName.trim();
  const location = input.location.trim();
  const clientEmail = input.clientEmail?.trim();
  const clientPhone = input.clientPhone?.replace(/\s+/g, '').trim();

  if (!(input.linearMeters > 0)) {
    throw new EVApiError('linear_meters debe ser mayor que 0.', 400);
  }
  if (!clientName) {
    throw new EVApiError('El nombre es obligatorio.', 400);
  }
  if (!location) {
    throw new EVApiError('La ubicación es obligatoria.', 400);
  }
  if (!clientEmail && !clientPhone) {
    throw new EVApiError('Debes indicar un correo o un WhatsApp.', 400);
  }

  const { simulatorId } = getEvConfig();
  const body: Record<string, unknown> = {
    simulator_id: simulatorId,
    linear_meters: input.linearMeters,
    client_name: clientName,
    location,
  };

  if (clientEmail) body.client_email = clientEmail;
  if (clientPhone) body.client_phone = clientPhone;

  const response = await evFetch('/ev/quotations/from-simulator/', body, signal);

  if (!response.ok) {
    const messages: Record<number, string> = {
      400: 'No pudimos crear la cotización. Revisa los datos e intenta de nuevo.',
      401: 'No autorizado para enviar cotizaciones.',
      404: 'Simulador EV no encontrado.',
      500: 'Error al enviar la cotización. Intenta de nuevo en unos minutos.',
    };
    throw new EVApiError(
      messages[response.status] ?? `Error al crear cotización (${response.status}).`,
      response.status
    );
  }

  return (await response.json()) as EVCreateQuotationResponse;
}
