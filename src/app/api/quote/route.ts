import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.QUOTE_API_URL!;
const API_KEY = process.env.QUOTE_API_KEY!;

export async function POST(request: NextRequest) {
  const payload = await request.json();

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Simulator-Key': API_KEY,
    },
    body: JSON.stringify({ ...payload, source: 'pagina_web' }),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
