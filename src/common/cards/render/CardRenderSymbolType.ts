export const CardRenderSymbolType = {
  ASTERIX: '*',
  OR: 'OR',
  MINUS: '-',
  PLUS: '+',
  COLON: ':',
  EMPTY: ' ',
  SLASH: '/',
  ARROW: '->',
  BRACKET_OPEN: '(',
  BRACKET_CLOSE: ')',
  NBSP: 'nbsp',
  VSPACE: 'vspace',
  EQUALS: '=',
  SURVEY_MISSION: 'survey-mission',
} as const;

export type CardRenderSymbolType = typeof CardRenderSymbolType[keyof typeof CardRenderSymbolType];

