import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {SelectProductionToLoseDeferred} from '../../deferredActions/SelectProductionToLoseDeferred';
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
        description: 'Once per game, place X hazard tiles where X is the current generation number. Each opponent loses 1 unit of production of their choice, or 2 units if there are 6 or more hazard tiles.',
      },
    });
  }

  public override canAct(player: IPlayer): boolean {
    if (!super.canAct(player)) {
      return false;
    }
    return player.game.board.getAvailableSpacesOnLand(player).length >= player.game.generation;
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;
    for (let i = 0; i < game.generation; i++) {
      game.defer(new PlaceHazardTile(player, TileType.EROSION_MILD));
    }

    const otherPlayers = game.getPlayers().filter((p) => p.id !== player.id);

    player.defer(() => {
      const hazardTileCount = game.board.spaces.filter((space) => space.tile && HAZARD_TILES.has(space.tile.tileType)).length;
      otherPlayers.forEach((opponent) => {
        const units = hazardTileCount < 6 ? 1 : 2;
        game.defer(new SelectProductionToLoseDeferred(opponent, units));
      });
      return undefined;
    });

    return undefined;
  }
}
