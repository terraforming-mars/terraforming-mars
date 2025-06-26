import {Color} from '../Color';
import {TileType} from '../TileType';
import {SpaceBonus} from '../boards/SpaceBonus';
import {CardName} from '../cards/CardName';
import {ColonyName} from '../colonies/ColonyName';
import {AwardName} from '../ma/AwardName';
import {MilestoneName} from '../ma/MilestoneName';
import {PartyName} from '../turmoil/PartyName';
import {GlobalEventName} from '../turmoil/globalEvents/GlobalEventName';
import {LogMessageDataType} from './LogMessageDataType';

export type LogMessageDataAttrs = {
  /** When true for a card, also show the card's tags */
  tags?: boolean,
  /** When true for a card, also show the card's cost */
  cost?: boolean,
}

type Types = {
  type: LogMessageDataType.STRING | LogMessageDataType.RAW_STRING,
  value: string,
} | {
  type: LogMessageDataType.PLAYER,
  value: Color,
} | {
  type: LogMessageDataType.CARD,
  value: CardName,
} | {
  type: LogMessageDataType.AWARD,
  value: AwardName,
} | {
  type: LogMessageDataType.MILESTONE,
  value: MilestoneName,
} | {
  type: LogMessageDataType.COLONY,
  value: ColonyName,
} | {
  type: LogMessageDataType.PARTY,
  value: PartyName,
} | {
  type: LogMessageDataType.TILE_TYPE,
  value: TileType,
} | {
  type: LogMessageDataType.SPACE_BONUS,
  value: SpaceBonus,
} | {
  type: LogMessageDataType.PARTY,
  value: PartyName,
} | {
  type:
  LogMessageDataType.GLOBAL_EVENT;
  value: GlobalEventName,
};

export type LogMessageData = Types & {
  attrs?: LogMessageDataAttrs;
}
