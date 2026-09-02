import {Log} from '../../common/logs/Log';
import {GameId} from '../../common/Types';
import {IDatabase} from '../database/IDatabase';
import {LogMessageDataType} from '../../common/logs/LogMessageDataType';
import {tileTypeToString} from '../../common/TileType';
import {getSpaceName} from '../../common/boards/spaces';

export async function exportLogs(db: IDatabase, gameId: GameId): Promise<Array<string>> {
  const saveIds = await db.getSaveIds(gameId);
  let lastIdx = 0;
  const entries = [];
  for (const saveId of saveIds) {
    const {gameLog} = await db.getGameVersion(gameId, saveId);
    for (let idx = lastIdx; idx < gameLog.length; idx++) {
      const logEntry = gameLog[idx];
      try {
        const text = Log.applyData(logEntry, (datum) => {
          switch (datum.type) {
          case LogMessageDataType.SPACE:
            return getSpaceName(datum.value);
          case LogMessageDataType.TILE_TYPE:
            return tileTypeToString[datum.value];
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
