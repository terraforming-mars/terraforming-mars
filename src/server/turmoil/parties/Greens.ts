import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {Space} from '../../boards/Space';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../../cards/ICard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {CardResource} from '../../../common/CardResource';
import {Phase} from '../../../common/Phase';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {POLITICAL_AGENDAS_MAX_ACTION_USES} from '../../../common/constants';
import {Board} from '../../boards/Board';
import {TITLES} from '../../inputs/titles';
import {message} from '../../logs/MessageBuilder';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '@/server/cards/Options';

export class Greens extends Party implements IParty {
  readonly name = PartyName.GREENS;
  readonly bonuses = [GREENS_BONUS_1, GREENS_BONUS_2];
  readonly policies = [GREENS_POLICY_1, GREENS_POLICY_2, GREENS_POLICY_3, GREENS_POLICY_4];
}

class GreensBonus01 extends Bonus {
  constructor() {
    super(
      'gb01',
      'Gain 1 M€ for each Plant, Microbe and Animal tag you have',
      CardRenderer.builder((b) => b.megacredits(1).slash().tag(Tag.PLANT).tag(Tag.MICROBE).tag(Tag.ANIMAL)),
    );
  }

  getScore(player: IPlayer) {
    return player.tags.count(Tag.PLANT, 'raw') +
      player.tags.count(Tag.MICROBE, 'raw') +
      player.tags.count(Tag.ANIMAL, 'raw');
  }

  override grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player), {log: true, from: {partyName: PartyName.GREENS}});
  }
}

class GreensBonus02 extends Bonus {
  constructor() {
    super(
      'gb02',
      'Gain 2 M€ for each greenery tile you have',
      CardRenderer.builder((b) => b.megacredits(2).slash().greenery()),
    );
  }

  getScore(player: IPlayer) {
    const boardSpaces = player.game.board.spaces;
    const count = boardSpaces.filter((space) => Board.isGreenerySpace(space) && Board.spaceOwnedBy(space, player)).length;
    return count * 2;
  }

  override grantForPlayer(player: IPlayer): void {
    player.stock.add(Resource.MEGACREDITS, this.getScore(player), {log: true, from: {partyName: PartyName.GREENS}});
  }
}

class GreensPolicy01 extends Policy {
  constructor() {
    super(
      'gp01',
      'When you place a greenery tile, gain 4 M€',
      CardRenderer.builder((b) => b.greenery({size: Size.LARGE}).colon().megacredits(4)),
    );
  }

  onTilePlaced(player: IPlayer, space: Space) {
    if (Board.isGreenerySpace(space) && player.game.phase === Phase.ACTION) {
      player.stock.add(Resource.MEGACREDITS, 4, {log: true, from: {partyName: PartyName.GREENS}});
    }
  }
}

class GreensPolicy02 extends Policy {
  constructor() {
    super(
      'gp02',
      'When you place a tile, gain 1 plant',
      CardRenderer.builder((b) => b.emptyTile().colon().plants(1)),
    );
  }

  onTilePlaced(player: IPlayer) {
    player.stock.add(Resource.PLANTS, 1, {log: true, from: {partyName: PartyName.GREENS}});
  }
}

class GreensPolicy03 extends Policy {
  constructor() {
    super(
      'gp03',
      'When you play an animal, plant or microbe tag, gain 2 M€',
      CardRenderer.builder((b) => b.tag(Tag.PLANT).tag(Tag.MICROBE).tag(Tag.ANIMAL).colon().megacredits(2)),
    );
  }

  onCardPlayed(player: IPlayer, card: ICard) {
    const tags = [Tag.ANIMAL, Tag.PLANT, Tag.MICROBE];
    const tagCount = card.tags.filter((tag) => tags.includes(tag)).length;

    player.defer(() => player.stock.add(Resource.MEGACREDITS, tagCount * 2, {log: true, from: {partyName: PartyName.GREENS}}));
  }
}

class GreensPolicy04 extends Policy {
  constructor() {
    super(
      'gp04',
      'Spend 5 M€ to gain 3 plants or add 2 microbes to ANY card (Turmoil Greens)',
      CardRenderer.builder((b) => b.megacredits(5).arrow3x().plants(3, {digit}).slash().resource(CardResource.MICROBE, {amount: 2, digit})),
    );
  }

  canAct(player: IPlayer) {
    return player.canAfford(5) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil ${1} action', (b) => b.player(player).partyName(PartyName.GREENS));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectPaymentDeferred(player, 5, {title: TITLES.payForPartyAction(PartyName.GREENS)}))
      .andThen(() => {
        const availableMicrobeCards = player.getResourceCards(CardResource.MICROBE);
        const orOptions = new OrOptions();

        if (availableMicrobeCards.length === 1) {
          orOptions.options.push(
            new SelectOption(message('Add ${0} microbes to ${1}', (b) => b.number(2).card(availableMicrobeCards[0]))).andThen(() => {
              player.addResourceTo(availableMicrobeCards[0], {qty: 2, log: true, from: {partyName: PartyName.GREENS}});

              return undefined;
            }),
          );
        } else if (availableMicrobeCards.length > 1) {
          orOptions.options.push(
            new SelectOption('Add 2 microbes to a card').andThen(() => {
              return new SelectCard('Select card to add 2 microbes', 'Add microbes', availableMicrobeCards)
                .andThen(([card]) => {
                  player.addResourceTo(card, {qty: 2, log: true, from: {partyName: PartyName.GREENS}});
                  return undefined;
                });
            }),
          );
        }

        orOptions.options.push(new SelectOption('Gain 3 plants').andThen(() => {
          player.stock.add(Resource.PLANTS, 3, {log: true, from: {partyName: PartyName.GREENS}});
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

export const GREENS_BONUS_1 = new GreensBonus01();
export const GREENS_BONUS_2 = new GreensBonus02();
export const GREENS_POLICY_1 = new GreensPolicy01();
export const GREENS_POLICY_2 = new GreensPolicy02();
export const GREENS_POLICY_3 = new GreensPolicy03();
export const GREENS_POLICY_4 = new GreensPolicy04();
