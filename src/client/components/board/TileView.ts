export type TileView = 'show' | 'hide' | 'coords';

const nextView: Record<TileView, TileView> = {
  'show': 'hide',
  'hide': 'coords',
  'coords': 'show',
} as const;

export function nextTileView(tileView: TileView): TileView {
  return nextView[tileView];
}
