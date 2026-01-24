import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {Resource} from '../../../common/Resource';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {Board} from '../../boards/Board';

export class Herbivores extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.HERBIVORES,
      tags: [Tag.ANIMAL],
      cost: 12,

      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}, per: 2},
      requirements: {oxygen: 8},

      behavior: {
        decreaseAnyProduction: {type: Resource.PLANTS, count: 1},
        addResources: 1,
      },

      metadata: {
        cardNumber: '147',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you place a greenery tile, add an animal to this card.', (eb) => {
            eb.greenery({withO2: false}).startEffect.resource(CardResource.ANIMAL);
          }).br;
          b.vpText('1 VP per 2 animals on this card.');
          b.resource(CardResource.ANIMAL).production((pb) => pb.minus().plants(1, {all}));
        }),
        description: {
        // TODO (chosta): revert the original description once a solution for description space is found
          text: 'Requires 8% oxygen. +1 animal to this card. -1 any plant production',
          align: 'left',
        },
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
    if (cardOwner.id === activePlayer.id && Board.isGreenerySpace(space)) {
      cardOwner.game.defer(new AddResourcesToCard(cardOwner, CardResource.ANIMAL, {filter: (c) => c.name === this.name}));
    }
  }
}
