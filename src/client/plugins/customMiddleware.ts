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
    if (labels.length === 1 && playerHomeBlock.querySelector(".card-title")) {
      return;
    }
    disregarded.push({
      action: labels[0]?.textContent.trim(),
      selectedCard: labels[1]?.querySelector(".card-title")!.textContent.trim(),
    });
    ctx.app.playerkey++;
  };
  const options = Array.from(
    playerHomeBlock.querySelectorAll(".wf-options > div")
  ) as HTMLElement[];
  disregarded.forEach(({ action, selectedCard }) => {
    const optionDiv = options.find(
      (div) => div.querySelector(".form-radio")?.textContent.trim() === action
    )!;
    if (selectedCard) {
      optionDiv
        .querySelector('input[type="radio"]')!
        .addEventListener("change", () => {
          const allCards = Array.from(
            optionDiv.querySelectorAll("label")
          ).filter((label) => !label.matches(".form-radio"));
          const cardDiv = allCards.find(
            (cardLabel) =>
              cardLabel.querySelector(".card-title")!.textContent.trim() ===
              selectedCard
          ) as HTMLElement;
          if (cardDiv) {
            cardDiv.style.display = "none";
            const nextCard = allCards.find((o) => o.style.display !== "none");
            if (nextCard) {
              nextCard.click();
            } else {
              optionDiv.style.display = "none";
              options
                .find((o) => o.style.display !== "none")!
                .querySelector("label")!
                .click();
            }
          }
        });
    } else {
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
  const ctx = { fetchArgs: args, fetchResponse: undefined as any };
  args = (await runCustomMiddleware(ctx)) ?? args;
  var res = await originalFetch(...args);
  ctx.fetchResponse = res.clone();
  res = (await runCustomMiddleware(ctx)) ?? res;
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
