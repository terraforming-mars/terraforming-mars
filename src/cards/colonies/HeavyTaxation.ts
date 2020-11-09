import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';

export class HeavyTaxation implements IProjectCard {
    public cost = 3;
    public tags = [Tags.EARTH];
    public name = CardName.HEAVY_TAXATION;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.EARTH) >= 2;
    }

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);
      player.megaCredits += 4;
      return undefined;
    }

    public getVictoryPoints() {
      return -1;
    }
}
