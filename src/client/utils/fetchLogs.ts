import {paths} from '@/common/app/paths';
import {LogMessage} from '@/common/logs/LogMessage';
import {ParticipantId} from '@/common/Types';

let abortController: AbortController | undefined;

export async function fetchLogs(id: ParticipantId | undefined, generation: number): Promise<Array<LogMessage> | undefined> {
  // Aborts any pending request for a previous generation before starting the new one.
  // If the past call is complete, .abort() does nothing.
  abortController?.abort();
  abortController = new AbortController();

  const url = `${paths.API_GAME_LOGS}?id=${id}&generation=${generation}`;

  try {
    const resp = await fetch(url, {signal: abortController.signal});
    if (!resp.ok) {
      console.error(`error updating messages, response code ${resp.status}`);
      return undefined;
    }
    return await resp.json();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      // ignore aborted requests
      return undefined;
    }
    console.error('error updating messages, unable to reach server');
    return undefined;
  }
}
