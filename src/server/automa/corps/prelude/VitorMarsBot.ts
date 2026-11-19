import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotCorp} from '@/server/automa/MarsBotCorp';
import {printedVictoryPoints} from '@/server/automa/MarsBotTags';
import {IProjectCard} from '@/server/cards/IProjectCard';

export class VitorMarsBot extends MarsBotCorp {
  constructor() {
    super({
      name: CardName.VITOR,
      description: 'Setup: separate Overachievement from bonus deck. Cards with non-negative VP earn 3 M€. Each generation: add Overachievement to action deck, until it is removed.',
      actionDeckBonusCard: BonusCardId.B04_OVERACHIEVEMENT,
    });
  }

  public override setup(marsBot: IMarsBot): void {
    marsBot.removeBonusCard(BonusCardId.B04_OVERACHIEVEMENT);
    marsBot.game.log('MarsBot (${0}): ${1} separated from bonus deck', (b) => b.cardName(this.name).cardName(createBonusCard(BonusCardId.B04_OVERACHIEVEMENT).name));
  }

  public override onProjectCardResolved(marsBot: IMarsBot, card: IProjectCard): void {
    // The VP printed on the card counts, not what it scores right now
    const printedVp = printedVictoryPoints(card);
    if (printedVp !== undefined && printedVp >= 0) {
      marsBot.gainMc(3);
      marsBot.game.log('MarsBot (${0}): non-negative VP card, +3:r:mc:', (b) => b.cardName(this.name));
    }
  }

  public override beforeActionPhase(marsBot: IMarsBot): void {
    marsBot.addBonusCardToActionDeck(BonusCardId.B04_OVERACHIEVEMENT);
  }
}
