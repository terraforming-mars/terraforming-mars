import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {ClientGlobalEvent} from '@/common/turmoil/ClientGlobalEvent';
// @ts-ignore events.json doesn't exist during npm run build
import eventJson from '@/genfiles/events.json';

const events: Map<GlobalEventName, ClientGlobalEvent> = new Map();
(eventJson as any as Array<ClientGlobalEvent>).forEach((card) => {
  events.set(card.name, card);
});

export function allGlobalEventNames() {
  return events.keys();
}

export function getGlobalEvent(globalEventName: GlobalEventName): ClientGlobalEvent | undefined {
  return events.get(globalEventName);
}

export function getGlobalEventOrThrow(globalEventName: GlobalEventName): ClientGlobalEvent {
  const globalEvent = getGlobalEvent(globalEventName);
  if (globalEvent === undefined) {
    throw new Error(`global event ${globalEventName} not found`);
  }
  return globalEvent;
}
