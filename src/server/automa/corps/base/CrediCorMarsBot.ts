import {CardName} from '@/common/cards/CardName';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// ---- C01 Credicor ----
// Draft: most expensive card. Effect: card cost 20+ gives 4 MC.
export const CREDICOR_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.CREDICOR,
  description: 'Draft: most expensive card. Effect: card cost 20+ gives 4 MC.',
  tags: [],
  draftPriority: {type: 'mostExpensive'},
  effect: {
    onProjectCardResolved(marsBot, card) {
      if (card.cost >= 20) {
        marsBot.gainMc(4);
        marsBot.game.log(`MarsBot (Credicor): card cost ${card.cost} >= 20, gain 4 M€`);
      }
    },
  },
};
