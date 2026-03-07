const { EdgeRuntime } = require('next/dist/compiled/edge-runtime');
(async () => {
  const runtime = new EdgeRuntime({
    initialCode: `addEventListener('fetch', async (event) => {
      try {
        const res = await fetch('https://tjptpuppedweusnkffcy.supabase.co/auth/v1/health');
        const text = await res.text();
        event.respondWith(new Response(text, { status: res.status }));
      } catch (err) {
        event.respondWith(new Response('error:' + err.message, { status: 500 }));
      }
    });`
  });
  const res = await runtime.dispatchFetch('https://example.com/');
  console.log('status', res.status);
  console.log('body', await res.text());
})();
