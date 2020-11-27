import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';

export class TerralabsResearch implements CorporationCard {
    public name = CardName.TERRALABS_RESEARCH;
    public tags = [Tags.SCIENCE, Tags.EARTH];
    public startingMegaCredits: number = 14;
    public cardType = CardType.CORPORATION;
    public cardCost = 1;

    public play(player: Player) {
      player.decreaseTerraformRating();
      return undefined;
    }
}
