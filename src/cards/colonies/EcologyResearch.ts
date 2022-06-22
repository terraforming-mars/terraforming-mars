import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {CardResource} from '../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Size} from '../../common/cards/render/Size';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class EcologyResearch extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 21,
      tags: [Tags.SCIENCE, Tags.PLANT, Tags.ANIMAL, Tags.MICROBE],
      name: CardName.ECOLOGY_RESEARCH,
      cardType: CardType.AUTOMATED,
      victoryPoints: 1,

      metadata: {
        description: 'Increase your plant production 1 step for each colony you own. Add 1 animal to ANOTHER card and 2 microbes to ANOTHER card.',
        cardNumber: 'C09',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1).slash().colonies(1, {size: Size.SMALL})).br;
          b.animals(1).asterix().nbsp.nbsp.microbes(2).asterix();
        }),
      },
    });
  }

  public play(player: Player) {
    const coloniesCount = player.getColoniesCount();
    player.addProduction(Resources.PLANTS, coloniesCount, {log: true});

    const animalCards = player.getResourceCards(CardResource.ANIMAL);
    if (animalCards.length) {
      player.game.defer(new AddResourcesToCard(player, CardResource.ANIMAL, {count: 1}));
    }

    const microbeCards = player.getResourceCards(CardResource.MICROBE);
    if (microbeCards.length) {
      player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 2}));
    }

    return undefined;
  }
}
