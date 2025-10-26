export default {
  async fetch(req: Request, env: Record<string, any>): Promise<Response> {
    // 1. Observability: auto-injected metrics
    const start = Date.now();
    const url = new URL(req.url);

    // 2. Smart placement: respect cf.colo
    const colo = req.headers.get('cf-colo') ?? 'unknown';

    // 3. Cron trigger health-check (called by Cron event)
    if (url.pathname === '/health') {
      return new Response('ok', { headers: { 'X-Colo': colo } });
    }

    // 4. Durable Objects alarm (if bound)
    if (url.pathname === '/alarm' && env.ALARM && typeof env.ALARM.fetch === 'function') {
      await env.ALARM.fetch(req);
      return new Response('alarm set');
    }

    // 5. Real work: resize image, track metric
    const res = await fetch('https://example.com/image.jpg');
    const buffer = await res.arrayBuffer();
    const resized = await resize(buffer, 200);

    const duration = Date.now() - start;
    // Metric auto-scraped by Alchemy
    if (env.METRICS && typeof env.METRICS.log === 'function') {
      env.METRICS.log('resize_duration_ms', duration, { colo });
    } else {
      console.log('resize_duration_ms', duration, { colo });
    }

    return new Response(resized, {
      headers: { 'content-type': 'image/jpeg', 'X-Colo': colo },
    });
  },

  async scheduled(event: any, env: Record<string, any>): Promise<void> {
    // 6. Cron trigger every 5 min
    if (env.WORKER && typeof env.WORKER.fetch === 'function') {
      await env.WORKER.fetch(new Request('https://worker/health'));
    }
  },
};

async function resize(buf: ArrayBuffer, width: number): Promise<ArrayBuffer> {
  // stub: real sharp/oxipng logic would go here
  return buf;
}
