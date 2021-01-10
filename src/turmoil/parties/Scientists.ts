import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Tags} from '../../cards/Tags';
import {Resources} from '../../Resources';
import {Bonus} from '../Bonus';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {Player} from '../../Player';
import {Policy} from '../Policy';
import {TurmoilPolicy} from '../TurmoilPolicy';

export class Scientists extends Party implements IParty {
  name = PartyName.SCIENTISTS;
  description: string = 'Tech is the door to the future, and Scientists will do anything to open it.';
  bonuses = [SCIENTISTS_BONUS_1, SCIENTISTS_BONUS_2];
  policies = [SCIENTISTS_POLICY_1, SCIENTISTS_POLICY_2, SCIENTISTS_POLICY_3, SCIENTISTS_POLICY_4];
}

class ScientistsBonus01 implements Bonus {
  id = 'sb01';
  isDefault = true;
  description: string = 'Gain 1 MC for each Science tag you have';

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const tagCount = player.getTagCount(Tags.SCIENCE, false, false);
      player.setResource(Resources.MEGACREDITS, tagCount);
    });
  }
}

class ScientistsBonus02 implements Bonus {
  id = 'sb02';
  description: string = 'Gain 1 MC for every 3 cards in hand';
  isDefault = false;

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const amount = Math.floor(player.cardsInHand.length / 3);
      player.setResource(Resources.MEGACREDITS, amount);
    });
  }
}

class ScientistsPolicy01 implements Policy {
  isDefault = true;
  id = TurmoilPolicy.SCIENTISTS_DEFAULT_POLICY;
  description: string = 'Pay 10 MC to draw 3 cards (Turmoil Scientists)';

  canAct(player: Player) {
    return player.canAfford(10) && player.turmoilPolicyActionUsed === false;
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Scientists action', (b) => b.player(player));
    game.defer(new SelectHowToPayDeferred(
      player,
      10,
      {
        title: 'Select how to pay for Turmoil Scientists action',
        afterPay: () => {
          player.cardsInHand.push(
            game.dealer.dealCard(),
            game.dealer.dealCard(),
            game.dealer.dealCard(),
          );
          player.turmoilPolicyActionUsed = true;
          game.log('${0} drew 3 cards', (b) => b.player(player));
        },
      },
    ));

    return undefined;
  }
}

class ScientistsPolicy02 implements Policy {
  id = TurmoilPolicy.SCIENTISTS_POLICY_2;
  description: string = 'Your global requirements are +/- 2 steps';
  isDefault = false;
}

class ScientistsPolicy03 implements Policy {
  id = TurmoilPolicy.SCIENTISTS_POLICY_3;
  description: string = 'When you raise a global parameter, draw a card per step raised';
  isDefault = false;
}

class ScientistsPolicy04 implements Policy {
  id = TurmoilPolicy.SCIENTISTS_POLICY_4;
  description: string = 'Cards with Science tag requirements may be played with 1 less Science tag';
  isDefault = false;

  apply(game: Game) {
    game.getPlayers().forEach((player) => {
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
