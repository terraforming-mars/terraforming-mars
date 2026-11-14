import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {bonusCardBeforeActionPhase} from '@/server/automa/corps/BaseGameCorps';

// ---- C05 Inventrix ----
// Setup: remove Lobbyists (B06). Effect: card with requirements gives 2 MC.
// Gen: before action phase, add Do It Right (B25) to action deck.
export const INVENTRIX_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.INVENTRIX,
  description: 'Setup: remove Lobbyists. Effect: card with requirements gives 2 MC. Each generation: add Do It Right to action deck.',
  tags: [],
  setup(marsBot) {
    // With Venus Next the bonus deck's Lobbyists is B15
    marsBot.removeBonusCard(BonusCardId.B06_LOBBYISTS);
    marsBot.removeBonusCard(BonusCardId.B15_LOBBYISTS_VENUS);
    marsBot.game.log('MarsBot (Inventrix): Lobbyists removed from bonus deck');
  },
  effect: {
    onProjectCardResolved(marsBot, card) {
      if (card.requirements.length > 0) {
        marsBot.gainMc(2);
        marsBot.game.log('MarsBot (Inventrix): card with requirements, +2 M€');
      }
    },
  },
  ...bonusCardBeforeActionPhase(BonusCardId.B25_DO_IT_RIGHT, 'Inventrix'),
};
