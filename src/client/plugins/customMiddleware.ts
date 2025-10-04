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
    customMiddlewareF: (ctx: { app: any; args: any; response: any }) => any;
  }
}

window.customMiddlewareF = (ctx) => {
  if (!ctx.app) return;
  const playerHomeBlock = document.querySelector(".player_home_block--actions");
  if (!playerHomeBlock) return;
  const wfAction = playerHomeBlock.querySelector(".wf-action");
  if (!wfAction) return;
  const oldButton = wfAction.querySelector(".btn-submit");
  if (!oldButton) return;
  const newButton = oldButton.cloneNode(true);
  newButton.textContent = "disregard";
  // @ts-ignore / Property 'onclick' does not exist on type 'Node'.ts(2339)
  newButton.onclick = () => {
    const labels = Array.from(
      playerHomeBlock.querySelectorAll(".wf-options label")
    ).filter((label) => label.querySelector('input[type="radio"]:checked'));
    disregarded.push({
      action: labels[0]?.textContent,
      selectedCard: labels[1]
        ?.querySelector(".card-title.card-title")!
        .textContent.trim(),
    });
    ctx.app.updatePlayer();
  };
  const options = Array.from(
    playerHomeBlock.querySelectorAll(".wf-options > div")
  ) as HTMLElement[];
  disregarded.forEach(({ action, selectedCard }) => {
    const optionDiv = options.find(
      (div) => div.querySelector(".form-radio")?.textContent === action
    )!;
    if (!selectedCard) {
      optionDiv.style.display = "none";
    }
  });
  options
    .find((o) => o.style.display !== "none")!
    .querySelector("label")!
    .click();
  wfAction.appendChild(newButton);
};
const disregarded: any[] = [];

export async function runCustomMiddleware(ctx: any) {
  await Promise.resolve().then(() => window.customMiddlewareF(ctx));
}

window.fetch = async (...args) => {
  const ctx = { args, response: undefined as any };
  await runCustomMiddleware(ctx);
  const res = await originalFetch(...args);
  ctx.response = res.clone();
  const altered = await runCustomMiddleware(ctx);
  return altered ?? res;
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
