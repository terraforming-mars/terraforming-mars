import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectCard} from '../inputs/SelectCard';

export class AerobrakedAmmoniaAsteroid implements IProjectCard {
    public cost: number = 26;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = 'Aerobraked Ammonia Asteroid';
    public cardType: CardType = CardType.EVENT;
    public canPlay(): boolean {
      return true;
    }
    public play(player: Player, game: Game) {
      const cardsToPick = game.getOtherMicrobeCards(this);
      player.heatProduction += 3;
      player.plantProduction++;

      // It's not required to have card to place microbes
      // Rules pg. 9
      if (cardsToPick.length < 1) return undefined;

      return new SelectCard(
          'Select card to add 2 microbes', cardsToPick,
          (foundCards: Array<IProjectCard>) => {
            player.addResourceTo(foundCards[0], 2);
            return undefined;
          }
      );
    }
}
