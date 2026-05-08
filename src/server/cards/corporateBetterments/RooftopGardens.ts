import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {Board} from '../../boards/Board';
import {Resource} from '../../../common/Resource';
import {Priority} from '../../deferredActions/Priority';
import {GainResourcesDeferred} from '../../deferredActions/GainResourcesDeferred';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class RooftopGardens extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ROOFTOP_GARDENS,
      tags: [Tag.PLANT],
      cost: 15,
      requirements: {oxygen: 5},
      metadata: {
        cardNumber: 'B19',
        description: 'Requires at least 5% Oxygen. Effect: Whenever a City tile is placed, gain 2 Plants.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When any City tile is placed, gain 2 plants.', (eb) => {
            eb.city({size: Size.SMALL, all}).startEffect.plants(2);
          });
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
    if (Board.isCitySpace(space)) {
      cardOwner.game.defer(
        new GainResourcesDeferred(cardOwner, Resource.PLANTS, {count: 2, log: true}),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
      );
    }
  }
}
