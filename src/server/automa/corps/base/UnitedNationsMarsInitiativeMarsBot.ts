import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';

export class UnitedNationsMarsInitiativeMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.UNITED_NATIONS_MARS_INITIATIVE,
      description: 'Setup: add Government Subsidy to bonus deck; no bonus card in the starting action deck. From generation 2 onward, move 1 bonus card to the action deck each generation.',
    });
  }

  public override setup(marsBot: IMarsBot): void {
    // The setup bonus card was dealt before the corporation was chosen (rulebook A setup step 3)
    marsBot.returnSetupBonusCardToBonusDeck();
    marsBot.addBonusCardToBonusDeck(BonusCardId.B31_GOVERNMENT_SUBSIDY);
    marsBot.game.log('MarsBot (UNMI): Government Subsidy added to bonus deck');
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    if (marsBot.game.generation >= 2) {
      marsBot.maybeMoveBonusCardToActionDeck();
      marsBot.game.log('MarsBot (UNMI): added 1 bonus card to action deck');
    }
  }
}
