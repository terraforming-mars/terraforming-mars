import {Resource} from '@/common/Resource';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';

export class MeteorShower extends MarsBotBonusCard {
  constructor() {
    super({id: BonusCardId.B01_METEOR_SHOWER, name: CardName.AUTOMA_METEOR_SHOWER});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    // Asteroid Deflection System and Protected Habitat block plant removal
    if (marsBot.humanPlayer.plantsAreProtected()) {
      marsBot.game.log('MarsBot (${0}): blocked by plant protection', (b) => b.cardName(this.name));
      return this.logDestroyed(marsBot);
    }
    const plantsLost = Math.min(5, marsBot.humanPlayer.plants);
    if (plantsLost > 0) {
      // Coming from MarsBot, so the player may Law Suit it.
      marsBot.humanPlayer.stock.deduct(Resource.PLANTS, plantsLost, {from: {player: marsBot.player}});
      marsBot.game.log('MarsBot (${0}): ${1} loses ${2} plants', (b) => b.cardName(this.name).player(marsBot.humanPlayer).number(plantsLost));
    }
    if (plantsLost >= 3) {
      return this.logDestroyed(marsBot);
    }
    return false;
  }
}
