import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {SelectProductionToLoseDeferred} from '../../deferredActions/SelectProductionToLoseDeferred';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {PlaceHazardTile} from '../../deferredActions/PlaceHazardTile';
import {HAZARD_TILES, TileType} from '../../../common/TileType';
// import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class Caesar extends CeoCard {
  constructor() {
    super({
      name: CardName.CAESAR,
      metadata: {
        cardNumber: 'L33',
        renderData: CardRenderer.builder((b) => {
          // b.opgArrow().colon().text('X').hazardTile(1, {size: Size.LARGE}).nbsp;
          b.minus().production((pb) => pb.wild(1, {all})).asterix();
          b.br;
        }),
        description: 'Once per game, place X hazard tiles. Each opponent loses 1 unit of production, or 2 units if there are more than 5 hazard tiles.',
      },
    });
  }

  public override canAct(player: Player): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    const game = player.game;
    return game.board.getAvailableSpacesOnLand(player).length >= game.generation;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    for (let i = 0; i < game.generation; i++) {
      game.defer(new PlaceHazardTile(player, TileType.DUST_STORM_MILD));
    }

    const otherPlayers = game.getPlayers().filter((p) => p.id !== player.id);

    game.defer(new SimpleDeferredAction(player, () => {
      const hazardTileCount = game.board.spaces.filter((space) => space.tile && HAZARD_TILES.has(space.tile.tileType)).length;
      otherPlayers.forEach((player) => {
        if (hazardTileCount > 5) {
          game.defer(new SelectProductionToLoseDeferred(player, 2));
        } else {
          game.defer(new SelectProductionToLoseDeferred(player, 1));
        }
      });
      return undefined;
    }));

    this.isDisabled = true;
    return undefined;
  }
}
