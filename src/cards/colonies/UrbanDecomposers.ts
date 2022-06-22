import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Resources} from '../../common/Resources';
import {CardResource} from '../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class UrbanDecomposers extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 6,
      tags: [Tags.MICROBE],
      name: CardName.URBAN_DECOMPOSERS,
      cardType: CardType.AUTOMATED,

      requirements: CardRequirements.builder((b) => b.colonies().cities()),
      metadata: {
        cardNumber: 'C48',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).microbes(2).asterix();
        }),
        description: 'Requires that you have 1 city tile and 1 colony in play. Increase your plant production 1 step, and add 2 microbes to ANOTHER card.',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    let coloniesCount: number = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
    });
    return coloniesCount > 0 && player.game.getCitiesCount(player) > 0;
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);

    const microbeCards = player.getResourceCards(CardResource.MICROBE);
    if (microbeCards.length) {
      player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 2}));
    }

    return undefined;
  }
}
