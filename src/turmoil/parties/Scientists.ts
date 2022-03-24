import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Tags} from '../../common/cards/Tags';
import {Resources} from '../../common/Resources';
import {Bonus} from '../Bonus';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {Player} from '../../Player';
import {Policy} from '../Policy';

export class Scientists extends Party implements IParty {
  name = PartyName.SCIENTISTS;
  description: string = 'Tech is the door to the future, and Scientists will do anything to open it.';
  bonuses = [SCIENTISTS_BONUS_1, SCIENTISTS_BONUS_2];
  policies = [SCIENTISTS_POLICY_1, SCIENTISTS_POLICY_2, SCIENTISTS_POLICY_3, SCIENTISTS_POLICY_4];
}

class ScientistsBonus01 implements Bonus {
  id = 'sb01' as const;
  isDefault = true;
  description: string = 'Gain 1 M€ for each Science tag you have';

  getScore(player: Player) {
    return player.getTagCount(Tags.SCIENCE, 'raw');
  }

  grant(game: Game) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.MEGACREDITS, this.getScore(player));
    });
  }
}

class ScientistsBonus02 implements Bonus {
  id = 'sb02' as const;
  description: string = 'Gain 1 M€ for every 3 cards in hand';
  isDefault = false;

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
  isDefault = true;
  id = 'sp01' as const;
  description: string = 'Pay 10 M€ to draw 3 cards (Turmoil Scientists)';

  canAct(player: Player) {
    return player.canAfford(10) && player.turmoilPolicyActionUsed === false;
  }

  action(player: Player) {
    const game = player.game;
    game.log('${0} used Turmoil Scientists action', (b) => b.player(player));
    game.defer(new SelectHowToPayDeferred(
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
  id = 'sp02' as const;
  description: string = 'Your global requirements are +/- 2 steps';
  isDefault = false;
}

class ScientistsPolicy03 implements Policy {
  id = 'sp03' as const;
  description: string = 'When you raise a global parameter, draw a card per step raised';
  isDefault = false;
}

class ScientistsPolicy04 implements Policy {
  id = 'sp04' as const;
  description: string = 'Cards with Science tag requirements may be played with 1 less Science tag';
  isDefault = false;

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
