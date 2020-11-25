import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {Player} from '../../Player';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';

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

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const heatProduction = player.getProduction(Resources.HEAT);
      player.setResource(Resources.HEAT, heatProduction);
    });
  }
}

export class KelvinistsPolicy01 implements Policy {
  isDefault = true;
  id = 'kp01';
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
  id = 'kp02';
  description: string = 'Whenever you raise temperature, gain 2 MC';
}

export class KelvinistsPolicy03 implements Policy {
  id = 'kp03';
  description: string = 'Decrease your heat production 2 steps to gain 1 TR (Turmoil Kelvinists)';

  canAct(player: Player) {
    return player.getProduction(Resources.HEAT) >= 2;
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Kelvinists action', (b) => b.player(player));
    game.log('${0} decreased heat production 2 steps to gain 1 TR', (b) => b.player(player));

    player.addProduction(Resources.HEAT, -2);
    player.increaseTerraformRating(game);
    return undefined;
  }
}

export class KelvinistsPolicy04 implements Policy {
  id = 'kp04';
  description: string = 'Whenever you place a tile, gain 2 heat';

  onTilePlaced(player: Player) {
    player.setResource(Resources.HEAT, 2);
  }
}
