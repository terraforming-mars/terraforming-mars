import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {IPolicy} from '../Policy';
import {IPlayer} from '../../IPlayer';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {MAX_TEMPERATURE} from '../../../common/constants';
import {CardName} from '../../../common/cards/CardName';
import {TITLES} from '../../inputs/titles';

export class Kelvinists extends Party implements IParty {
  readonly name = PartyName.KELVINISTS;
  readonly bonuses = [KELVINISTS_BONUS_1, KELVINISTS_BONUS_2];
  readonly policies = [KELVINISTS_POLICY_1, KELVINISTS_POLICY_2, KELVINISTS_POLICY_3, KELVINISTS_POLICY_4];
}

class KelvinistsBonus01 extends Bonus {
  readonly id = 'kb01' as const;
  readonly description = 'Gain 1 M€ for each heat production you have';

  getScore(player: IPlayer) {
    return player.production.heat;
  }

  grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player));
  }
}

class KelvinistsBonus02 extends Bonus {
  readonly id = 'kb02' as const;
  readonly description = 'Gain 1 heat for each heat production you have';

  getScore(player: IPlayer) {
    return player.production.heat;
  }

  grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.HEAT, this.getScore(player));
  }
}

class KelvinistsPolicy01 implements IPolicy {
  readonly id = 'kp01' as const;
  description(player: IPlayer | undefined): string {
    const cost = player === undefined ? 10 : this.cost(player);
    return `Pay ${cost} M€ to increase your energy and heat production 1 step (Turmoil Kelvinists)`;
  }

  cost(player: IPlayer): number {
    return player.cardIsInEffect(CardName.HIGH_TEMP_SUPERCONDUCTORS) ? 7: 10;
  }
  canAct(player: IPlayer) {
    return player.canAfford(this.cost(player));
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.KELVINISTS));
    game.defer(new SelectPaymentDeferred(player, this.cost(player), {title: TITLES.payForPartyAction(PartyName.KELVINISTS)}))
      .andThen(() => {
        player.production.add(Resource.ENERGY, 1);
        player.production.add(Resource.HEAT, 1);
        game.log('${0} increased heat and energy production 1 step', (b) => b.player(player));
      });

    return undefined;
  }
}

class KelvinistsPolicy02 implements IPolicy {
  readonly id = 'kp02' as const;
  readonly description = 'When you raise temperature, gain 3 M€ per step raised';
}

class KelvinistsPolicy03 implements IPolicy {
  readonly id = 'kp03' as const;
  readonly description = 'Convert 6 heat into temperature (Turmoil Kelvinists)';

  canAct(player: IPlayer) {
    return player.availableHeat() >= 6 && player.game.getTemperature() < MAX_TEMPERATURE;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.KELVINISTS));
    game.log('${0} spent 6 heat to raise temperature 1 step', (b) => b.player(player));

    return player.spendHeat(6, () => {
      game.increaseTemperature(player, 1);
      return undefined;
    });
  }
}

class KelvinistsPolicy04 implements IPolicy {
  readonly id = 'kp04' as const;
  readonly description = 'When you place a tile, gain 2 heat';

  onTilePlaced(player: IPlayer) {
    player.stock.add(Resource.HEAT, 2);
  }
}

export const KELVINISTS_BONUS_1 = new KelvinistsBonus01();
export const KELVINISTS_BONUS_2 = new KelvinistsBonus02();
export const KELVINISTS_POLICY_1 = new KelvinistsPolicy01();
export const KELVINISTS_POLICY_2 = new KelvinistsPolicy02();
export const KELVINISTS_POLICY_3 = new KelvinistsPolicy03();
export const KELVINISTS_POLICY_4 = new KelvinistsPolicy04();
