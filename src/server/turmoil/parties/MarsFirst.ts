import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Space} from '../../boards/Space';
import {IPlayer} from '../../IPlayer';
import {Policy} from '../Policy';
import {Phase} from '../../../common/Phase';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {ICard} from '../../cards/ICard';
import {POLITICAL_AGENDAS_MAX_ACTION_USES} from '../../../common/constants';
import {TITLES} from '../../inputs/titles';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class MarsFirst extends Party implements IParty {
  readonly name = PartyName.MARS;
  readonly bonuses = [MARS_FIRST_BONUS_1, MARS_FIRST_BONUS_2];
  readonly policies = [MARS_FIRST_POLICY_1, MARS_FIRST_POLICY_2, MARS_FIRST_POLICY_3, MARS_FIRST_POLICY_4];
}

class MarsFirstBonus01 extends Bonus {
  constructor() {
    super(
      'mb01',
      'Gain 1 M€ for each building tag you have',
      CardRenderer.builder((b) => b.megacredits(1).slash().tag(Tag.BUILDING)),
    );
  }

  getScore(player: IPlayer) {
    return player.tags.count(Tag.BUILDING, 'raw');
  }

  override grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player), {log: true, from: {partyName: PartyName.MARS}});
  }
}

class MarsFirstBonus02 extends Bonus {
  constructor() {
    super(
      'mb02',
      'Gain 1 M€ for each tile you have ON MARS',
      CardRenderer.builder((b) => b.megacredits(1).slash().emptyTile().text('ON MARS', {size: Size.LARGE, isBold: false})),
    );
  }

  getScore(player: IPlayer) {
    const boardSpaces = player.game.board.spaces;
    return boardSpaces.filter((space) => space.tile !== undefined && space.player === player && space.spaceType !== SpaceType.COLONY).length;
  }

  override grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player), {log: true, from: {partyName: PartyName.MARS}});
  }
}

class MarsFirstPolicy01 extends Policy {
  constructor() {
    super(
      'mp01',
      'When you place a tile ON MARS, gain 1 steel',
      CardRenderer.builder((b) => b.emptyTile().colon().steel(1)),
    );
  }

  onTilePlaced(player: IPlayer, space: Space) {
    if (space.tile && space.spaceType !== SpaceType.COLONY && player.game.phase === Phase.ACTION) {
      player.stock.add(Resource.STEEL, 1, {log: true, from: {partyName: PartyName.MARS}});
    }
  }
}

class MarsFirstPolicy02 extends Policy {
  constructor() {
    super(
      'mp02',
      'When you play a building tag, gain 2 M€',
      CardRenderer.builder((b) => b.tag(Tag.BUILDING).colon().megacredits(2)),
    );
  }

  onCardPlayed(player: IPlayer, card: ICard) {
    if (card.tags.includes(Tag.BUILDING)) {
      player.stock.add(Resource.MEGACREDITS, 2, {log: true, from: {partyName: PartyName.MARS}});
    }
  }
}

class MarsFirstPolicy03 extends Policy {
  constructor() {
    super(
      'mp03',
      'Your steel resources are worth 1 M€ extra',
      CardRenderer.builder((b) => b.steel(1).colon().text('+').megacredits(1)),
    );
  }

  override onPolicyStartForPlayer(player: IPlayer): void {
    player.increaseSteelValue();
  }

  override onPolicyEndForPlayer(player: IPlayer): void {
    player.decreaseSteelValue();
  }
}

class MarsFirstPolicy04 extends Policy {
  constructor() {
    super(
      'mp04',
      'Spend 4 M€ to draw a Building card (Turmoil Mars First)',
      CardRenderer.builder((b) => b.megacredits(4).arrow3x().cards(1, {secondaryTag: Tag.BUILDING})),
    );
  }

  canAct(player: IPlayer) {
    return player.canAfford(4) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil Mars First action', (b) => b.player(player));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectPaymentDeferred(player, 4, {title: TITLES.payForPartyAction(PartyName.MARS)}))
      .andThen(() => player.drawCard(1, {tag: Tag.BUILDING}));
    return undefined;
  }
}

export const MARS_FIRST_BONUS_1 = new MarsFirstBonus01();
export const MARS_FIRST_BONUS_2 = new MarsFirstBonus02();
export const MARS_FIRST_POLICY_1 = new MarsFirstPolicy01();
export const MARS_FIRST_POLICY_2 = new MarsFirstPolicy02();
export const MARS_FIRST_POLICY_3 = new MarsFirstPolicy03();
export const MARS_FIRST_POLICY_4 = new MarsFirstPolicy04();
