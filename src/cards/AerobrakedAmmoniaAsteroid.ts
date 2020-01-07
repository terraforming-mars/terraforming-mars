import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {SelectCard} from '../inputs/SelectCard';
import { Resources } from "../Resources";
import { ResourceType } from '../ResourceType';

export class AerobrakedAmmoniaAsteroid implements IProjectCard {
    public cost: number = 26;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = 'Aerobraked Ammonia Asteroid';
    public cardType: CardType = CardType.EVENT;
    public canPlay(): boolean {
      return true;
    }
    public play(player: Player) {
      const cardsToPick = player.getResourceCards(ResourceType.MICROBE);
      player.setProduction(Resources.HEAT,3);
      player.setProduction(Resources.PLANTS);

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
