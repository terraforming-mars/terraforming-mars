import {CardName} from '@/common/cards/CardName';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {CeoCard} from '@/server/cards/ceos/CeoCard';

import {SelectProductionToLoseDeferred} from '@/server/deferredActions/SelectProductionToLoseDeferred';
import {PlaceHazardTile} from '@/server/deferredActions/PlaceHazardTile';
import {TileType} from '@/common/TileType';
import {Size} from '@/common/cards/render/Size';
import {all} from '@/server/cards/Options';

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

    player.defer(() => {
      const units = game.board.getHazards().length < 6 ? 1 : 2;
      player.opponents.forEach((opponent) => {
        game.defer(new SelectProductionToLoseDeferred(opponent, units));
      });
      return undefined;
    });

    return undefined;
  }
}
