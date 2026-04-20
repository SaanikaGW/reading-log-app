export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  if (!q?.trim()) return Response.json({ docs: [] });

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year,number_of_pages_median`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return Response.json({ docs: [] }, { status: 502 });

  const data = await res.json();
  return Response.json(data);
}
