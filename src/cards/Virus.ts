import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {OrOptions} from '../inputs/OrOptions';
import {PlayerInput} from '../PlayerInput';
import {CardName} from '../CardName';
import {SelectOption} from '../inputs/SelectOption';
import {ResourceType} from '../ResourceType';
import {RemoveAnyPlants} from '../deferredActions/RemoveAnyPlants';
import {RemoveResourcesFromCard} from '../deferredActions/RemoveResourcesFromCard';

export class Virus implements IProjectCard {
    public cost = 1;
    public tags = [Tags.MICROBES];
    public name = CardName.VIRUS;
    public cardType = CardType.EVENT;
    public hasRequirements = false;
    public canPlay(): boolean {
      return true;
    }

    public play(player: Player, game: Game): PlayerInput | undefined {
      if (game.getPlayers().length === 1) {
        return undefined;
      }

      const orOptionsAnimals = (new RemoveResourcesFromCard(player, game, ResourceType.ANIMAL, 2, false, false)).execute() as OrOptions;
      const removeAnimals = orOptionsAnimals !== undefined ?
            orOptionsAnimals.options[0] :
            undefined;

      const orOptionsPlants = (new RemoveAnyPlants(player, game, 5)).execute() as OrOptions;
      const removePlants = orOptionsPlants !== undefined ?
            orOptionsPlants.options.slice(0, -1) :
            undefined;

      // If no other player has resources to remove
      // assume player will remove nothing from themselves
      if (removeAnimals === undefined && removePlants === undefined) {
        return undefined;
      }

      const orOptions = new OrOptions();
      if (removeAnimals !== undefined) {
        orOptions.options.push(removeAnimals);
      }
      if (removePlants !== undefined) {
        orOptions.options.push(...removePlants);
      }
      orOptions.options.push(new SelectOption('Skip removal', 'Confirm', () => {
        return undefined;
      }));

      return orOptions;
    }
}
