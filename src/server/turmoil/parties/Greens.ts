import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
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

export class Greens extends Party implements IParty {
  readonly name = PartyName.GREENS;
  readonly description = 'Want to see a new Earth as soon as possible.';
  readonly bonuses = [GREENS_BONUS_1, GREENS_BONUS_2];
  readonly policies = [GREENS_POLICY_1, GREENS_POLICY_2, GREENS_POLICY_3, GREENS_POLICY_4];
}

class GreensBonus01 implements Bonus {
  readonly isDefault = true;
  readonly id = 'gb01' as const;
  readonly description = 'Gain 1 M€ for each Plant, Microbe and Animal tag you have';

  getScore(player: Player) {
    return player.tags.count(Tag.PLANT, 'raw') +
      player.tags.count(Tag.MICROBE, 'raw') +
      player.tags.count(Tag.ANIMAL, 'raw');
  }

  grant(game: Game) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.MEGACREDITS, this.getScore(player));
    });
  }
}

class GreensBonus02 implements Bonus {
  readonly id = 'gb02' as const;
  readonly description = 'Gain 2 M€ for each greenery tile you have';
  readonly isDefault = false;

  getScore(player: Player) {
    const boardSpaces = player.game.board.spaces;
    const count = boardSpaces.filter((space) => Board.isGreenerySpace(space) && Board.spaceOwnedBy(space, player)).length;
    return count * 2;
  }

  grant(game: Game) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.MEGACREDITS, this.getScore(player));
    });
  }
}

class GreensPolicy01 implements Policy {
  readonly isDefault = true;
  readonly id = 'gp01' as const;
  readonly description = 'When you place a greenery tile, gain 4 M€';

  onTilePlaced(player: Player, space: ISpace) {
    if (Board.isGreenerySpace(space) && player.game.phase === Phase.ACTION) {
      player.addResource(Resources.MEGACREDITS, 4);
    }
  }
}

class GreensPolicy02 implements Policy {
  readonly id = 'gp02' as const;
  readonly description = 'When you place a tile, gain 1 plant';
  readonly isDefault = false;

  onTilePlaced(player: Player) {
    player.addResource(Resources.PLANTS, 1);
  }
}

class GreensPolicy03 implements Policy {
  readonly id = 'gp03' as const;
  readonly description = 'When you play an animal, plant or microbe tag, gain 2 M€';
  readonly isDefault = false;

  onCardPlayed(player: Player, card: IProjectCard) {
    const tags = [Tag.ANIMAL, Tag.PLANT, Tag.MICROBE];
    const tagCount = card.tags.filter((tag) => tags.includes(tag)).length;

    player.addResource(Resources.MEGACREDITS, tagCount * 2);
  }
}

class GreensPolicy04 implements Policy {
  readonly id = 'gp04' as const;
  readonly description = 'Spend 5 M€ to gain 3 plants or add 2 microbes to ANY card (Turmoil Greens)';
  readonly isDefault = false;

  canAct(player: Player) {
    return player.canAfford(5) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: Player) {
    const game = player.game;
    game.log('${0} used Turmoil Greens action', (b) => b.player(player));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectPaymentDeferred(
      player,
      5,
      {
        title: 'Select how to pay for Turmoil Greens action',
        afterPay: () => {
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
            player.addResource(Resources.PLANTS, 3);
            game.log('${0} gained 3 plants', (b) => b.player(player));
            return undefined;
          }));

          if (orOptions.options.length === 1) return orOptions.options[0].cb();

          game.defer(new SimpleDeferredAction(player, () => orOptions));
          return undefined;
        },
      },
    ));

    return undefined;
  }
}

export const GREENS_BONUS_1 = new GreensBonus01();
export const GREENS_BONUS_2 = new GreensBonus02();
export const GREENS_POLICY_1 = new GreensPolicy01();
export const GREENS_POLICY_2 = new GreensPolicy02();
export const GREENS_POLICY_3 = new GreensPolicy03();
export const GREENS_POLICY_4 = new GreensPolicy04();
