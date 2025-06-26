import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class UrbanDecomposers extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 6,
      tags: [Tag.MICROBE],
      name: CardName.URBAN_DECOMPOSERS,
      type: CardType.AUTOMATED,

      behavior: {
        production: {plants: 1},
        addResourcesToAnyCard: {count: 2, type: CardResource.MICROBE},
      },

      requirements: [{colonies: 1}, {cities: 1}],
      metadata: {
        cardNumber: 'C48',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).resource(CardResource.MICROBE, 2).asterix();
        }),
        description: 'Requires that you have 1 city tile and 1 colony in play. Increase your plant production 1 step, and add 2 microbes to ANOTHER card.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    let coloniesCount = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
    });
    return coloniesCount > 0 && player.game.board.getCities(player).length > 0;
  }
}
