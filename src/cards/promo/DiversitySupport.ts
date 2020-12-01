import {IProjectCard} from './../IProjectCard';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class DiversitySupport implements IProjectCard {
    public cost = 1;
    public tags = [];
    public name = CardName.DIVERSITY_SUPPORT;
    public cardType = CardType.EVENT;

    public canPlay(player: Player) {
      const count = this.getStandardResourceCount(player) + this.getNonStandardResourceCount(player);
      return count >= 9;
    }

    public play(player: Player, game: Game) {
      player.increaseTerraformRating(game);
      return undefined;
    }

    private getStandardResourceCount(player: Player) {
      const standardResources = [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT];
      return standardResources.map((res) => player.getResource(res)).filter((count) => count > 0).length;
    }

    private getNonStandardResourceCount(player: Player) {
      const cardsWithResources = player.getCardsWithResources();
      return cardsWithResources.map((card) => card.resourceType).filter((v, i, a) => a.indexOf(v) === i).length;
    }
    public metadata: CardMetadata = {
      cardNumber: 'X23',
      description: 'Requires that you have 9 different types of resources. Gain 1 TR.',
      requirements: CardRequirements.builder((b) => b.resourceTypes(9)),
      renderData: CardRenderer.builder((b) => b.tr(1)),
    }
}
