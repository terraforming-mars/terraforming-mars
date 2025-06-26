import {Log} from '../../common/logs/Log';
import {GameId} from '../../common/Types';
import {IDatabase} from '../database/IDatabase';

export async function exportLogs(db: IDatabase, gameId: GameId): Promise<Array<string>> {
  const saveIds = await db.getSaveIds(gameId);
  let lastIdx = 0;
  const entries = [];
  for (const saveId of saveIds) {
    const {gameLog} = await db.getGameVersion(gameId, saveId);
    for (let idx = lastIdx; idx < gameLog.length; idx++) {
      const logEntry = gameLog[idx];
      const text = Log.applyData(logEntry, (datum) => datum.value.toString());
      entries.push(`[${saveId}/${idx}]: ${text}`);
    }
    lastIdx = gameLog.length;
  }
  return entries;
}
