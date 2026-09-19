import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {IPlayer} from '../../IPlayer';
import {Policy} from '../Policy';
import {TITLES} from '../../inputs/titles';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '@/server/cards/Options';

export class Scientists extends Party implements IParty {
  readonly name = PartyName.SCIENTISTS as const;
  readonly bonuses = [SCIENTISTS_BONUS_1, SCIENTISTS_BONUS_2];
  readonly policies = [SCIENTISTS_POLICY_1, SCIENTISTS_POLICY_2, SCIENTISTS_POLICY_3, SCIENTISTS_POLICY_4];
}

class ScientistsBonus01 extends Bonus {
  constructor() {
    super(
      'sb01',
      'Gain 1 M€ for each science tag you have',
      CardRenderer.builder((b) => b.megacredits(1).slash().tag(Tag.SCIENCE)),
    );
  }

  getScore(player: IPlayer) {
    return player.tags.count(Tag.SCIENCE, 'raw-pf');
  }

  override grantForPlayer(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player), {log: true, from: {partyName: PartyName.SCIENTISTS}});
  }
}

class ScientistsBonus02 extends Bonus {
  constructor() {
    super(
      'sb02',
      'Gain 1 M€ for every 3 cards in hand',
      CardRenderer.builder((b) => b.megacredits(1).slash().cards(3, {digit})),
    );
  }

  getScore(player: IPlayer) {
    return Math.floor(player.cardsInHand.length / 3);
  }

  override grantForPlayer(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player), {log: true, from: {partyName: PartyName.SCIENTISTS}});
  }
}

class ScientistsPolicy01 extends Policy {
  constructor() {
    super(
      'sp01',
      'Pay 10 M€ to draw 3 cards (Turmoil Scientists)',
      CardRenderer.builder((b) => b.megacredits(10).arrow().cards(3, {digit})),
    );
  }

  canAct(player: IPlayer) {
    return player.canAfford(10) && player.turmoilPolicyActionUsed === false;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.SCIENTISTS));
    game.defer(new SelectPaymentDeferred(player, 10, {title: TITLES.payForPartyAction(PartyName.SCIENTISTS)}))
      .andThen(() => {
        player.drawCard(3);
        player.turmoilPolicyActionUsed = true;
      });

    return undefined;
  }
}

class ScientistsPolicy02 extends Policy {
  constructor() {
    super(
      'sp02',
      'Your global requirements are +/- 2 steps',
      CardRenderer.builder((b) => b.oxygen(1).oceans(1).temperature(1).colon().text('± 2', {size: Size.LARGE, isBold: false})),
    );
  }
}

class ScientistsPolicy03 extends Policy {
  constructor() {
    super(
      'sp03',
      'When you raise a global parameter, draw a card per step raised',
      CardRenderer.builder((b) => b.oxygen(1).oceans(1).temperature(1).colon().cards(1)),
    );
  }
}

class ScientistsPolicy04 extends Policy {
  constructor() {
    super(
      'sp04',
      'Cards with Science tag requirements may be played with 1 less Science tag',
      CardRenderer.builder((b) => b.tagRequirement(Tag.SCIENCE)),
    );
  }

  override onPolicyStartForPlayer(player: IPlayer) {
    player.hasTurmoilScienceTagBonus = true;
  }

  override onPolicyEndForPlayer(player: IPlayer) {
    player.hasTurmoilScienceTagBonus = false;
  }
}

export const SCIENTISTS_BONUS_1 = new ScientistsBonus01();
export const SCIENTISTS_BONUS_2 = new ScientistsBonus02();
export const SCIENTISTS_POLICY_1 = new ScientistsPolicy01();
export const SCIENTISTS_POLICY_2 = new ScientistsPolicy02();
export const SCIENTISTS_POLICY_3 = new ScientistsPolicy03();
export const SCIENTISTS_POLICY_4 = new ScientistsPolicy04();
