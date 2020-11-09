import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

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
}
