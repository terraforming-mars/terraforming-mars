import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {Space} from '../../boards/Space';
import {TileType} from '../../../common/TileType';
import {GainStock} from '../../deferredActions/GainStock';
import {Priority} from '../../deferredActions/DeferredAction';
import {Size} from '../../../common/cards/render/Size';
import {BoardType} from '../../boards/BoardType';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Units} from '../../../common/Units';

export class Steelaris extends CorporationCard {
  constructor() {
    super({
      name: CardName.STEELARIS,
      tags: [Tag.BUILDING, Tag.CITY],
      startingMegaCredits: 42,

      metadata: {
        cardNumber: 'PfC9',
        description: 'You start with 42 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).br;
          b.corpBox('effect', (ce) => {
            ce.effect('When any city or special tile is placed ON MARS, gain 1 steel and 1 plant.', (eb) => {
              eb.city({size: Size.SMALL, all}).slash().specialTile({size: Size.SMALL, all}).startEffect.steel(1).plants(1);
            });
          });
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType) {
    const game = cardOwner.game;
    // Does not apply to The Moon.
    if (boardType !== BoardType.MARS) {
      return;
    }
    if (space.spaceType === SpaceType.COLONY) {
      return;
    }
    const tileType = space.tile?.tileType;
    if (tileType === TileType.OCEAN || tileType === TileType.GREENERY) {
      return;
    }
    game.defer(
      new GainStock(cardOwner, Units.of({steel: 1, plants: 1}), {
        cb: () => game.log(
          '${0} gained 1 ${1} and 1 ${2} from ${3}',
          (b) => b.player(cardOwner).string(Resource.STEEL).string(Resource.PLANTS).cardName(this.name)),
      }),
      cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
    );
  }
}
