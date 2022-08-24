import {Game} from '../Game';
import {IColony} from './IColony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ICard} from '../cards/ICard';
import {Tag} from '../../common/cards/Tag';

export class ColoniesHandler {
  public static getColony(game: Game, colonyName: ColonyName, includeDiscardedColonies: boolean = false): IColony {
    let colony: IColony | undefined = game.colonies.find((c) => c.name === colonyName);
    if (colony !== undefined) return colony;
    if (includeDiscardedColonies === true) {
      colony = game.discardedColonies.find((c) => c.name === colonyName);
      if (colony !== undefined) return colony;
    }
    throw new Error(`Unknown colony '${colonyName}'`);
  }

  public static tradeableColonies(game: Game) {
    return game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);
  }

  public static onCardPlayed(game: Game, card: ICard) {
    if (!game.gameOptions.coloniesExtension) return;
    game.colonies.forEach((colony) => {
      ColoniesHandler.maybeActivateColony(colony, card);
    });
  }

  /*
   * Conditionally activate the incoming colony based on the played card.
   *
   * Returns `true` if the colony is already active, or becomes active from this
   * method.
   */
  public static maybeActivateColony(colony: IColony, card: ICard): boolean {
    if (colony.isActive === true) {
      return true;
    }
    if (colony.metadata.resourceType !== undefined && colony.metadata.resourceType === card.resourceType) {
      colony.isActive = true;
      return true;
    }

    if (colony.name === ColonyName.VENUS && card.tags.includes(Tag.VENUS)) {
      colony.isActive = true;
      return true;
    }
    return false;
  }
}
