import {ICard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {SelectCard} from '../inputs/SelectCard';
import {Resources} from '../Resources';
import {ResourceType} from '../ResourceType';
import {CardName} from '../CardName';
import {Game} from '../Game';
import {LogHelper} from '../components/LogHelper';

export class AerobrakedAmmoniaAsteroid implements IProjectCard {
  public cost = 26;
  public tags = [Tags.SPACE];
  public name = CardName.AEROBRAKED_AMMONIA_ASTEROID;
  public cardType = CardType.EVENT;

  public play(player: Player, game: Game) {
    const cardsToPick = player.getResourceCards(ResourceType.MICROBE);
    player.addProduction(Resources.HEAT, 3);
    player.addProduction(Resources.PLANTS);

    if (cardsToPick.length < 1) return undefined;

    if (cardsToPick.length === 1) {
      player.addResourceTo(cardsToPick[0], 2);
      LogHelper.logAddResource(game, player, cardsToPick[0], 2);
      return undefined;
    }

    return new SelectCard('Select card to add 2 microbes', 'Add microbes', cardsToPick, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0], 2);
      LogHelper.logAddResource(game, player, foundCards[0], 2);
      return undefined;
    });
  }
}
