/**
 * Draws a small status indicator on the bottom-right of the favicon, similar to
 * the way GitHub overlays a state indicator on the tab favicon for a pull
 * request.
 *
 *   'turn'  - it's the player's turn to act (green)
 *   'idle'  - waiting on other players (grey)
 *   'ended' - the game is over (purple)
 *
 * For the 'turn' state the overlay can also be animated as a rotating
 * half-filled circle, mirroring the spinning ◑◒◐◓ symbol that `animateTitle`
 * shows in the document title. Call `setFaviconTurnFrame()` on each animation
 * tick; passing `undefined` to `setFaviconStatus` restores the plain favicon.
 */
export type FaviconStatus = 'turn' | 'idle' | 'ended';

const TURN_COLOR = '#1f883d';
// GitHub-ish status colors for the static dots.
const IDLE_COLOR = '#8b949e';
// The 'ended' overlay is a checkered finish flag: dark/light squares ringed in
// a vivid color so it pops.
const ENDED_DARK = '#1b1f24';
const ENDED_LIGHT = '#ffffff';
const ENDED_RING = '#8250df';
// Number of checker rows/columns across the flag.
const ENDED_CHECKERS = 4;

// The rotating 'turn' overlay cycles through this many frames, matching the
// four ◑◒◐◓ symbols used by animateTitle.
export const TURN_FRAMES = 4;

const BASE_FAVICON = 'favicon.ico';
const SIZE = 64;
// Center and radii of the overlay, in the bottom-right corner.
const CX = SIZE - 17;
const CY = SIZE - 17;
const RING_R = 17;
const DOT_R = 13;

let baseImage: HTMLImageElement | undefined;
let currentKey: string | undefined;

function loadBaseImage(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (baseImage !== undefined && baseImage.complete && baseImage.naturalWidth > 0) {
      resolve(baseImage);
      return;
    }
    const img = new Image();
    img.onload = () => {
      baseImage = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = BASE_FAVICON;
  });
}

function getFaviconLink(): HTMLLinkElement {
  let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
  if (link === null) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  return link;
}

// A white backdrop so the overlay reads against any part of the logo.
function whiteRing(ctx: CanvasRenderingContext2D): void {
  ctx.beginPath();
  ctx.arc(CX, CY, RING_R, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}

function drawDot(ctx: CanvasRenderingContext2D, color: string): void {
  whiteRing(ctx);
  ctx.beginPath();
  ctx.arc(CX, CY, DOT_R, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

// Emulates one frame of the ◑◒◐◓ spinner: a full circle outline with one
// rotating half filled in. Frame 0 fills the right half (◑), advancing
// clockwise through bottom (◒), left (◐) and top (◓).
function drawTurnFrame(ctx: CanvasRenderingContext2D, frame: number): void {
  whiteRing(ctx);
  ctx.strokeStyle = TURN_COLOR;
  ctx.fillStyle = TURN_COLOR;
  ctx.beginPath();
  ctx.arc(CX, CY, DOT_R, 0, 2 * Math.PI);
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const start = -Math.PI / 2 + (((frame % TURN_FRAMES) + TURN_FRAMES) % TURN_FRAMES) * (Math.PI / 2);
  ctx.beginPath();
  ctx.arc(CX, CY, DOT_R, start, start + Math.PI);
  ctx.closePath();
  ctx.fill();
}

// A checkered finish flag clipped to a circle, ringed in a vivid color to pop.
function drawEnded(ctx: CanvasRenderingContext2D): void {
  whiteRing(ctx);

  ctx.save();
  ctx.beginPath();
  ctx.arc(CX, CY, DOT_R, 0, 2 * Math.PI);
  ctx.clip();
  const x0 = CX - DOT_R;
  const y0 = CY - DOT_R;
  const cell = (2 * DOT_R) / ENDED_CHECKERS;
  for (let row = 0; row < ENDED_CHECKERS; row++) {
    for (let col = 0; col < ENDED_CHECKERS; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? ENDED_DARK : ENDED_LIGHT;
      // Slight overdraw avoids hairline seams between cells.
      ctx.fillRect(x0 + col * cell, y0 + row * cell, cell + 0.5, cell + 0.5);
    }
  }
  ctx.restore();

  ctx.beginPath();
  ctx.arc(CX, CY, DOT_R, 0, 2 * Math.PI);
  ctx.lineWidth = 3;
  ctx.strokeStyle = ENDED_RING;
  ctx.stroke();
}

function render(key: string, draw?: (ctx: CanvasRenderingContext2D) => void): void {
  if (key === currentKey) {
    return;
  }
  currentKey = key;

  loadBaseImage().then((img) => {
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      return;
    }
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    draw?.(ctx);
    getFaviconLink().href = canvas.toDataURL('image/png');
  }).catch(() => {
    // If the base favicon can't be loaded, leave the existing favicon in place.
  });
}

export function setFaviconStatus(status: FaviconStatus | undefined): void {
  switch (status) {
  case undefined:
    render('none');
    break;
  case 'turn':
    render('turn', (ctx) => drawDot(ctx, TURN_COLOR));
    break;
  case 'ended':
    render('ended', drawEnded);
    break;
  case 'idle':
    render('idle', (ctx) => drawDot(ctx, IDLE_COLOR));
    break;
  }
}

// Renders one frame of the rotating 'turn' overlay, kept in sync with the
// spinning symbol shown in the document title.
export function setFaviconTurnFrame(frame: number): void {
  render('turn-' + (((frame % TURN_FRAMES) + TURN_FRAMES) % TURN_FRAMES), (ctx) => drawTurnFrame(ctx, frame));
}
