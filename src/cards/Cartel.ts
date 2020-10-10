
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class Cartel implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: CardName = CardName.CARTEL;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, player.getTagCount(Tags.EARTH) + 1);
      return undefined;
    }
}
