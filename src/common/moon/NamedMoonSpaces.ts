import {ValueOf} from '../utils/utils';

export const NamedMoonSpaces = {
  LUNA_TRADE_STATION: 'm01',
  MARE_IMBRIUM: 'm07',
  MARE_SERENITATIS: 'm14',
  MARE_NUBIUM: 'm24',
  MARE_NECTARIS: 'm26',
  MOMENTUM_VIRIUM: 'm37',
} as const;

export type NamedMoonSpace = ValueOf<typeof NamedMoonSpaces>;
