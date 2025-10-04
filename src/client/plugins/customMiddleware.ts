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
    customMiddleware: (ctx: { args: any; response: any }) => any;
  }
}

window.customMiddleware = (ctx) => {
  if (ctx.args) return;
  const wfAction = document.querySelector(
    ".player_home_block--actions .wf-action"
  );
  if (!wfAction) return;
  const oldButton = wfAction.querySelector(".btn-submit");
  if (!oldButton) return;
  const newButton = oldButton.cloneNode(true);
  newButton.textContent = "disregard";
  // @ts-ignore / Property 'onclick' does not exist on type 'Node'.ts(2339)
  newButton.onclick = () => {
    alert("gotem");
  };
  wfAction.appendChild(newButton);
};

export async function runCustomMiddleware(ctx: any) {
  await Promise.resolve().then(() => window.customMiddleware(ctx));
}

window.fetch = async (...args) => {
  const ctx = { args, response: undefined as any };
  await runCustomMiddleware(ctx);
  const res = await originalFetch(...args);
  ctx.response = res.clone();
  await runCustomMiddleware(ctx);
  return res;
};

export default async function customMiddleware() {
  const params = new URLSearchParams(window.location.search);
  const src = params.get("customMiddlewaresSrc");
  if (!src) return;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    // script.src =
    //   "https://dcep93.github.io/tfMarsCustomMiddleware.example.js";

    //    // window.customMiddleware = (ctx) => {
    //    //   console.log(ctx);
    //    // };

    script.src = src;
    script.async = false;
    script.onload = script.onerror = resolve;
    document.body.appendChild(script);
  });
}
