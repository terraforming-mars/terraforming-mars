import {BonusCardName} from '@/common/automa/BonusCardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';

export class ResearchAndDevelopment extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.RESEARCH_AND_DEVELOPMENT);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const drawnCard = marsBot.game.projectDeck.draw(marsBot.game);
    if (drawnCard !== undefined) {
      marsBot.game.log('MarsBot (${0}): draws and resolves ${1}', (b) => b.bonusCardName(this.name).card(drawnCard));
      marsBot.resolveProjectCard(drawnCard);
    }
    return false;
  }
}
