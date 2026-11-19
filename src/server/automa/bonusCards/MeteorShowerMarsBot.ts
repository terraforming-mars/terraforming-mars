import {Resource} from '@/common/Resource';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusCardEffect} from '@/server/automa/bonusCards/MarsBotBonusCardEffect';

export class MeteorShowerMarsBot extends MarsBotBonusCardEffect {
  constructor() {
    super({id: BonusCardId.B01_METEOR_SHOWER});
  }

  public override resolve(marsBot: IMarsBot): boolean {
    const name = createBonusCard(this.id).name;
    // Asteroid Deflection System and Protected Habitat block plant removal
    if (marsBot.humanPlayer.plantsAreProtected()) {
      marsBot.game.log('MarsBot (${0}): blocked by plant protection', (b) => b.cardName(name));
      marsBot.game.log('MarsBot (${0}): card destroyed', (b) => b.cardName(name));
      return true;
    }
    const plantsLost = Math.min(5, marsBot.humanPlayer.plants);
    if (plantsLost > 0) {
      // Coming from MarsBot, so the player may Law Suit it.
      marsBot.humanPlayer.stock.deduct(Resource.PLANTS, plantsLost, {from: {player: marsBot.player}});
      marsBot.game.log('MarsBot (${0}): ${1} loses ${2} plants', (b) => b.cardName(name).player(marsBot.humanPlayer).number(plantsLost));
    }
    if (plantsLost >= 3) {
      marsBot.game.log('MarsBot (${0}): card destroyed', (b) => b.cardName(name));
      return true;
    }
    return false;
  }
}
