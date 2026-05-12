interface QuotePayload {
  clientName: string;
  email: string;
  phone: string;
  city: string;
  department?: string;
  location_maps: string;
  monthlyConsumption: number;
  estimatedInvestment: number;
  panelCount: number;
  requiredArea: number;
  peakPower: number;
  simulatorId?: string;
  regionId?: number;
}

export async function submitToQuoteApi(payload: QuotePayload): Promise<boolean> {
  try {
    const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
    const apiKey = import.meta.env.VITE_API_KEY || 'sim-adabtech-2026-secret';
    
    const response = await fetch(`${apiUrl}/api/quotations/from-simulator/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Simulator-Key': apiKey,
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      console.error(`Error ${response.status}:`, await response.text());
      return false;
    }
    
    const data = await response.json();
    return !!data.id;
  } catch (error) {
    console.error('Error submitting quote:', error);
    return false;
  }
}
