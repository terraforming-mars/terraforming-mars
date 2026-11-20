import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';

export class ResearchAndDevelopmentMarsBot extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B03_RESEARCH_AND_DEVELOPMENT, name: CardName.AUTOMA_RESEARCH_AND_DEVELOPMENT});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const drawnCard = marsBot.game.projectDeck.draw(marsBot.game);
    if (drawnCard !== undefined) {
      marsBot.game.log('MarsBot (${0}): draws and resolves ${1}', (b) => b.cardName(this.name).card(drawnCard));
      marsBot.resolveProjectCard(drawnCard);
    }
    return false;
  }
}
