import {BonusCardName} from '@/common/automa/BonusCardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCard';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';

export class LocalNeuralInstance extends MarsBotBonusCard {
  constructor() {
    super(BonusCardName.LOCAL_NEURAL_INSTANCE);
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const space = new MarsBotTilePlacer(marsBot).findNeuralInstanceSpace();
    if (space !== undefined) {
      marsBot.placeNeuralInstance(space);
      marsBot.game.log('MarsBot (${0}): places the Neural Instance tile', (b) => b.bonusCardName(this.name));
      return this.logDestroyed(marsBot);
    }
    // With no space for the tile, MarsBot draws and resolves a project card and keeps this card
    // (designer ruling, BGG 3350125).
    const drawnCard = marsBot.game.projectDeck.draw(marsBot.game);
    if (drawnCard !== undefined) {
      marsBot.game.log('MarsBot (${0}): no space for the tile, draws and resolves ${1}', (b) => b.bonusCardName(this.name).card(drawnCard));
      marsBot.resolveProjectCard(drawnCard);
    }
    return false;
  }
}
