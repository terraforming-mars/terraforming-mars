import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {CardName} from '../CardName';

export class AcquiredCompany implements IProjectCard {
    public cost = 10;
    public tags = [Tags.EARTH];
    public name = CardName.ACQUIRED_COMPANY;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 3);
      return undefined;
    }
}
