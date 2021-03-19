import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {ResourceType} from '../../ResourceType';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class EcologyResearch extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 21,
      tags: [Tags.SCIENCE, Tags.PLANT, Tags.ANIMAL, Tags.MICROBE],
      name: CardName.ECOLOGY_RESEARCH,
      cardType: CardType.AUTOMATED,

      metadata: {
        description: 'Increase your plant production 1 step for each colony you own. Add 1 animal to ANOTHER card and 2 microbes to ANOTHER card.',
        cardNumber: 'C09',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1).slash().colonies(1, CardRenderItemSize.SMALL)).br;
          b.animals(1).asterix().nbsp.nbsp.microbes(2).asterix();
        }),
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    const coloniesCount = player.getColoniesCount();
    player.addProduction(Resources.PLANTS, coloniesCount, player.game);

    const animalCards = player.getResourceCards(ResourceType.ANIMAL);
    if (animalCards.length) {
      player.game.defer(new AddResourcesToCard(player, ResourceType.ANIMAL, {count: 1}));
    }

    const microbeCards = player.getResourceCards(ResourceType.MICROBE);
    if (microbeCards.length) {
      player.game.defer(new AddResourcesToCard(player, ResourceType.MICROBE, {count: 2}));
    }

    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
