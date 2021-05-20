import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {Player} from '../../Player';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {TurmoilPolicy} from '../TurmoilPolicy';

export class Kelvinists extends Party implements IParty {
  name = PartyName.KELVINISTS;
  description = 'Pushes for rapid terraforming, usually employing a heat-first strategy.';
  bonuses = [KELVINISTS_BONUS_1, KELVINISTS_BONUS_2];
  policies = [KELVINISTS_POLICY_1, KELVINISTS_POLICY_2, KELVINISTS_POLICY_3, KELVINISTS_POLICY_4];
}

class KelvinistsBonus01 implements Bonus {
  id = 'kb01';
  isDefault = true;
  description = 'Gain 1 M€ for each Heat production you have';

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const heatProduction = player.getProduction(Resources.HEAT);
      player.addResource(Resources.MEGACREDITS, heatProduction);
    });
  }
}

class KelvinistsBonus02 implements Bonus {
  id = 'kb02';
  description = 'Gain 1 heat for each Heat production you have';
  isDefault = false;

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const heatProduction = player.getProduction(Resources.HEAT);
      player.addResource(Resources.HEAT, heatProduction);
    });
  }
}

class KelvinistsPolicy01 implements Policy {
  isDefault = true;
  id = TurmoilPolicy.KELVINISTS_DEFAULT_POLICY;
  description: string = 'Pay 10 M€ to increase your Energy and Heat production 1 step (Turmoil Kelvinists)';

  canAct(player: Player) {
    return player.canAfford(10);
  }

  action(player: Player) {
    const game = player.game;
    game.log('${0} used Turmoil Kelvinists action', (b) => b.player(player));
    game.defer(new SelectHowToPayDeferred(
      player,
      10,
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
  id = TurmoilPolicy.KELVINISTS_POLICY_2;
  description: string = 'When you raise temperature, gain 3 M€ per step raised';
  isDefault = false;
}

class KelvinistsPolicy03 implements Policy {
  id = TurmoilPolicy.KELVINISTS_POLICY_3;
  description: string = 'Convert 6 heat into temperature (Turmoil Kelvinists)';
  isDefault = false;

  canAct(player: Player) {
    return player.heat >= 6;
  }

  action(player: Player) {
    const game = player.game;
    game.log('${0} used Turmoil Kelvinists action', (b) => b.player(player));
    game.log('${0} spent 6 heat to raise temperature 1 step', (b) => b.player(player));

    player.deductResource(Resources.HEAT, 6);
    game.increaseTemperature(player, 1);
    return undefined;
  }
}

class KelvinistsPolicy04 implements Policy {
  id = TurmoilPolicy.KELVINISTS_POLICY_4;
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
