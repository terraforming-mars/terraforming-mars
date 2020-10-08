
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class AdaptedLichen implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.PLANT];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.ADAPTED_LICHEN;
    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      return undefined;
    }
}
