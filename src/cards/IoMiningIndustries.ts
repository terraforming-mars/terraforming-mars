
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class IoMiningIndustries implements IProjectCard {
    public cost = 41;
    public tags = [Tags.JOVIAN, Tags.SPACE];
    public name = CardName.IO_MINING_INDUSTRIES;
    public cardType = CardType.AUTOMATED;

    public getVictoryPoints(player: Player) {
      return player.getTagCount(Tags.JOVIAN, false, false);
    }
    public play(player: Player) {
      player.addProduction(Resources.TITANIUM, 2);
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }
}
