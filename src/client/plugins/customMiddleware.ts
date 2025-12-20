// uses url query param customMiddlewaresSrc
// to download custom middleware
// and run them before fetch, after fetch,
// and on completion of rendering

// this powerful tool enables arbitrary frontend
// workloads without needing to merge to
// the main repo, as long as the src is visible

const originalFetch = window.fetch;

declare global {
  interface Window {
    customMiddlewareF: (ctx: {
      app: any;
      fetchArgs: any;
      fetchResponse: any;
    }) => any;
  }
}

export async function runCustomMiddleware(ctx: any) {
  return await Promise.resolve().then(() => window.customMiddlewareF?.(ctx));
}

window.fetch = async (...args) => {
  const ctx = {fetchArgs: args, fetchResponse: undefined as any};
  args = (await runCustomMiddleware(ctx)) ?? args;
  const res = await originalFetch(...args);
  ctx.fetchResponse = res.clone();
  return (await runCustomMiddleware(ctx)) ?? res;
};

export default function customMiddleware() {
  const params = new URLSearchParams(window.location.search);
  const src = params.get('customMiddlewaresSrc');
  if (!src) return;
  return new Promise((resolve) => {
    const script = document.createElement('script');
    // script.src =
    //   "https://dcep93.github.io/tfMarsCustomMiddleware.example.js";

    //    // window.customMiddlewareF = (ctx) => {
    //    //   console.log(ctx);
    //    // };

    script.src = src;
    script.async = false;
    script.onload = script.onerror = resolve;
    document.body.appendChild(script);
  });
}
