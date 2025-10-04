const originalFetch = window.fetch;

declare global {
  interface Window {
    tfMarsFetchOverrideMiddlewares: ((ctx: {
      args: any;
      response: any;
    }) => any)[];
  }
}

window.tfMarsFetchOverrideMiddlewares = [];

async function runMiddlewares(ctx: any) {
  await Promise.all(
    window.tfMarsFetchOverrideMiddlewares.map((mw) =>
      Promise.resolve().then(mw(ctx))
    )
  );
}

window.fetch = async (...args) => {
  const ctx = { args, response: undefined as any };
  await runMiddlewares(ctx);
  const res = await originalFetch(...args);
  ctx.response = res.clone();
  await runMiddlewares(ctx);
  return res;
};

export default async function customFetchOverride() {
  const params = new URLSearchParams(window.location.search);
  const src = params.get("customFetchOverride");
  if (!src) return;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    // script.src =
    //   "https://dcep93.github.io/tfMarsCustomFetchOverride.example.js";

    //    // window.tfMarsFetchOverrideMiddlewares.push((ctx) => {
    //    //   console.log(ctx);
    //    // });

    script.src = src;
    script.async = false;
    script.onload = resolve;
    document.body.appendChild(script);
  });
}
