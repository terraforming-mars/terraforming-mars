import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class UrbanDecomposers extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 6,
      tags: [Tag.MICROBE],
      name: CardName.URBAN_DECOMPOSERS,
      cardType: CardType.AUTOMATED,

      behavior: {
        production: {plants: 1},
        addResourcesToAnyCard: {count: 2, type: CardResource.MICROBE},
      },

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

  public override bespokeCanPlay(player: Player): boolean {
    let coloniesCount = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
    });
    return coloniesCount > 0 && player.game.getCitiesCount(player) > 0;
  }
}
