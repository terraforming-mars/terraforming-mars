const originalFetch = window.fetch;

declare global {
  interface Window {
    customMiddlewares: ((ctx: { args: any; response: any }) => any)[];
  }
}

window.customMiddlewares = [];

export async function runCustomMiddlewares(ctx: any) {
  await Promise.all(
    window.customMiddlewares.map((mw) => Promise.resolve().then(mw(ctx)))
  );
}

window.fetch = async (...args) => {
  const ctx = { args, response: undefined as any };
  await runCustomMiddlewares(ctx);
  const res = await originalFetch(...args);
  ctx.response = res.clone();
  await runCustomMiddlewares(ctx);
  return res;
};

export default async function customMiddlewares() {
  const params = new URLSearchParams(window.location.search);
  const src = params.get("customMiddlewaresSrc");
  if (!src) return;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    // script.src =
    //   "https://dcep93.github.io/tfMarsCustomMiddleware.example.js";

    //    // window.customMiddlewares.push((ctx) => {
    //    //   console.log(ctx);
    //    // });

    script.src = src;
    script.async = false;
    script.onload = resolve;
    document.body.appendChild(script);
  });
}
