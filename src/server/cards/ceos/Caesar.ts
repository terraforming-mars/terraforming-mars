import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {SelectProductionToLoseDeferred} from '../../deferredActions/SelectProductionToLoseDeferred';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {PlaceHazardTile} from '../../deferredActions/PlaceHazardTile';
import {HAZARD_TILES, TileType} from '../../../common/TileType';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class Caesar extends CeoCard {
  constructor() {
    super({
      name: CardName.CAESAR,
      metadata: {
        cardNumber: 'L33',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('X').hazardTile(1, {size: Size.LARGE}).br;
          b.minus().production((pb) => pb.wild(1, {all})).asterix();
          b.br;
        }),
        description: 'Once per game, place X hazard tiles. Each opponent loses 1 unit of production, or 2 units if there are 6 or more hazard tiles.',
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
      game.defer(new PlaceHazardTile(player, TileType.EROSION_MILD));
    }

    const otherPlayers = game.getPlayers().filter((p) => p.id !== player.id);

    game.defer(new SimpleDeferredAction(player, () => {
      const hazardTileCount = game.board.spaces.filter((space) => space.tile && HAZARD_TILES.has(space.tile.tileType)).length;
      otherPlayers.forEach((opponent) => {
        if (hazardTileCount < 6) {
          game.defer(new SelectProductionToLoseDeferred(opponent, 1));
        } else {
          game.defer(new SelectProductionToLoseDeferred(opponent, 2));
        }
      });
      return undefined;
    }));

    this.isDisabled = true;
    return undefined;
  }
}
