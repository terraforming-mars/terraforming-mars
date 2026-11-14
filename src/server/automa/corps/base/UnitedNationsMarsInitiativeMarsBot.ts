import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBotCorp} from '@/server/automa/IMarsBotCorp';

// ---- C12 UNMI ----
// Setup: add Government Subsidy (B31) to bonus deck, and take the bonus card dealt at setup back
// out of the action deck. Gen: from gen 2+, add 1 bonus card to action deck before action phase.
export const UNITED_NATIONS_MARS_INITIATIVE_MARSBOT_CORP: IMarsBotCorp = {
  name: CardName.UNITED_NATIONS_MARS_INITIATIVE,
  description: 'Setup: add Government Subsidy to bonus deck; no bonus card in the starting action deck. From generation 2 onward, move 1 bonus card to the action deck each generation.',
  tags: [],
  setup(marsBot) {
    // The setup bonus card was dealt before the corporation was chosen (rulebook A setup step 3)
    marsBot.returnSetupBonusCardToBonusDeck();
    marsBot.addBonusCardToBonusDeck(BonusCardId.B31_GOVERNMENT_SUBSIDY);
    marsBot.game.log('MarsBot (UNMI): Government Subsidy added to bonus deck');
  },
  beforeActionPhase(marsBot) {
    if (marsBot.game.generation >= 2) {
      marsBot.maybeMoveBonusCardToActionDeck();
      marsBot.game.log('MarsBot (UNMI): added 1 bonus card to action deck');
    }
  },
};
