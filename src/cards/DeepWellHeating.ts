
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from '../Resources';

export class DeepWellHeating implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = 'Deep Well Heating';
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
      return true;
    }
    public play(player: Player, game: Game) {
      player.setProduction(Resources.ENERGY);
      return game.increaseTemperature(player, 1);
    }
}
