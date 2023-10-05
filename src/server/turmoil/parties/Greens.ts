import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {Space} from '../../boards/Space';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../../cards/IProjectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {CardResource} from '../../../common/CardResource';
import {Phase} from '../../../common/Phase';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {POLITICAL_AGENDAS_MAX_ACTION_USES} from '../../../common/constants';
import {Board} from '../../boards/Board';
import {TITLES} from '../../inputs/titles';

export class Greens extends Party implements IParty {
  readonly name = PartyName.GREENS;
  readonly description = 'Want to see a new Earth as soon as possible.';
  readonly bonuses = [GREENS_BONUS_1, GREENS_BONUS_2];
  readonly policies = [GREENS_POLICY_1, GREENS_POLICY_2, GREENS_POLICY_3, GREENS_POLICY_4];
}

class GreensBonus01 implements Bonus {
  readonly id = 'gb01' as const;
  readonly description = 'Gain 1 M€ for each Plant, Microbe and Animal tag you have';

  getScore(player: IPlayer) {
    return player.tags.count(Tag.PLANT, 'raw') +
      player.tags.count(Tag.MICROBE, 'raw') +
      player.tags.count(Tag.ANIMAL, 'raw');
  }

  grant(game: IGame) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.stock.add(Resource.MEGACREDITS, this.getScore(player));
    });
  }
}

class GreensBonus02 implements Bonus {
  readonly id = 'gb02' as const;
  readonly description = 'Gain 2 M€ for each greenery tile you have';

  getScore(player: IPlayer) {
    const boardSpaces = player.game.board.spaces;
    const count = boardSpaces.filter((space) => Board.isGreenerySpace(space) && Board.spaceOwnedBy(space, player)).length;
    return count * 2;
  }

  grant(game: IGame) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.stock.add(Resource.MEGACREDITS, this.getScore(player));
    });
  }
}

class GreensPolicy01 implements Policy {
  readonly id = 'gp01' as const;
  readonly description = 'When you place a greenery tile, gain 4 M€';

  onTilePlaced(player: IPlayer, space: Space) {
    if (Board.isGreenerySpace(space) && player.game.phase === Phase.ACTION) {
      player.stock.add(Resource.MEGACREDITS, 4);
    }
  }
}

class GreensPolicy02 implements Policy {
  readonly id = 'gp02' as const;
  readonly description = 'When you place a tile, gain 1 plant';

  onTilePlaced(player: IPlayer) {
    player.stock.add(Resource.PLANTS, 1);
  }
}

class GreensPolicy03 implements Policy {
  readonly id = 'gp03' as const;
  readonly description = 'When you play an animal, plant or microbe tag, gain 2 M€';

  onCardPlayed(player: IPlayer, card: IProjectCard) {
    const tags = [Tag.ANIMAL, Tag.PLANT, Tag.MICROBE];
    const tagCount = card.tags.filter((tag) => tags.includes(tag)).length;

    player.stock.add(Resource.MEGACREDITS, tagCount * 2);
  }
}

class GreensPolicy04 implements Policy {
  readonly id = 'gp04' as const;
  readonly description = 'Spend 5 M€ to gain 3 plants or add 2 microbes to ANY card (Turmoil Greens)';

  canAct(player: IPlayer) {
    return player.canAfford(5) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil Greens action', (b) => b.player(player));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectPaymentDeferred(player, 5, {title: TITLES.payForPartyAction(PartyName.GREENS)}))
      .andThen(() => {
        const availableMicrobeCards = player.getResourceCards(CardResource.MICROBE);
        const orOptions = new OrOptions();

        if (availableMicrobeCards.length === 1) {
          orOptions.options.push(
            new SelectOption('Add 2 microbes to ' + availableMicrobeCards[0].name, 'Confirm', () => {
              player.addResourceTo(availableMicrobeCards[0], {qty: 2, log: true});

              return undefined;
            }),
          );
        } else if (availableMicrobeCards.length > 1) {
          orOptions.options.push(
            new SelectOption('Add 2 microbes to a card', 'Confirm', () => {
              return new SelectCard('Select card to add 2 microbes', 'Add microbes', availableMicrobeCards, ([card]) => {
                player.addResourceTo(card, {qty: 2, log: true});
                return undefined;
              });
            }),
          );
        }

        orOptions.options.push(new SelectOption('Gain 3 plants', 'Confirm', () => {
          player.stock.add(Resource.PLANTS, 3);
          game.log('${0} gained 3 plants', (b) => b.player(player));
          return undefined;
        }));

        if (orOptions.options.length === 1) return orOptions.options[0].cb();

        game.defer(new SimpleDeferredAction(player, () => orOptions));
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
