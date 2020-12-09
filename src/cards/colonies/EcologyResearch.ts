import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderer} from '../render/CardRenderer';

export class EcologyResearch implements IProjectCard {
    public cost = 21;
    public tags = [Tags.SCIENCE, Tags.PLANT, Tags.ANIMAL, Tags.MICROBES];
    public name = CardName.ECOLOGY_RESEARCH;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      const coloniesCount = player.getColoniesCount(game);
      player.addProduction(Resources.PLANTS, coloniesCount);

      const animalCards = player.getResourceCards(ResourceType.ANIMAL);
      if (animalCards.length) {
        game.defer(new AddResourcesToCard(player, game, ResourceType.ANIMAL, 1));
      }

      const microbeCards = player.getResourceCards(ResourceType.MICROBE);
      if (microbeCards.length) {
        game.defer(new AddResourcesToCard(player, game, ResourceType.MICROBE, 2));
      }

      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      description: 'Increase your plant production 1 step for each colony you own. Add 1 animal to ANOTHER card and 2 microbes to ANOTHER card.',
      cardNumber: 'C09',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.plants(1).slash().colonies(1, CardRenderItemSize.SMALL)).br;
        b.animals(1).asterix().nbsp.nbsp.microbes(2).asterix();
      }),
      victoryPoints: 1,
    };
}
