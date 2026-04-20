export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const res = await fetch(`https://openlibrary.org/works/${key}.json`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return Response.json(null, { status: 502 });
  const data = await res.json();
  return Response.json(data);
}
