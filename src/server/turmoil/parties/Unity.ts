import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {IPlayer} from '../../IPlayer';
import {POLITICAL_AGENDAS_MAX_ACTION_USES} from '../../../common/constants';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {CardResource} from '../../../common/CardResource';
import {sum} from '../../../common/utils/utils';
import {TITLES} from '../../inputs/titles';
import {message} from '../../logs/MessageBuilder';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {digit} from '@/server/cards/Options';

export class Unity extends Party implements IParty {
  name = PartyName.UNITY;
  bonuses = [UNITY_BONUS_1, UNITY_BONUS_2];
  policies = [UNITY_POLICY_1, UNITY_POLICY_2, UNITY_POLICY_3, UNITY_POLICY_4];
}

class UnityBonus01 extends Bonus {
  constructor() {
    super(
      'ub01',
      'Gain 1 M€ for each Venus, Earth and Jovian tag you have',
      CardRenderer.builder((b) => b.megacredits(1).slash().tag(Tag.VENUS).tag(Tag.EARTH).tag(Tag.JOVIAN)),
    );
  }

  getScore(player: IPlayer) {
    const tags = [Tag.VENUS, Tag.EARTH, Tag.JOVIAN];
    return sum(tags.map((tag) => player.tags.count(tag, 'raw')));
  }

  override grantForPlayer(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player), {log: true, from: {partyName: PartyName.UNITY}});
  }
}

class UnityBonus02 extends Bonus {
  constructor() {
    super(
      'ub02',
      'Gain 1 M€ for each Space tag you have',
      CardRenderer.builder((b) => b.megacredits(1).slash().tag(Tag.SPACE)),
    );
  }

  getScore(player: IPlayer) {
    return player.tags.count(Tag.SPACE, 'raw');
  }

  override grantForPlayer(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player), {log: true, from: {partyName: PartyName.UNITY}});
  }
}

class UnityPolicy01 extends Policy {
  constructor() {
    super(
      'up01',
      'Your titanium resources are worth 1 M€ extra',
      CardRenderer.builder((b) => b.titanium(1).colon().text('+').megacredits(1)),
    );
  }

  override onPolicyStartForPlayer(player: IPlayer): void {
    player.increaseTitaniumValue();
  }
  override onPolicyEndForPlayer(player: IPlayer): void {
    player.decreaseTitaniumValue();
  }
}

class UnityPolicy02 extends Policy {
  constructor() {
    super(
      'up02',
      'Spend 4 M€ to gain 2 titanium or add 2 floaters to ANY card (Turmoil Unity)',
      CardRenderer.builder((b) => b.megacredits(4).arrow3x().titanium(2, {digit}).slash().resource(CardResource.FLOATER, {amount: 2, digit})),
    );
  }

  canAct(player: IPlayer) {
    return player.canAfford(4) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.UNITY));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectPaymentDeferred(player, 4, {title: TITLES.payForPartyAction(PartyName.UNITY)}))
      .andThen(() => {
        const availableFloaterCards = player.getResourceCards(CardResource.FLOATER);
        const orOptions = new OrOptions();

        if (availableFloaterCards.length === 1) {
          orOptions.options.push(
            new SelectOption(message('Add ${0} floaters to ${1}', (b) => b.number(2).card(availableFloaterCards[0]))).andThen(() => {
              player.addResourceTo(availableFloaterCards[0], {qty: 2, log: true, from: {partyName: PartyName.UNITY}});

              return undefined;
            }),
          );
        } else if (availableFloaterCards.length > 1) {
          orOptions.options.push(
            new SelectOption('Add 2 floaters to a card').andThen(() => {
              return new SelectCard('Select card to add 2 floaters', 'Add floaters', availableFloaterCards)
                .andThen(([card]) => {
                  player.addResourceTo(card, {qty: 2, log: true, from: {partyName: PartyName.UNITY}});
                  return undefined;
                });
            }),
          );
        }

        orOptions.options.push(new SelectOption('Gain 2 titanium').andThen(() => {
          player.stock.add(Resource.TITANIUM, 2, {log: true, from: {partyName: PartyName.UNITY}});
          return undefined;
        }));

        if (orOptions.options.length === 1) {
          return orOptions.options[0].cb();
        }

        player.defer(orOptions);
        return undefined;
      });

    return undefined;
  }
}

class UnityPolicy03 extends Policy {
  constructor() {
    super(
      'up03',
      'Spend 4 M€ to draw a Space card (Turmoil Unity)',
      CardRenderer.builder((b) => b.megacredits(4).arrow3x().cards(1, {secondaryTag: Tag.SPACE})),
    );
  }

  canAct(player: IPlayer) {
    return player.canAfford(4) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.UNITY));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectPaymentDeferred(player, 4, {title: TITLES.payForPartyAction(PartyName.UNITY)}))
      .andThen(() => player.drawCard(1, {tag: Tag.SPACE}));

    return undefined;
  }
}

class UnityPolicy04 extends Policy {
  constructor() {
    super(
      'up04',
      'Cards with Space tags cost 2 M€ less to play',
      CardRenderer.builder((b) => b.tag(Tag.SPACE).colon().megacredits(-2)),
    );
  }
}

export const UNITY_BONUS_1 = new UnityBonus01();
export const UNITY_BONUS_2 = new UnityBonus02();
export const UNITY_POLICY_1 = new UnityPolicy01();
export const UNITY_POLICY_2 = new UnityPolicy02();
export const UNITY_POLICY_3 = new UnityPolicy03();
export const UNITY_POLICY_4 = new UnityPolicy04();
