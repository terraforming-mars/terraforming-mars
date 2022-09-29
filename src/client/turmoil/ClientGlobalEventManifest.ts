import {GlobalEventModel} from '@/common/models/TurmoilModel';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '@/common/turmoil/PartyName';
import {IClientGlobalEvent} from '@/common/turmoil/IClientGlobalEvent';
// @ts-ignore events.json doesn't exist during npm run build
import * as eventJson from '@/genfiles/events.json';

const events: Map<GlobalEventName, IClientGlobalEvent> = new Map();
(eventJson as any as Array<IClientGlobalEvent>).forEach((card) => {
  events.set(card.name, card);
});

export function allGlobalEventNames() {
  return events.keys();
}

export function getGlobalEvent(globalEventName: GlobalEventName): IClientGlobalEvent | undefined {
  return events.get(globalEventName);
}

export function getGlobalEventOrThrow(globalEventName: GlobalEventName): IClientGlobalEvent {
  const globalEvent = getGlobalEvent(globalEventName);
  if (globalEvent === undefined) {
    throw new Error(`global event ${globalEventName} not found`);
  }
  return globalEvent;
}

export function getGlobalEventModel(globalEventName: GlobalEventName): GlobalEventModel {
  const globalEvent = getGlobalEvent(globalEventName);
  if (globalEvent) {
    return {
      name: globalEvent.name,
      description: globalEvent.description,
      revealed: globalEvent.revealedDelegate,
      current: globalEvent.currentDelegate,
    };
  }
  return {
    name: globalEventName,
    description: 'global event not found',
    revealed: PartyName.GREENS,
    current: PartyName.GREENS,
  };
}
