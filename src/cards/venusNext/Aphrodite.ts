
import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';

export class Aphrodite implements CorporationCard {
    public name = CardName.APHRODITE;
    public tags = [Tags.PLANT, Tags.VENUS];
    public startingMegaCredits: number = 47;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
      player.addProduction(Resources.PLANTS);
      return undefined;
    }
}
