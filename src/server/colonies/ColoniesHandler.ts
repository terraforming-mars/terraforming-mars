import {IGame} from '../IGame';
import {IColony} from './IColony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ICard} from '../cards/ICard';
import {Tag} from '../../common/cards/Tag';
import {SelectColony} from '../inputs/SelectColony';
import {IPlayer} from '../IPlayer';
import {inplaceRemove} from '../../common/utils/utils';

export class ColoniesHandler {
  public static getColony(game: IGame, colonyName: ColonyName, includeDiscardedColonies: boolean = false): IColony {
    let colony: IColony | undefined = game.colonies.find((c) => c.name === colonyName);
    if (colony !== undefined) return colony;
    if (includeDiscardedColonies === true) {
      colony = game.discardedColonies.find((c) => c.name === colonyName);
      if (colony !== undefined) return colony;
    }
    throw new Error(`Unknown colony '${colonyName}'`);
  }

  public static tradeableColonies(game: IGame) {
    return game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);
  }

  public static maybeActivateColonies(game: IGame, card: ICard) {
    if (!game.gameOptions.coloniesExtension) return;
    game.colonies.forEach((colony) => {
      if (colony.isActive === false && ColoniesHandler.cardActivatesColony(colony, card)) {
        colony.isActive = true;
      }
    });
  }

  /*
   * Return true if the colony is active, or will be activated by this card.
   *
   * Returns `true` if the colony is already active, or becomes active from this
   * call.
   */
  public static cardActivatesColony(colony: IColony, card: ICard): boolean {
    if (colony.isActive) {
      return true;
    }
    if (colony.metadata.cardResource !== undefined && colony.metadata.cardResource === card.resourceType) {
      return true;
    }
    if (colony.name === ColonyName.VENUS && card.tags.includes(Tag.VENUS) && card.resourceType !== undefined) {
      return true;
    }
    return false;
  }

  /**
   * Add a discarded colony tile back into the game, e.g. with Aridor.
   */
  public static addColonyTile(player: IPlayer, options?: {
    title?: string,
    colonies?: Array<IColony>,
    activateableOnly?: boolean,
    cb?: (colony: IColony) => void,
  }): void {
    const game = player.game;
    let colonyTiles = options?.colonies ?? game.discardedColonies;
    if (options?.activateableOnly === true) {
      colonyTiles = colonyTiles.filter((colonyTile) => colonyTileWillEnterActive(colonyTile, game));
    }
    if (colonyTiles.length === 0) {
      game.log('No availble colony tiles for ${0} to choose from', (b) => b.player(player));
      return;
    }

    const title = options?.title ?? 'Select colony tile to add';

    function colonyTileWillEnterActive(colony: IColony, game: IGame): boolean {
      if (colony.isActive) {
        return true;
      }
      for (const player of game.getPlayers()) {
        for (const card of player.tableau) {
          if (ColoniesHandler.cardActivatesColony(colony, card)) {
            return true;
          }
        }
      }
      return false;
    }

    const selectColonyTile = new SelectColony(title, 'Add colony tile', [...colonyTiles])
      .andThen((colonyTile) => {
        game.colonies.push(colonyTile);
        game.colonies.sort((a, b) => (a.name > b.name) ? 1 : -1);
        game.log('${0} added a new Colony tile: ${1}', (b) => b.player(player).colony(colonyTile));
        if (!colonyTile.isActive && colonyTileWillEnterActive(colonyTile, game)) {
          colonyTile.isActive = true;
        }
        inplaceRemove(game.discardedColonies, colonyTile);
        options?.cb?.(colonyTile);
        return undefined;
      });
    selectColonyTile.showTileOnly = true;
    player.defer(selectColonyTile);
  }
}
