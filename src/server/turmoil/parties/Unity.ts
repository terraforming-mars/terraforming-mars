import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {IPlayer} from '../../IPlayer';
import {POLITICAL_AGENDAS_MAX_ACTION_USES} from '../../../common/constants';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {CardResource} from '../../../common/CardResource';
import {sum} from '../../../common/utils/utils';
import {TITLES} from '../../inputs/titles';

export class Unity extends Party implements IParty {
  name = PartyName.UNITY;
  description = 'Wants to see humanity prosper in the whole solar system.';
  bonuses = [UNITY_BONUS_1, UNITY_BONUS_2];
  policies = [UNITY_POLICY_1, UNITY_POLICY_2, UNITY_POLICY_3, UNITY_POLICY_4];
}

class UnityBonus01 implements Bonus {
  id = 'ub01' as const;
  description = 'Gain 1 M€ for each Venus, Earth and Jovian tag you have';

  getScore(player: IPlayer) {
    const tags = [Tag.VENUS, Tag.EARTH, Tag.JOVIAN];
    return sum(tags.map((tag) => player.tags.count(tag, 'raw')));
  }

  grant(game: IGame) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.stock.add(Resource.MEGACREDITS, this.getScore(player));
    });
  }
}

class UnityBonus02 implements Bonus {
  id = 'ub02' as const;
  description = 'Gain 1 M€ for each Space tag you have';

  getScore(player: IPlayer) {
    return player.tags.count(Tag.SPACE, 'raw');
  }

  grant(game: IGame) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.stock.add(Resource.MEGACREDITS, this.getScore(player));
    });
  }
}

class UnityPolicy01 implements Policy {
  id = 'up01' as const;
  description = 'Your titanium resources are worth 1 M€ extra';

  onPolicyStart(game: IGame): void {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.increaseTitaniumValue();
    });
  }
  onPolicyEnd(game: IGame): void {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.decreaseTitaniumValue();
    });
  }
}

class UnityPolicy02 implements Policy {
  id = 'up02' as const;
  description = 'Spend 4 M€ to gain 2 titanium or add 2 floaters to ANY card (Turmoil Unity)';

  canAct(player: IPlayer) {
    return player.canAfford(4) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil Unity action', (b) => b.player(player));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectPaymentDeferred(player, 4, {title: TITLES.payForPartyAction(PartyName.UNITY)}))
      .andThen(() => {
        const availableFloaterCards = player.getResourceCards(CardResource.FLOATER);
        const orOptions = new OrOptions();

        if (availableFloaterCards.length === 1) {
          orOptions.options.push(
            new SelectOption('Add 2 floaters to ' + availableFloaterCards[0].name, 'Confirm', () => {
              player.addResourceTo(availableFloaterCards[0], {qty: 2, log: true});

              return undefined;
            }),
          );
        } else if (availableFloaterCards.length > 1) {
          orOptions.options.push(
            new SelectOption('Add 2 floaters to a card', 'Confirm', () => {
              return new SelectCard('Select card to add 2 floaters', 'Add floaters', availableFloaterCards, ([card]) => {
                player.addResourceTo(card, {qty: 2, log: true});
                return undefined;
              });
            }),
          );
        }

        orOptions.options.push(new SelectOption('Gain 2 titanium', 'Confirm', () => {
          player.stock.add(Resource.TITANIUM, 2);
          game.log('${0} gained 2 titanium', (b) => b.player(player));
          return undefined;
        }));

        if (orOptions.options.length === 1) return orOptions.options[0].cb();

        game.defer(new SimpleDeferredAction(player, () => orOptions));
        return undefined;
      });

    return undefined;
  }
}

class UnityPolicy03 implements Policy {
  id = 'up03' as const;
  description = 'Spend 4 M€ to draw a Space card (Turmoil Unity)';

  canAct(player: IPlayer) {
    return player.canAfford(4) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil Unity action', (b) => b.player(player));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectPaymentDeferred(player, 4, {title: TITLES.payForPartyAction(PartyName.UNITY)}))
      .andThen(() => player.drawCard(1, {tag: Tag.SPACE}));

    return undefined;
  }
}

class UnityPolicy04 implements Policy {
  id = 'up04' as const;
  description = 'Cards with Space tags cost 2 M€ less to play';
}

export const UNITY_BONUS_1 = new UnityBonus01();
export const UNITY_BONUS_2 = new UnityBonus02();
export const UNITY_POLICY_1 = new UnityPolicy01();
export const UNITY_POLICY_2 = new UnityPolicy02();
export const UNITY_POLICY_3 = new UnityPolicy03();
export const UNITY_POLICY_4 = new UnityPolicy04();
