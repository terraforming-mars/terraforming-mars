
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { Resources } from "../Resources";

export class CarbonateProcessing implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = 'Carbonate Processing';
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
      return player.energyProduction >= 1;
    }
    public play(player: Player) {
      player.energyProduction--;
      player.setProduction(Resources.HEAT,3);
      return undefined;
    }
}
