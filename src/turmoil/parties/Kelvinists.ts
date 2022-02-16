import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {Player} from '../../Player';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {MAX_TEMPERATURE} from '../../common/constants';
import {CardName} from '../../common/cards/CardName';

export class Kelvinists extends Party implements IParty {
  name = PartyName.KELVINISTS;
  description = 'Pushes for rapid terraforming, usually employing a heat-first strategy.';
  bonuses = [KELVINISTS_BONUS_1, KELVINISTS_BONUS_2];
  policies = [KELVINISTS_POLICY_1, KELVINISTS_POLICY_2, KELVINISTS_POLICY_3, KELVINISTS_POLICY_4];
}

class KelvinistsBonus01 implements Bonus {
  id = 'kb01' as const;
  isDefault = true;
  description = 'Gain 1 M€ for each Heat production you have';

  getScore(player: Player) {
    return player.getProduction(Resources.HEAT);
  }

  grant(game: Game) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.MEGACREDITS, this.getScore(player));
    });
  }
}

class KelvinistsBonus02 implements Bonus {
  id = 'kb02' as const;
  description = 'Gain 1 heat for each Heat production you have';
  isDefault = false;

  getScore(player: Player) {
    return player.getProduction(Resources.HEAT);
  }

  grant(game: Game) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.HEAT, this.getScore(player));
    });
  }
}

class KelvinistsPolicy01 implements Policy {
  isDefault = true;
  id = 'kp01' as const;
  description: string = 'Pay 10 M€ to increase your Energy and Heat production 1 step (Turmoil Kelvinists)';

  cost(player: Player): number {
    return player.cardIsInEffect(CardName.HIGH_TEMP_SUPERCONDUCTORS) ? 7: 10;
  }
  canAct(player: Player) {
    return player.canAfford(this.cost(player));
  }

  action(player: Player) {
    const game = player.game;
    game.log('${0} used Turmoil Kelvinists action', (b) => b.player(player));
    game.defer(new SelectHowToPayDeferred(
      player,
      this.cost(player),
      {
        title: 'Select how to pay for Turmoil Kelvinists action',
        afterPay: () => {
          player.addProduction(Resources.ENERGY, 1);
          player.addProduction(Resources.HEAT, 1);
          game.log('${0} increased heat and energy production 1 step', (b) => b.player(player));
        },
      },
    ));

    return undefined;
  }
}

class KelvinistsPolicy02 implements Policy {
  id = 'kp02' as const;
  description: string = 'When you raise temperature, gain 3 M€ per step raised';
  isDefault = false;
}

class KelvinistsPolicy03 implements Policy {
  id = 'kp03' as const;
  description: string = 'Convert 6 heat into temperature (Turmoil Kelvinists)';
  isDefault = false;

  canAct(player: Player) {
    return player.availableHeat >= 6 && player.game.getTemperature() < MAX_TEMPERATURE;
  }

  action(player: Player) {
    const game = player.game;
    game.log('${0} used Turmoil Kelvinists action', (b) => b.player(player));
    game.log('${0} spent 6 heat to raise temperature 1 step', (b) => b.player(player));

    return player.spendHeat(6, () => {
      game.increaseTemperature(player, 1);
      return undefined;
    });
  }
}

class KelvinistsPolicy04 implements Policy {
  id = 'kp04' as const;
  description: string = 'When you place a tile, gain 2 heat';
  isDefault = false;

  onTilePlaced(player: Player) {
    player.addResource(Resources.HEAT, 2);
  }
}

export const KELVINISTS_BONUS_1 = new KelvinistsBonus01();
export const KELVINISTS_BONUS_2 = new KelvinistsBonus02();
export const KELVINISTS_POLICY_1 = new KelvinistsPolicy01();
export const KELVINISTS_POLICY_2 = new KelvinistsPolicy02();
export const KELVINISTS_POLICY_3 = new KelvinistsPolicy03();
export const KELVINISTS_POLICY_4 = new KelvinistsPolicy04();
