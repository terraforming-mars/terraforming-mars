import {Log} from '../../common/logs/Log';
import {GameId} from '../../common/Types';
import {IDatabase} from '../database/IDatabase';
import {LogMessageDataType} from '../../common/logs/LogMessageDataType';
import {tileTypeToString} from '../../common/TileType';
import {Game} from '../Game';

export async function exportLogs(db: IDatabase, gameId: GameId): Promise<Array<string>> {
  const saveIds = await db.getSaveIds(gameId);
  let lastIdx = 0;
  const entries = [];
  // Every version of a game has the same boards, so any one of them labels the spaces.
  const game = Game.deserialize(await db.getGameVersion(gameId, saveIds[0]));
  const a9 = {...game.board.A9, ...game.moonData?.moon.A9};
  for (const saveId of saveIds) {
    const {gameLog} = await db.getGameVersion(gameId, saveId);
    for (let idx = lastIdx; idx < gameLog.length; idx++) {
      const logEntry = gameLog[idx];
      try {
        const text = Log.applyData(logEntry, (datum) => {
          switch (datum.type) {
          case LogMessageDataType.SPACE:
            return a9[datum.value] ?? 'n/a';
          case LogMessageDataType.TILE_TYPE:
            return tileTypeToString[datum.value];
          case LogMessageDataType.RESOURCE:
          case LogMessageDataType.PRODUCTION:
          case LogMessageDataType.CARD_RESOURCE:
            return Log.shortcode(datum) ?? datum.value.toString();
          default:
            return datum.value.toString();
          }
        });
        entries.push(`[${saveId}/${idx}]: ${text}`);
      } catch (e) {
        entries.push(`[${saveId}/${idx}]: ${JSON.stringify(logEntry)} - Error processing log entry: ${e}`);
      }
    }
    lastIdx = gameLog.length;
  }
  return entries;
}
