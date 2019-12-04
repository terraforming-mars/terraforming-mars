
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';

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
      player.heatProduction += 3;
      return undefined;
    }
}
