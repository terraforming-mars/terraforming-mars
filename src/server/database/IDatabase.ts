import {IGame, Score} from '../IGame';
import {GameOptions} from '../game/GameOptions';
import {GameId, ParticipantId} from '../../common/Types';
import {SerializedGame} from '../SerializedGame';
import {Session, SessionId} from '../auth/Session';

export type GameIdLedger = {gameId: GameId, participantIds: Array<ParticipantId>}

/**
 * A game store. Load, save, you know the drill.
 *
 * Each game has a unique ID represented belowe as `gameId`. As games proceed,
 * the game is saved at later states. Inidividual saves of a game's state have a
 * unique and growing `saveId`. A game's initial _save point_ is always 0.
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
     * @param gameId the game id to load
     */
    getGame(gameId: string): Promise<SerializedGame>;

    /**
     * Finds the game id associated with the given player.
     *
     * This is not yet written efficiently in Postgres, so use sparingly.
     *
     * @param id the `PlayerId` or `SpectatorId` assocaited with a game
     */
    getGameId(id: ParticipantId): Promise<GameId>;

    /**
     * Get all the save ids assocaited with a game.
     */
    getSaveIds(gameId: GameId): Promise<Array<number>>;

    /**
     * Load a game at a specific save point.
     */
    getGameVersion(gameId: GameId, saveId: number): Promise<SerializedGame>;

    /**
     * Return a list of all game IDs.
     *
     * When the server starts games will be loaded from first to last. The postgres implmentation
     * speeds up loading by sorting game ids so games most recently updated are loaded first, thereby
     * being available sooner than other games.
     */
    getGameIds(): Promise<Array<GameId>>;

    /**
     * Get the player count for a game.
     *
     * @param gameId the game id to search for
     */
    getPlayerCount(gameId: GameId): Promise<number>;

    /**
     * Saves the current state of the game. at a supplied save point. Used for
     * interim game updates.
     *
     * Do not call directly.
     */
    saveGame(game: IGame): Promise<void>;

    /**
     * Stores the results of a game in perpetuity in a separate table from normal
     * games. Called at a game's conclusion along with {@link markFinished}.
     *
     * This is not impliemented in {@link SQLite}.
     *
     * @param generations the generation number at the end of the game
     * @param gameOptions the options used for this game.
     * @param scores an array of scores correlated to the player's corporation.
     */
    saveGameResults(gameId: GameId, players: number, generations: number, gameOptions: GameOptions, scores: Array<Score>): void;

    /**
     * Deletes the last `rollbackCount` saves of the specified game.
     *
     * Used as part of undo, reset, and via API to roll back a broken game.
     */
    deleteGameNbrSaves(gameId: GameId, rollbackCount: number): Promise<void>;

    /**
     * A maintenance task on a single game to mark it as complete.
     *
     * It will:
     *
     * * Mark the game as finished.
     * * Put it on queue to compress it after a given amount of time.
     *   (Purges all saves between `(0, last save]`.)
     */
    markFinished(gameId: GameId): Promise<void>;

    /**
     * A maintenance task that purges abandoned solo games older
     * than a given date range.
     *
     * Behavior when the environment variable is absent is system-dependent:
     * * In PostgreSQL, it uses a default of 10 days
     * * In Sqlite, it doesn't purge
     * * This whole method is ignored in LocalFilesystem.
     *
     * Returns a list of purged Game IDs.
     */
    purgeUnfinishedGames(maxGameDays?: string): Promise<Array<GameId>>;

    /**
     * A maintenance task that compresses completed games.
     */
    compressCompletedGames(maxGameDays?: string): Promise<unknown>;

    /**
     * Generate database statistics for admin purposes.
     *
     * Key/value responses will vary between databases.
     */
    stats(): Promise<{[key: string]: string | number}>;

    storeParticipants(entry: GameIdLedger): Promise<void>;
    getParticipants(): Promise<Array<GameIdLedger>>;

    createSession(session: Session): Promise<void>;
    deleteSession(sessionId: SessionId): Promise<void>;
    getSessions(): Promise<Array<Session>>;
}
