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
  bonuses = [new KelvinistsBonus01(), new KelvinistsBonus02()];
  policies = [new KelvinistsPolicy01(), new KelvinistsPolicy02(), new KelvinistsPolicy03(), new KelvinistsPolicy04()];
}

export class KelvinistsBonus01 implements Bonus {
  id = 'kb01';
  isDefault = true;
  description = 'Gain 1 MC for each Heat production you have';

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const heatProduction = player.getProduction(Resources.HEAT);
      player.setResource(Resources.MEGACREDITS, heatProduction);
    });
  }
}

export class KelvinistsBonus02 implements Bonus {
  id = 'kb02';
  description = 'Gain 1 heat for each Heat production you have';
  isDefault = false;

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const heatProduction = player.getProduction(Resources.HEAT);
      player.setResource(Resources.HEAT, heatProduction);
    });
  }
}

export class KelvinistsPolicy01 implements Policy {
  isDefault = true;
  id = TurmoilPolicy.KELVINISTS_DEFAULT_POLICY;
  description: string = 'Pay 10 MC to increase your Energy and Heat production 1 step (Turmoil Kelvinists)';

  canAct(player: Player) {
    return player.canAfford(10);
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Kelvinists action', (b) => b.player(player));
    game.defer(new SelectHowToPayDeferred(
      player,
      10,
      false,
      false,
      'Select how to pay for action',
      () => {
        player.addProduction(Resources.ENERGY);
        player.addProduction(Resources.HEAT);
        game.log('${0} increased heat and energy production 1 step', (b) => b.player(player));
      },
    ));

    return undefined;
  }
}

export class KelvinistsPolicy02 implements Policy {
  id = TurmoilPolicy.KELVINISTS_POLICY_2;
  description: string = 'When you raise temperature, gain 3 MC per step raised';
  isDefault = false;
}

export class KelvinistsPolicy03 implements Policy {
  id = TurmoilPolicy.KELVINISTS_POLICY_3;
  description: string = 'Convert 6 heat into temperature (Turmoil Kelvinists)';
  isDefault = false;

  canAct(player: Player) {
    return player.heat >= 6;
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Kelvinists action', (b) => b.player(player));
    game.log('${0} spent 6 heat to raise temperature 1 step', (b) => b.player(player));

    player.setResource(Resources.HEAT, -6);
    game.increaseTemperature(player, 1);
    return undefined;
  }
}

export class KelvinistsPolicy04 implements Policy {
  id = TurmoilPolicy.KELVINISTS_POLICY_4;
  description: string = 'When you place a tile, gain 2 heat';
  isDefault = false;

  onTilePlaced(player: Player) {
    player.setResource(Resources.HEAT, 2);
  }
}
