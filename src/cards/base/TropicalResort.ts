
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class TropicalResort implements IProjectCard {
    public cost = 13;
    public tags = [Tags.STEEL];
    public name = CardName.TROPICAL_RESORT;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.HEAT) >= 2;
    }
    public play(player: Player) {
      player.addProduction(Resources.HEAT, -2);
      player.addProduction(Resources.MEGACREDITS, 3);
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
}
