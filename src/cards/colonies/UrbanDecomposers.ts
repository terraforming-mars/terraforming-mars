import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRequirements} from '../CardRequirements';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class UrbanDecomposers implements IProjectCard {
    public cost = 6;
    public tags = [Tags.MICROBE];
    public name = CardName.URBAN_DECOMPOSERS;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      let coloniesCount: number = 0;
      game.colonies.forEach((colony) => {
        coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
      });
      return coloniesCount > 0 && player.getCitiesCount(game) > 0;
    }

    public play(player: Player, game: Game) {
      player.addProduction(Resources.PLANTS, 1);

      const microbeCards = player.getResourceCards(ResourceType.MICROBE);
      if (microbeCards.length) {
        game.defer(new AddResourcesToCard(player, ResourceType.MICROBE, {count: 2}));
      }

      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C48',
      requirements: CardRequirements.builder((b) => b.colonies().cities()),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.plants(1)).microbes(2).asterix();
      }),
      description: 'Requires that you have 1 city tile and 1 colony in play. Increase your plant production 1 step, and add 2 microbes to ANOTHER card.',
    }
}
