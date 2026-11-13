import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// C46 Tyco Magnetics
export const TYCHO_MAGNETICS_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.TYCHO_MAGNETICS,
  description: 'Draft: Power > Science. Setup: add Interface Hyperlink to the bottom of the bonus deck.',
  tags: [],
  draftPriority: {type: 'tags', tags: [Tag.POWER, Tag.SCIENCE]},
  setup(marsBot) {
    marsBot.addBonusCardToBottomOfBonusDeck(BonusCardId.B30_INTERFACE_HYPERLINK);
    marsBot.game.log('MarsBot (Tyco Magnetics): Interface Hyperlink added to the bottom of the bonus deck');
  },
};
