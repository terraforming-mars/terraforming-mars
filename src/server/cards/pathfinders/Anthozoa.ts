import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';

export class Anthozoa extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ANTHOZOA,
      cost: 9,
      tags: [Tag.PLANT, Tag.ANIMAL, Tag.MARS],
      requirements: {oceans: 3},
      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}, per: 2},

      metadata: {
        cardNumber: 'Pf55',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 plant to add an animal to this card.', (eb) => {
            eb.plants(1).startAction.resource(CardResource.ANIMAL);
          });
        }),
        description: 'Requires 3 oceans on Mars. 1 VP per 2 animals on this card.',
      },
    });
  }


  public canAct(player: IPlayer) {
    return player.plants > 0;
  }

  public action(player: IPlayer) {
    player.stock.deduct(Resource.PLANTS, 1);
    player.addResourceTo(this);
    player.game.log('${0} spent 1 plant to place an animal on ${1}.', (b) => b.player(player).card(this));
    return undefined;
  }
}

