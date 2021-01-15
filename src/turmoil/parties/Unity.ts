import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Tags} from '../../cards/Tags';
import {Resources} from '../../Resources';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {Player} from '../../Player';
import {POLITICAL_AGENDAS_MAX_ACTION_USES} from '../../constants';
import {ICard} from '../../cards/ICard';
import {LogHelper} from '../../LogHelper';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {ResourceType} from '../../ResourceType';
import {TurmoilPolicy} from '../TurmoilPolicy';

export class Unity extends Party implements IParty {
  name = PartyName.UNITY;
  description: string = 'Wants to see humanity prosper in the whole solar system.';
  bonuses = [UNITY_BONUS_1, UNITY_BONUS_2];
  policies = [UNITY_POLICY_1, UNITY_POLICY_2, UNITY_POLICY_3, UNITY_POLICY_4];
}

class UnityBonus01 implements Bonus {
  id = 'ub01';
  description = 'Gain 1 MC for each Venus, Earth and Jovian tag you have';
  isDefault = true;

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const tags = [Tags.VENUS, Tags.EARTH, Tags.JOVIAN];
      const tagCount = tags.map((tag) => player.getTagCount(tag, false, false)).reduce((acc, count) => acc + count, 0);

      player.setResource(Resources.MEGACREDITS, tagCount);
    });
  }
}

class UnityBonus02 implements Bonus {
  id = 'ub02';
  description = 'Gain 1 MC for each Space tag you have';
  isDefault = false;

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const tagCount = player.getTagCount(Tags.SPACE, false, false);
      player.setResource(Resources.MEGACREDITS, tagCount);
    });
  }
}

class UnityPolicy01 implements Policy {
  isDefault = true;
  id = TurmoilPolicy.UNITY_DEFAULT_POLICY;
  description: string = 'Your titanium resources are worth 1 MC extra';
}

class UnityPolicy02 implements Policy {
  id = TurmoilPolicy.UNITY_POLICY_2;
  description: string = 'Spend 4 MC to gain 2 titanium or add 2 floaters to any card (Turmoil Unity)';
  isDefault = false;

  canAct(player: Player) {
    return player.canAfford(4) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Unity action', (b) => b.player(player));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectHowToPayDeferred(
      player,
      4,
      {
        title: 'Select how to pay for Turmoil Unity action',
        afterPay: () => {
          const availableFloaterCards = player.getResourceCards(ResourceType.FLOATER);
          const orOptions = new OrOptions();

          if (availableFloaterCards.length === 1) {
            orOptions.options.push(
              new SelectOption('Add 2 floaters to ' + availableFloaterCards[0].name, 'Confirm', () => {
                player.addResourceTo(availableFloaterCards[0], 2);
                LogHelper.logAddResource(player, availableFloaterCards[0], 2);

                return undefined;
              }),
            );
          } else if (availableFloaterCards.length > 1) {
            orOptions.options.push(
              new SelectOption('Add 2 floaters to a card', 'Confirm', () => {
                return new SelectCard('Select card to add 2 floaters', 'Add floaters', availableFloaterCards, (foundCards: Array<ICard>) => {
                  player.addResourceTo(foundCards[0], 2);
                  LogHelper.logAddResource(player, foundCards[0], 2);
                  return undefined;
                });
              }),
            );
          }

          orOptions.options.push(new SelectOption('Gain 2 titanium', 'Confirm', () => {
            player.setResource(Resources.TITANIUM, 2);
            game.log('${0} gained 2 titanium', (b) => b.player(player));
            return undefined;
          }));

          if (orOptions.options.length === 1) return orOptions.options[0].cb();

          game.defer(new DeferredAction(player, () => orOptions));
          return undefined;
        },
      },
    ));

    return undefined;
  }
}

class UnityPolicy03 implements Policy {
  id = TurmoilPolicy.UNITY_POLICY_3;
  description: string = 'Spend 4 MC to draw a Space card (Turmoil Unity)';
  isDefault = false;

  canAct(player: Player) {
    return player.canAfford(4) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Unity action', (b) => b.player(player));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectHowToPayDeferred(
      player,
      4,
      {
        title: 'Select how to pay for Turmoil Unity action',
        afterPay: () => {
          player.drawCard(1, {tag: Tags.SPACE});
        },
      },
    ));

    return undefined;
  }
}

class UnityPolicy04 implements Policy {
  id = TurmoilPolicy.UNITY_POLICY_4;
  description: string = 'Cards with Space tags cost 2 MC less to play';
  isDefault = false;
}

export const UNITY_BONUS_1 = new UnityBonus01();
export const UNITY_BONUS_2 = new UnityBonus02();
export const UNITY_POLICY_1 = new UnityPolicy01();
export const UNITY_POLICY_2 = new UnityPolicy02();
export const UNITY_POLICY_3 = new UnityPolicy03();
export const UNITY_POLICY_4 = new UnityPolicy04();
