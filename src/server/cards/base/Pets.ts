import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/DeferredAction';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class Pets extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PETS,
      tags: [Tag.EARTH, Tag.ANIMAL],
      cost: 10,
      resourceType: CardResource.ANIMAL,

      victoryPoints: {resourcesHere: {}, per: 2},

      behavior: {
        addResources: 1,
      },

      metadata: {
        cardNumber: '172',
        renderData: CardRenderer.builder((b) => {
          b.effect('When any city tile is placed, add an animal to this card.', (eb) => {
            eb.city({size: Size.SMALL, all}).startEffect.animals(1);
          }).br;
          b.animals(1).br;
          b.text('Animals may not be removed from this card', Size.SMALL, true).br;
          b.vpText('1 VP per 2 animals here.');
        }),
        description: {text: 'Add 1 animal to this card.', align: 'left'},
      },
    });
  }


  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (Board.isCitySpace(space)) {
      cardOwner.game.defer(
        new AddResourcesToCard(cardOwner, CardResource.ANIMAL, {filter: (c) => c.name === this.name}),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
      );
    }
  }
}
