import {LogMessage} from '../../common/logs/LogMessage';
import {IGame} from '../IGame';

export function appendCanceledLogMessages(current: IGame, restored: IGame): void {
  const canceledMessages = current.gameLog.slice(restored.gameLog.length)
    .filter((message) => message?.canceled !== true)
    .map((message) => {
      const copy = JSON.parse(JSON.stringify(message)) as LogMessage;
      copy.canceled = true;
      return copy;
    });

  if (canceledMessages.length === 0) {
    return;
  }

  restored.gameLog.push(...canceledMessages);
  restored.gameAge += canceledMessages.length;
}
