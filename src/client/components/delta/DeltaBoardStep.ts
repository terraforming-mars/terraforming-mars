// Types describing one cell on the Delta Project board.
// Extracted from DeltaProjectBoard.vue so they can be imported
// from test code (named imports from .vue files aren't supported
// by the test build's TypeScript shim).
import {Tag} from '@/common/cards/Tag';

export type RewardIcon = {
  cssClass: string;
  production?: boolean;
  separator?: boolean;
  or?: boolean;
  asterisk?: boolean;
  count?: number;
  text?: string;
};

export type DeltaBoardStep = {
  tag?: Tag;
  vpValue?: number;
  dynamicSlots: boolean;
  rewardIcons: Array<RewardIcon>;
};
