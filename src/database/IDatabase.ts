import {Game, GameId, GameOptions, Score} from '../Game';
import {SerializedGame} from '../SerializedGame';

export interface IGameData {
    gameId: GameId;
    playerCount: number;
}

/**
 * A game store. Load, save, you know the drill.
 *
 * Each game has a unique ID represented belowe as `game_id`. As games proceed,
 * the game is saved at later states. Inidividual saves of a game's state have a
 * unique and growing `save_id`. A game's initial _save point_ is always 0.
 *
 * This API has an asynchronous callback mechanism, so do not expect something
 * like this to work:
 *
 * ```
 * let count = 0;
 * database.getGames((err, allGames) => {
 *  count++;
 * });
 * expect(count).eq(1);
 * ```
 * More at https://blog.risingstack.com/node-hero-async-programming-in-node-js/
 *
 * Every method's success or failure is derived by the callback. Each callback
 * has an `err` parameter, which, when `undefined`, implies success. An `err`
 * with a defined value represents failure.
 *
 * If a method doesn't have a callback, it's assumed to succeed.
 *
 * Game state is stored as a single JSON string, which is why the `game` parameter is
 * often JSON.
 *
 * Finally, `players` as a number merely represents the number of players
 * in the game. Why, I have no idea, says kberg.
 */
export interface IDatabase {

    /**
     * Pulls most recent version of game
     * @param game_id the game id to load
     * @param cb called with game if exists, if game is undefined err will be truthy
     */
    getGame(game_id: string, cb: (err: any, game?: SerializedGame) => void): void;

    /**
     * Return a list of all `game_id`s.
     *
     * @param cb a callback containing either a failure to load, or a list of
     * references to cloneable games.
     *
     * @param cb a callback either returning either an error or a list of all `game_id`s.
     */
    getGames(cb:(err: any, allGames:Array<GameId>) => void): void;

    /**
     * Load references to all games that can be cloned. Every game is cloneable,
     * this just returns the original save of the game. However, if a game's
     * original save is pruned, say, due to {@link deleteGameNbrSaves}, it won't
     * appear in this list.
     *
     * Cloneable games are those with a save_id 0.
     *
     * @param cb a callback either returning either an error or a list of references
     * to cloneable games.
     */
    getClonableGames(cb:(err: any, allGames:Array<IGameData>)=> void) : void;

    /**
     * Saves the current state of the game at a supplied save point. Used for
     * interim game updates.
     *
     * The `save_id` is managed outside of the database, and so it is up to the
     * game to increment its state count.
     */
    // TODO(kberg): why is `players` a useful first-class piece of data?
    saveGameState(game_id: GameId, save_id: number, game: string, players: number): void;

    /**
     * Stores the results of a game in perpetuity in a separate table from normal
     * games. Called at a game's conclusion along with {@link cleanSaves}.
     *
     * This is not impliemented in {@link SQLite}.
     *
     * @param generations the generation number at the end of the game
     * @param gameOptions the options used for this game.
     * @param scores an array of scores correlated to the player's corporation.
     */
    saveGameResults(game_id: GameId, players: number, generations: number, gameOptions: GameOptions, scores: Array<Score>): void;

    /**
     * The meat behind player undo. Loads the game at the given save point
     * and overwrites all data in `game`.
     */
    // TODO(kberg): it's not clear to me how this save_id is known to
    // be the absolute prior game id, so that could use some clarification.
    restoreGame(game_id: GameId, save_id: number, game: Game): void;

    /**
     * The meat behind cloning a game. Load a game at save point 0,
     * and overrides all data in `game`.
     */
    restoreReferenceGame(game_id: GameId, game: Game, cb:(err: any) => void): void;

    /**
     * Deletes the last `rollbackCount` saves of the specified game.
     *
     * Accessible by the administrative API to roll back a broken game.
     */
    deleteGameNbrSaves(game_id: GameId, rollbackCount: number): void;

    /**
     * A maintenance task on a single game to close it out upon its completion.
     * It will:
     *
     * * Purge all saves between `(0, save_id]`.
     * * Mark the game as finished.
     * * It also participates in purging abandoned solo games older
     *   than a given date range, regardless of the supplied `game_id`.
     *   Constraints for this purge vary by database.
     */
    // TODO(kberg): rename to represent that it's closing out
    // this game. Also consider not needing the save_id, and
    // also to make the maintenance behavior a first-class method.
    cleanSaves(game_id: GameId, save_id: number): void;
}
