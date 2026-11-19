import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';

export class LocalNeuralInstanceMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B07_LOCAL_NEURAL_INSTANCE});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const name = createBonusCard(this.id).name;
    const space = new MarsBotTilePlacer(marsBot).findNeuralInstanceSpace();
    if (space !== undefined) {
      marsBot.placeNeuralInstance(space);
      marsBot.game.log('MarsBot (${0}): places the Neural Instance tile, card destroyed', (b) => b.cardName(name));
      return true;
    }
    // With no space for the tile, MarsBot draws and resolves a project card and keeps this card
    // (designer ruling, BGG 3350125).
    const drawnCard = marsBot.game.projectDeck.draw(marsBot.game);
    if (drawnCard !== undefined) {
      marsBot.game.log('MarsBot (${0}): no space for the tile, draws and resolves ${1}', (b) => b.cardName(name).card(drawnCard));
      marsBot.resolveProjectCard(drawnCard);
    }
    return false;
  }
}
