export default async (request, context) => {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response('URL query parameter is required', { status: 400 });
  }

  try {
    const response = await fetch(targetUrl);
    const data = await response.text();

    return new Response(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    return new Response('Error fetching the requested URL', { status: 500 });
  }
};

export const config = { path: '/.netlify/edge-functions/proxy' };
