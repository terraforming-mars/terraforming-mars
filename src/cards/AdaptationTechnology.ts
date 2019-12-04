import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';

export class AdaptationTechnology implements IProjectCard {
    public cost: number = 12;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = 'Adaptation Technology';
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
      return true;
    }
    public getRequirementBonus(): number {
      return 2;
    }
    public play(player: Player) {
      player.victoryPoints++;
      return undefined;
    }
}
