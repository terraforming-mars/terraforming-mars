import {CardName} from '@/common/cards/CardName';
import {BonusCardName} from '@/common/automa/BonusCardName';
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
    marsBot.addBonusCardToBonusDeck(BonusCardName.GOVERNMENT_SUBSIDY);
    marsBot.game.log('MarsBot (${0}): ${1} added to bonus deck', (b) => b.cardName(this.name).bonusCardName(BonusCardName.GOVERNMENT_SUBSIDY));
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    if (marsBot.game.generation >= 2) {
      marsBot.maybeMoveBonusCardToActionDeck();
      marsBot.game.log('MarsBot (${0}): added 1 bonus card to action deck', (b) => b.cardName(this.name));
    }
  }
}
