
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from "../Resources";
import { CardName } from '../CardName';

export class BlackPolarDust implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [];
    public name: string = CardName.BLACK_POLAR_DUST;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.MEGACREDITS) >= -3;
    }
    public play(player: Player, game: Game) {
      player.setProduction(Resources.MEGACREDITS,-2);
      player.setProduction(Resources.HEAT,3);
      game.addOceanInterrupt(player);
      return undefined;
    }
}
