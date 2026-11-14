import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// C21 Pharmacy Union
export const PHARMACY_UNION_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.PHARMACY_UNION,
  description: 'Tag: Science. Draft: Science. Setup: remove Meteor Shower; shuffle a revealed Science card into the bonus deck. Science cards (starting tag included) give +1 TR. When human plays a Microbe card, lose 4 MC.',
  tags: [Tag.SCIENCE],
  draftPriority: {type: 'tags', tags: [Tag.SCIENCE]},
  setup(marsBot) {
    marsBot.removeBonusCard(BonusCardId.B01_METEOR_SHOWER);
    marsBot.addProjectCardsToBonusDeck(Tag.SCIENCE, 1);
    marsBot.game.log('MarsBot (Pharmacy Union): Meteor Shower removed, science card added to bonus deck');
  },
  effect: {
    onProjectCardResolved(marsBot, card) {
      if (card.tags.includes(Tag.SCIENCE)) {
        marsBot.raiseTR(1);
        marsBot.game.log('MarsBot (Pharmacy Union): science card, TR +1');
      }
    },
    onHumanCardPlayed(marsBot, card) {
      if (card.tags.includes(Tag.MICROBE)) {
        marsBot.megacredits = Math.max(0, marsBot.megacredits - 4);
        marsBot.game.log('MarsBot (Pharmacy Union): human played microbe, -4 M€');
      }
    },
  },
};
