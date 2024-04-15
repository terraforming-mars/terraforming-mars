import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {CardName} from '../../../common/cards/CardName';
import {Resource} from '../../../common/Resource';
import {Priority} from '../../deferredActions/Priority';
import {GainResources} from '../../deferredActions/GainResources';
import {CardRenderer} from '../render/CardRenderer';
import {all, max} from '../Options';
import {Board} from '../../boards/Board';

export class ArcticAlgae extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ARCTIC_ALGAE,
      tags: [Tag.PLANT],
      cost: 12,

      behavior: {
        stock: {plants: 1},
      },

      requirements: {temperature: -12, max},
      metadata: {
        description: 'It must be -12 C or colder to play. Gain 1 plant.',
        cardNumber: '023',
        renderData: CardRenderer.builder((b) => {
          b.effect('When anyone places an ocean tile, gain 2 plants.', (be) => be.oceans(1, {all}).startEffect.plants(2)).br;
          b.plants(1);
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space) {
    if (Board.isUncoveredOceanSpace(space)) {
      cardOwner.game.defer(
        new GainResources(cardOwner, Resource.PLANTS, {count: 2}).andThen(() => activePlayer.game.log(
          '${0} gained 2 ${1} from ${2}',
          (b) => b.player(cardOwner).string(Resource.PLANTS).cardName(this.name))),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined);
    }
  }
}
