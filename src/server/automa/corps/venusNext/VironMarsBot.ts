import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import {Tag} from '@/common/cards/Tag';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {isIActionCard} from '@/server/cards/ICard';

// C25 Viron (NamuWiki says "Byron")
export const VIRON_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.VIRON,
  description: 'Tag: Microbe. Each active card with an action adds 1 floater and scores 1 VP at game end.',
  tags: [Tag.MICROBE],
  requiredExpansions: ['venus', 'colonies'],
  effect: {
    onProjectCardResolved(marsBot, card) {
      if (card.type !== CardType.ACTIVE || !isIActionCard(card)) {
        return;
      }
      marsBot.addFloaters(1);
      marsBot.setCorpState('actionCardsPlayed', marsBot.getCorpState('actionCardsPlayed') + 1);
      marsBot.game.log('MarsBot (Viron): active card with an action played, +1 floater');
    },
    vpBonus(marsBot) {
      return marsBot.getCorpState('actionCardsPlayed');
    },
  },
};
