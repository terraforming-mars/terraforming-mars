import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {IPlayer} from '../../IPlayer';
import {Policy} from '../Policy';
import {TITLES} from '../../inputs/titles';

export class Scientists extends Party implements IParty {
  readonly name = PartyName.SCIENTISTS as const;
  readonly description = 'Tech is the door to the future, and Scientists will do anything to open it.' as const;
  readonly bonuses = [SCIENTISTS_BONUS_1, SCIENTISTS_BONUS_2];
  readonly policies = [SCIENTISTS_POLICY_1, SCIENTISTS_POLICY_2, SCIENTISTS_POLICY_3, SCIENTISTS_POLICY_4];
}

class ScientistsBonus01 implements Bonus {
  readonly id = 'sb01' as const;
  readonly description = 'Gain 1 M€ for each science tag you have';

  getScore(player: IPlayer) {
    return player.tags.count(Tag.SCIENCE, 'raw-pf');
  }

  grant(game: IGame) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.stock.add(Resource.MEGACREDITS, this.getScore(player));
    });
  }
}

class ScientistsBonus02 implements Bonus {
  readonly id = 'sb02' as const;
  readonly description = 'Gain 1 M€ for every 3 cards in hand';

  getScore(player: IPlayer) {
    return Math.floor(player.cardsInHand.length / 3);
  }

  grant(game: IGame) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.stock.add(Resource.MEGACREDITS, this.getScore(player));
    });
  }
}

class ScientistsPolicy01 implements Policy {
  readonly id = 'sp01' as const;
  readonly description = 'Pay 10 M€ to draw 3 cards (Turmoil Scientists)';

  canAct(player: IPlayer) {
    return player.canAfford(10) && player.turmoilPolicyActionUsed === false;
  }

  action(player: IPlayer) {
    const game = player.game;
    // TODO(kberg): use Message for "Turmoil {partyname}" action.
    game.log('${0} used Turmoil Scientists action', (b) => b.player(player));
    game.defer(new SelectPaymentDeferred(player, 10, {title: TITLES.payForPartyAction(PartyName.SCIENTISTS)}))
      .andThen(() => {
        player.drawCard(3);
        player.turmoilPolicyActionUsed = true;
      });

    return undefined;
  }
}

class ScientistsPolicy02 implements Policy {
  readonly id = 'sp02' as const;
  readonly description = 'Your global requirements are +/- 2 steps';
}

class ScientistsPolicy03 implements Policy {
  readonly id = 'sp03' as const;
  readonly description = 'When you raise a global parameter, draw a card per step raised';
}

class ScientistsPolicy04 implements Policy {
  readonly id = 'sp04' as const;
  readonly description = 'Cards with Science tag requirements may be played with 1 less Science tag';

  onPolicyStart(game: IGame) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.hasTurmoilScienceTagBonus = true;
    });
  }

  onPolicyEnd(game: IGame) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.hasTurmoilScienceTagBonus = false;
    });
  }
}

export const SCIENTISTS_BONUS_1 = new ScientistsBonus01();
export const SCIENTISTS_BONUS_2 = new ScientistsBonus02();
export const SCIENTISTS_POLICY_1 = new ScientistsPolicy01();
export const SCIENTISTS_POLICY_2 = new ScientistsPolicy02();
export const SCIENTISTS_POLICY_3 = new ScientistsPolicy03();
export const SCIENTISTS_POLICY_4 = new ScientistsPolicy04();
