import {Game, Score} from '../Game';
import {GameOptions} from '../GameOptions';
import {GameId, PlayerId, SpectatorId} from '../../common/Types';
import {SerializedGame} from '../SerializedGame';

export type GameIdLedger = {gameId: GameId, participantIds: Array<PlayerId | SpectatorId>}

/**
 * A game store. Load, save, you know the drill.
 *
 * Each game has a unique ID represented belowe as `game_id`. As games proceed,
 * the game is saved at later states. Inidividual saves of a game's state have a
 * unique and growing `save_id`. A game's initial _save point_ is always 0.
 *
 * Game state is stored as a single JSON string, which is why the `game` parameter is
 * often JSON.
 *
 * Finally, `players` as a number merely represents the number of players
 * in the game. Why, I have no idea, says kberg.
*/
export interface IDatabase {

    /**
     * Creates any tables needed
     */
    initialize(): Promise<unknown>;

    /**
     * Pulls most recent version of game
     * @param game_id the game id to load
     */
    getGame(game_id: string): Promise<SerializedGame>;

    /**
     * Finds the game id associated with the given player.
     *
     * This is not yet written efficiently in Postgres, so use sparingly.
     *
     * @param id the `PlayerId` or `SpectatorId` assocaited with a game
     */
    getGameId(id: PlayerId | SpectatorId): Promise<GameId>;

    /**
     * Get all the save ids assocaited with a game.
     */
    getSaveIds(gameId: GameId): Promise<Array<number>>;

    /**
     * Load a game at a specific save point.
     */
    getGameVersion(game_id: GameId, save_id: number): Promise<SerializedGame>;

    /**
     * Return a list of all `game_id`s.
     *
     * When the server starts games will be loaded from first to last. The postgres implmentation
     * speeds up loading by sorting game ids so games most recently updated are loaded first, thereby
     * being available sooner than other games.
     */
    getGameIds(): Promise<Array<GameId>>;

    /**
     * Get the player count for a game.
     *
     * @param game_id the game id to search for
     */
    getPlayerCount(game_id: GameId): Promise<number>;

    /**
     * Saves the current state of the game. at a supplied save point. Used for
     * interim game updates.
     */
    saveGame(game: Game): Promise<void>;

    /**
     * Stores the results of a game in perpetuity in a separate table from normal
     * games. Called at a game's conclusion along with {@link cleanGame}.
     *
     * This is not impliemented in {@link SQLite}.
     *
     * @param generations the generation number at the end of the game
     * @param gameOptions the options used for this game.
     * @param scores an array of scores correlated to the player's corporation.
     */
    saveGameResults(game_id: GameId, players: number, generations: number, gameOptions: GameOptions, scores: Array<Score>): void;

    /**
     * The meat behind player undo. Loads the game at the given save point,
     * and provides it in the callback.
     */
    // TODO(kberg): it's not clear to me how this save_id is known to
    // be the absolute prior game id, so that could use some clarification.
    restoreGame(game_id: GameId, save_id: number): Promise<SerializedGame>;

    /**
     * Load a game at save point 0, and provide it in the callback.
     */
    loadCloneableGame(game_id: GameId): Promise<SerializedGame>;

    /**
     * Deletes the last `rollbackCount` saves of the specified game.
     *
     * Accessible by the administrative API to roll back a broken game.
     */
    deleteGameNbrSaves(game_id: GameId, rollbackCount: number): Promise<void>;

    /**
     * A maintenance task on a single game to close it out upon its completion.
     * It will:
     *
     * * Purge all saves between `(0, last save]`.
     * * Mark the game as finished.
     * * It also participates in purging abandoned solo games older
     *   than a given date range, regardless of the supplied `game_id`.
     *   Constraints for this purge vary by database.
     */
    // TODO(kberg): Make the extra maintenance behavior a first-class method.
    cleanGame(game_id: GameId): Promise<void>;

    /**
     * A maintenance task that purges abandoned solo games older
     * than a given date range.
     *
     * This is currently also part of cleanGame().
     *
     * Behavior when the environment variable is absent is system-dependent:
     * * In PostgreSQL, it uses a default of 10 days
     * * In Sqlite, it doesn't purge
     * * This whole method is ignored in LocalFilesystem.
     */
    purgeUnfinishedGames(maxGameDays?: string): Promise<void>;

    /**
     * Generate database statistics for admin purposes.
     *
     * Key/value responses will vary between databases.
     */
    stats(): Promise<{[key: string]: string | number}>;

    storeParticipants(entry: GameIdLedger): Promise<void>;
    getParticipants(): Promise<Array<GameIdLedger>>;
}
