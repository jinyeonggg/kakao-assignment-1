const FASTAPI = process.env.FASTAPI_URL ?? 'http://127.0.0.1:8000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') ?? '';
  try {
    const res = await fetch(`${FASTAPI}/todos?date=${date}`);
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ error: 'Backend unavailable' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const res = await fetch(`${FASTAPI}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ error: 'Backend unavailable' }, { status: 503 });
  }
}
