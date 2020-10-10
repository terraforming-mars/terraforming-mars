
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class CallistoPenalMines implements IProjectCard {
    public cost: number = 24;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: CardName = CardName.CALLISTO_PENAL_MINES;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS,3);
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
}
