
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { Resources } from '../Resources';

export class Cartel implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = 'Cartel';
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
      return true;
    }
    public play(player: Player) {
      player.setProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH) + 1);
      return undefined;
    }
}
