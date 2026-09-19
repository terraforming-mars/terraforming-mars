import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {IPlayer} from '../../IPlayer';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {MAX_TEMPERATURE} from '../../../common/constants';
import {CardName} from '../../../common/cards/CardName';
import {TITLES} from '../../inputs/titles';
import {SelectOption} from '../../inputs/SelectOption';
import {Units} from '../../../common/Units';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class Kelvinists extends Party implements IParty {
  readonly name = PartyName.KELVINISTS;
  readonly bonuses = [KELVINISTS_BONUS_1, KELVINISTS_BONUS_2];
  readonly policies = [KELVINISTS_POLICY_1, KELVINISTS_POLICY_2, KELVINISTS_POLICY_3, KELVINISTS_POLICY_4];
}

class KelvinistsBonus01 extends Bonus {
  constructor() {
    super(
      'kb01',
      'Gain 1 M€ for each heat production you have',
      CardRenderer.builder((b) => b.megacredits(1).slash().production((pb) => pb.heat(1))),
    );
  }

  getScore(player: IPlayer) {
    return player.production.heat;
  }

  override grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player), {log: true, from: {partyName: PartyName.KELVINISTS}});
  }
}

class KelvinistsBonus02 extends Bonus {
  constructor() {
    super(
      'kb02',
      'Gain 1 heat for each heat production you have',
      CardRenderer.builder((b) => b.heat(1).slash().production((pb) => pb.heat(1))),
    );
  }

  getScore(player: IPlayer) {
    return player.production.heat;
  }

  override grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.HEAT, this.getScore(player), {log: true, from: {partyName: PartyName.KELVINISTS}});
  }
}

class KelvinistsPolicy01 extends Policy {
  constructor() {
    super(
      'kp01',
      (player) => {
        const cost = player === undefined ? 10 : KelvinistsPolicy01.cost(player);
        return `Pay ${cost} M€ to increase your energy and heat production 1 step (Turmoil Kelvinists)`;
      },
      CardRenderer.builder((b) => b.megacredits(10).arrowInfinity().production((pb) => pb.energy(1).heat(1))),
    );
  }

  static cost(player: IPlayer): number {
    return player.tableau.has(CardName.HIGH_TEMP_SUPERCONDUCTORS) ? 7: 10;
  }
  canAct(player: IPlayer) {
    return player.canAfford(KelvinistsPolicy01.cost(player));
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.KELVINISTS));
    game.defer(new SelectPaymentDeferred(player, KelvinistsPolicy01.cost(player), {title: TITLES.payForPartyAction(PartyName.KELVINISTS)}))
      .andThen(() => {
        player.production.add(Resource.ENERGY, 1);
        player.production.add(Resource.HEAT, 1);
        game.log('${0} increased heat and energy production 1 step', (b) => b.player(player));
      });

    return undefined;
  }
}

class KelvinistsPolicy02 extends Policy {
  constructor() {
    super(
      'kp02',
      'When you raise temperature, gain 3 M€ per step raised',
      CardRenderer.builder((b) => b.temperature(1).colon().megacredits(3)),
    );
  }
}

// Hack: action() returns the SelectOption that Player.getActions() drops into
// the Convert Heat slot, instead of performing the conversion itself. To avoid
// rendering it twice, TurmoilHandler.partyAction() skips kp03.
class KelvinistsPolicy03 extends Policy {
  constructor() {
    super(
      'kp03',
      'Convert 6 heat into temperature (Turmoil Kelvinists)',
      CardRenderer.builder((b) => b.heat(6).arrowInfinity().temperature(1)),
    );
  }

  canAct(player: IPlayer): boolean {
    return player.availableHeat() >= 6 && player.canAfford({
      cost: 0,
      tr: {temperature: 1},
      reserveUnits: Units.of({heat: 6}),
    });
  }

  action(player: IPlayer): SelectOption {
    const option = new SelectOption('Convert 6 heat into temperature (Turmoil Kelvinists)', 'Convert heat').andThen(() => {
      return player.spendHeat(6, () => {
        const game = player.game;
        game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.KELVINISTS));
        game.log('${0} spent 6 heat to raise temperature 1 step', (b) => b.player(player));
        game.increaseTemperature(player, 1);
        return undefined;
      });
    });
    if (player.game.getTemperature() === MAX_TEMPERATURE) {
      option.warnings = ['maxtemp'];
      option.eligibleForDefault = false;
    }
    return option;
  }
}

class KelvinistsPolicy04 extends Policy {
  constructor() {
    super(
      'kp04',
      'When you place a tile, gain 2 heat',
      CardRenderer.builder((b) => b.emptyTile().colon().heat(2)),
    );
  }

  onTilePlaced(player: IPlayer) {
    player.stock.add(Resource.HEAT, 2, {log: true, from: {partyName: PartyName.KELVINISTS}});
  }
}

export const KELVINISTS_BONUS_1 = new KelvinistsBonus01();
export const KELVINISTS_BONUS_2 = new KelvinistsBonus02();
export const KELVINISTS_POLICY_1 = new KelvinistsPolicy01();
export const KELVINISTS_POLICY_2 = new KelvinistsPolicy02();
export const KELVINISTS_POLICY_3 = new KelvinistsPolicy03();
export const KELVINISTS_POLICY_4 = new KelvinistsPolicy04();
