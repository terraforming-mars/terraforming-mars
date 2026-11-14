import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// C38 Terralabs
export const TERRALABS_RESEARCH_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.TERRALABS_RESEARCH,
  description: 'Tag: Science. Setup: TR -8. Each generation: draw 1 card to action deck (2 cards from generation 9 onward).',
  tags: [Tag.SCIENCE],
  setup(marsBot) {
    // Reduce TR by 8
    marsBot.raiseTR(-8);
    marsBot.game.log('MarsBot (Terralabs): TR -8');
  },
  beforeActionPhase(marsBot) {
    const count = marsBot.game.generation <= 8 ? 1 : 2;
    marsBot.drawProjectCardsToActionDeck(count);
    marsBot.game.log(`MarsBot (Terralabs): drew ${count} card(s) to action deck`);
  },
};
