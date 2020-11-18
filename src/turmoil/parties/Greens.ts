import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Tags} from '../../cards/Tags';
import {Resources} from '../../Resources';
import {Bonus} from '../Bonus';
import {TileType} from '../../TileType';
import {Policy} from '../Policy';
import {ISpace} from '../../ISpace';
import {Player} from '../../Player';
import {IProjectCard} from '../../cards/IProjectCard';
import {ICard} from '../../cards/ICard';
import {LogHelper} from '../../components/LogHelper';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {ResourceType} from '../../ResourceType';
import {Phase} from '../../Phase';

export class Greens extends Party implements IParty {
  name = PartyName.GREENS;
  description = 'Want to see a new Earth as soon as possible.';
  bonuses = [new GreensBonus01(), new GreensBonus02()];
  policies = [new GreensPolicy01(), new GreensPolicy02(), new GreensPolicy03(), new GreensPolicy04()];
}

export class GreensBonus01 implements Bonus {
  isDefault = true;
  id = 'gb01';
  description: string = 'Gain 1 MC for each Plant, Microbe and Animal tag you have';

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const tagCount = player.getTagCount(Tags.PLANT, false, false) + player.getTagCount(Tags.MICROBES, false, false) + player.getTagCount(Tags.ANIMAL, false, false);
      player.setResource(Resources.MEGACREDITS, tagCount);
    });
  }
}

export class GreensBonus02 implements Bonus {
  id = 'gb02';
  description: string = 'Gain 2 MC for each greenery tile you have';

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const count = game.board.spaces.filter((space) => {
        return space.tile && space.tile.tileType === TileType.GREENERY && space.player !== undefined && space.player.id === player.id;
      }).length;

      player.setResource(Resources.MEGACREDITS, count * 2);
    });
  }
}

export class GreensPolicy01 implements Policy {
  isDefault = true;
  id = 'gp01';
  description: string = 'Whenever you place a greenery tile, gain 4 MC';

  onTilePlaced(player: Player, space: ISpace, game: Game) {
    if (space.tile?.tileType === TileType.GREENERY && game.phase === Phase.ACTION) {
      player.setResource(Resources.MEGACREDITS, 4);
    }
  }
}

export class GreensPolicy02 implements Policy {
  id = 'gp02';
  description: string = 'Whenever you place a tile, gain 1 plant';

  onTilePlaced(player: Player) {
    player.setResource(Resources.PLANTS);
  }
}

export class GreensPolicy03 implements Policy {
  id = 'gp03';
  description: string = 'Whenever you play an animal, plant or microbe tag, gain 2 MC';

  onCardPlayed(player: Player, card: IProjectCard) {
    const tags = [Tags.ANIMAL, Tags.PLANT, Tags.MICROBES];
    const tagCount = card.tags.filter((tag) => tags.includes(tag)).length;

    player.setResource(Resources.MEGACREDITS, tagCount * 2);
  }
}

export class GreensPolicy04 implements Policy {
  id = 'gp04';
  description: string = 'Spend 3 plants to add 2 microbes or 1 animal to any card (Turmoil Greens)';

  canAct(player: Player) {
    return player.plants >= 3;
  }

  action(player: Player, game: Game) {
    player.plants -= 3;
    game.log('${0} used Turmoil Greens action', (b) => b.player(player));

    const availableMicrobeCards = player.getResourceCards(ResourceType.MICROBE);
    const availableAnimalCards = player.getResourceCards(ResourceType.ANIMAL);
    const orOptions = new OrOptions();

    if (availableMicrobeCards.length === 1) {
      orOptions.options.push(
          new SelectOption('Add 2 microbes to' + availableMicrobeCards[0].name, 'Confirm', () => {
            player.addResourceTo(availableMicrobeCards[0], 2);
            LogHelper.logAddResource(game, player, availableMicrobeCards[0], 2);

            return undefined;
          }),
      );
    } else if (availableMicrobeCards.length > 1) {
      orOptions.options.push(
          new SelectOption('Add 2 microbes to a card', 'Confirm', () => {
            return new SelectCard('Select card to add 2 microbes', 'Add microbes', availableMicrobeCards, (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 2);
              LogHelper.logAddResource(game, player, foundCards[0], 2);
              return undefined;
            });
          }),
      );
    }

    if (availableAnimalCards.length === 1) {
      orOptions.options.push(
          new SelectOption('Add 1 animal to' + availableAnimalCards[0].name, 'Confirm', () => {
            player.addResourceTo(availableAnimalCards[0]);
            LogHelper.logAddResource(game, player, availableAnimalCards[0]);

            return undefined;
          }),
      );
    } else if (availableAnimalCards.length > 1) {
      orOptions.options.push(new SelectOption('Add 1 animal to a card', 'Confirm', () => {
        return new SelectCard('Select card to add 1 animal', 'Add animal', availableAnimalCards, (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0]);
          LogHelper.logAddResource(game, player, foundCards[0]);
          return undefined;
        });
      }));
    }

    if (orOptions.options.length === 0) return undefined;
    return orOptions;
  }
}
