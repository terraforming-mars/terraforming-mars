import {Game} from '../Game';
import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';
import {_AresHazardPlacement} from '../ares/AresHazards';
import {TileType} from '../../common/TileType';
import {PlacementType} from '../boards/PlacementType';

// Some code commented out is the code for Athena corp, if it's ever implemented we can use this
// It's all commented with //ATHENA

// ATHENA import {CardName} from '../../common/cards/CardName';
// ATHENA import {SelectProductionToLoseDeferred} from './SelectProductionToLoseDeferred';

export class PlaceHazardTile extends DeferredAction {
  constructor(
    player: Player,
    private options?: {
      on?: PlacementType,
      game: Game,
      title?: string,
      spaces: Array<ISpace>,
      collectBonuses?: boolean,
      productionPenalty?: boolean
    }) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const type = this.options?.on || 'hazard';
    const title = this.options?.title ?? this.getTitle(type);
    const spaces = this.options?.spaces || this.player.game.board.getAvailableSpacesForType(this.player, type);
    const collectBonuses = this.options?.collectBonuses || false;
    // ATHENA const productionPenalty = this.options?.productionPenalty || false

    if (spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(
      title,
      spaces,
      (space: ISpace) => {
        const tileType = Math.floor(Math.random() * 2) === 0 ? TileType.DUST_STORM_MILD : TileType.EROSION_MILD;
        _AresHazardPlacement.putHazardAt(space, tileType);

        if (collectBonuses) {
          space.bonus.forEach((spaceBonus) => this.player.game.grantSpaceBonus(this.player, spaceBonus));
        }

        // ATHENA if (productionPenalty) {
        // ATHENA   this.player.game.board.getAdjacentSpaces(space).forEach((space) => {
        // ATHENA     if (space.player !== undefined && space.player !== this.player) {
        // ATHENA       if (!space.player.isCorporation(CardName.ATHENA)) {
        // ATHENA         this.player.game.defer(new SelectProductionToLoseDeferred(space.player, 1));
        // ATHENA       }
        // ATHENA     }
        // ATHENA   });
        // ATHENA }

        return undefined;
      },
    );
  }

  private getTitle(type: PlacementType) {
    switch (type) {
    case 'hazard': return 'Select space for hazard tile';
    default: throw new Error('unhandled type; ' + type);
    }
  }
}
