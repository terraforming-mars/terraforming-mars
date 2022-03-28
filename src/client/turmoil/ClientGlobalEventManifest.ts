import {ALL_EVENTS} from '@/turmoil/globalEvents/GlobalEventDealer';
import {GlobalEventModel} from '@/common/models/TurmoilModel';
import {GlobalEventName} from '@/common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '@/common/turmoil/PartyName';
import {IClientGlobalEvent} from '@/common/turmoil/IClientGlobalEvent';

export function allGlobalEventNames() {
  return ALL_EVENTS.keys();
}

export function getGlobalEvent(globalEventName: GlobalEventName): IClientGlobalEvent | undefined {
  const Factory = ALL_EVENTS.get(globalEventName);

  if (Factory !== undefined) return new Factory();
  return undefined;
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
