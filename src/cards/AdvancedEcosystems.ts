import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';

export class AdvancedEcosystems implements IProjectCard {
    public cost: number = 11;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.PLANT, Tags.MICROBES, Tags.ANIMAL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = 'Advanced Ecosystems';
    public canPlay(): boolean {
      return true;
    }
    public play(player: Player) {
      if (player.getTagCount(Tags.PLANT) === 0 ||
            player.getTagCount(Tags.MICROBES) === 0 ||
            player.getTagCount(Tags.ANIMAL) === 0) {
        throw new Error(
            'Requires a plant tag, a microbe tag, and an animal tag'
        );
      }
      player.victoryPoints += 3;
      return undefined;
    }
}
