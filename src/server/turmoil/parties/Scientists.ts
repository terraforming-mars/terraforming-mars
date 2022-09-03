import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';
import {Bonus} from '../Bonus';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {Player} from '../../Player';
import {Policy} from '../Policy';

export class Scientists extends Party implements IParty {
  readonly name = PartyName.SCIENTISTS as const;
  readonly description = 'Tech is the door to the future, and Scientists will do anything to open it.' as const;
  readonly bonuses = [SCIENTISTS_BONUS_1, SCIENTISTS_BONUS_2];
  readonly policies = [SCIENTISTS_POLICY_1, SCIENTISTS_POLICY_2, SCIENTISTS_POLICY_3, SCIENTISTS_POLICY_4];
}

class ScientistsBonus01 implements Bonus {
  readonly id = 'sb01' as const;
  readonly isDefault = true;
  readonly description = 'Gain 1 M€ for each Science tag you have';

  getScore(player: Player) {
    return player.tags.count(Tag.SCIENCE, 'raw-pf');
  }

  grant(game: Game) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.MEGACREDITS, this.getScore(player));
    });
  }
}

class ScientistsBonus02 implements Bonus {
  readonly id = 'sb02' as const;
  readonly description = 'Gain 1 M€ for every 3 cards in hand';
  readonly isDefault = false;

  getScore(player: Player) {
    return Math.floor(player.cardsInHand.length / 3);
  }

  grant(game: Game) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.MEGACREDITS, this.getScore(player));
    });
  }
}

class ScientistsPolicy01 implements Policy {
  readonly isDefault = true;
  readonly id = 'sp01' as const;
  readonly description = 'Pay 10 M€ to draw 3 cards (Turmoil Scientists)';

  canAct(player: Player) {
    return player.canAfford(10) && player.turmoilPolicyActionUsed === false;
  }

  action(player: Player) {
    const game = player.game;
    game.log('${0} used Turmoil Scientists action', (b) => b.player(player));
    game.defer(new SelectPaymentDeferred(
      player,
      10,
      {
        title: 'Select how to pay for Turmoil Scientists action',
        afterPay: () => {
          player.drawCard(3);
          player.turmoilPolicyActionUsed = true;
        },
      },
    ));

    return undefined;
  }
}

class ScientistsPolicy02 implements Policy {
  readonly id = 'sp02' as const;
  readonly description = 'Your global requirements are +/- 2 steps';
  readonly isDefault = false;
}

class ScientistsPolicy03 implements Policy {
  readonly id = 'sp03' as const;
  readonly description = 'When you raise a global parameter, draw a card per step raised';
  readonly isDefault = false;
}

class ScientistsPolicy04 implements Policy {
  readonly id = 'sp04' as const;
  readonly description = 'Cards with Science tag requirements may be played with 1 less Science tag';
  readonly isDefault = false;

  apply(game: Game) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.hasTurmoilScienceTagBonus = true;
    });
  }
}

export const SCIENTISTS_BONUS_1 = new ScientistsBonus01();
export const SCIENTISTS_BONUS_2 = new ScientistsBonus02();
export const SCIENTISTS_POLICY_1 = new ScientistsPolicy01();
export const SCIENTISTS_POLICY_2 = new ScientistsPolicy02();
export const SCIENTISTS_POLICY_3 = new ScientistsPolicy03();
export const SCIENTISTS_POLICY_4 = new ScientistsPolicy04();
