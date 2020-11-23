export const playerColorClass = (
  color: string,
  type: 'shadow' | 'bg' | 'bg_transparent',
): string => {
  const prefix = {
    shadow: 'player_shadow_color_',
    bg_transparent: 'player_translucent_bg_color_',
    bg: 'player_bg_color_',
  }[type];

  return `${prefix}${color}`;
};

export const range = (n: number): Array<Number> => Array.from(Array(n).keys());
