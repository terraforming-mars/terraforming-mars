import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../../common/Resources';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {Player} from '../../Player';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {MAX_TEMPERATURE} from '../../../common/constants';
import {CardName} from '../../../common/cards/CardName';

export class Kelvinists extends Party implements IParty {
  readonly name = PartyName.KELVINISTS;
  readonly description = 'Pushes for rapid terraforming, usually employing a heat-first strategy.';
  readonly bonuses = [KELVINISTS_BONUS_1, KELVINISTS_BONUS_2];
  readonly policies = [KELVINISTS_POLICY_1, KELVINISTS_POLICY_2, KELVINISTS_POLICY_3, KELVINISTS_POLICY_4];
}

class KelvinistsBonus01 implements Bonus {
  readonly id = 'kb01' as const;
  readonly isDefault = true;
  readonly description = 'Gain 1 M€ for each Heat production you have';

  getScore(player: Player) {
    return player.production.heat;
  }

  grant(game: Game) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.MEGACREDITS, this.getScore(player));
    });
  }
}

class KelvinistsBonus02 implements Bonus {
  readonly id = 'kb02' as const;
  readonly description = 'Gain 1 heat for each Heat production you have';
  readonly isDefault = false;

  getScore(player: Player) {
    return player.production.heat;
  }

  grant(game: Game) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.HEAT, this.getScore(player));
    });
  }
}

class KelvinistsPolicy01 implements Policy {
  readonly isDefault = true;
  readonly id = 'kp01' as const;
  description(player: Player | undefined): string {
    const cost = player === undefined ? 10 : this.cost(player);
    return `Pay ${cost} M€ to increase your Energy and Heat production 1 step (Turmoil Kelvinists)`;
  }

  cost(player: Player): number {
    return player.cardIsInEffect(CardName.HIGH_TEMP_SUPERCONDUCTORS) ? 7: 10;
  }
  canAct(player: Player) {
    return player.canAfford(this.cost(player));
  }

  action(player: Player) {
    const game = player.game;
    game.log('${0} used Turmoil Kelvinists action', (b) => b.player(player));
    game.defer(new SelectPaymentDeferred(
      player,
      this.cost(player),
      {
        title: 'Select how to pay for Turmoil Kelvinists action',
        afterPay: () => {
          player.production.add(Resources.ENERGY, 1);
          player.production.add(Resources.HEAT, 1);
          game.log('${0} increased heat and energy production 1 step', (b) => b.player(player));
        },
      },
    ));

    return undefined;
  }
}

class KelvinistsPolicy02 implements Policy {
  readonly id = 'kp02' as const;
  readonly description = 'When you raise temperature, gain 3 M€ per step raised';
  readonly isDefault = false;
}

class KelvinistsPolicy03 implements Policy {
  readonly id = 'kp03' as const;
  readonly description = 'Convert 6 heat into temperature (Turmoil Kelvinists)';
  readonly isDefault = false;

  canAct(player: Player) {
    return player.availableHeat() >= 6 && player.game.getTemperature() < MAX_TEMPERATURE;
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
  readonly id = 'kp04' as const;
  readonly description = 'When you place a tile, gain 2 heat';
  readonly isDefault = false;

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
