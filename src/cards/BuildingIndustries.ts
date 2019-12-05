
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';

export class BuildingIndustries implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = 'Building Industries';
    public canPlay(player: Player): boolean {
      return player.energyProduction >= 1;
    }
    public play(player: Player) {
      player.energyProduction--;
      player.steelProduction += 2;
      return undefined;
    }
}
