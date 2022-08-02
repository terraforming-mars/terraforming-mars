import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {ISpace} from '../../boards/ISpace';
import {TileType} from '../../common/TileType';
import {GainResources} from '../../deferredActions/GainResources';
import {Priority} from '../../deferredActions/DeferredAction';
import {Size} from '../../common/cards/render/Size';
import {BoardType} from '../../boards/BoardType';
import {SpaceType} from '../../common/boards/SpaceType';

export class Steelaris extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.STEELARIS,
      tags: [Tags.BUILDING, Tags.CITY],
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

  public play() {
    return undefined;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace, boardType: BoardType) {
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
    // TODO(kberg): Use units to consolidate both of these into one.
    game.defer(
      new GainResources(cardOwner, Resources.STEEL, {
        count: 1,
        cb: () => game.log(
          '${0} gained 1 ${1} from ${2}',
          (b) => b.player(cardOwner).string(Resources.STEEL).cardName(this.name)),
      }),
      cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
    );
    game.defer(
      new GainResources(cardOwner, Resources.PLANTS, {
        count: 1,
        cb: () => game.log(
          '${0} gained 1 ${1} from ${2}',
          (b) => b.player(cardOwner).string(Resources.PLANTS).cardName(this.name)),
      }),
      cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
    );
  }
}
