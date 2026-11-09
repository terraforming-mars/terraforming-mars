import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';
import {printedVictoryPoints} from '@/server/automa/MarsBotTags';
import {bonusCardBeforeActionPhase} from '@/server/automa/corps/BaseGameCorps';

// C17 Vitor: separates B04, adds it to action deck each gen
export const VITOR_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.VITOR,
  description: 'Setup: separate Overachievement from bonus deck. Cards with non-negative VP earn 3 MC. Each generation: add Overachievement to action deck, until it is removed.',
  tags: [],
  setup(marsBot) {
    marsBot.removeBonusCard(BonusCardId.B04_OVERACHIEVEMENT);
    marsBot.game.log('MarsBot (Vitor): Overachievement separated from bonus deck');
  },
  effect: {
    onProjectCardResolved(marsBot, card) {
      // The VP printed on the card counts, not what it scores right now
      const printedVp = printedVictoryPoints(card);
      if (printedVp !== undefined && printedVp >= 0) {
        marsBot.gainMc(3);
        marsBot.game.log('MarsBot (Vitor): non-negative VP card, +3 M€');
      }
    },
  },
  ...bonusCardBeforeActionPhase(BonusCardId.B04_OVERACHIEVEMENT, 'Vitor'),
};
