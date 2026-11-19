import {BonusId, PolicyId} from '@/common/turmoil/Types';
import {ClientAgenda} from '@/common/turmoil/ClientAgenda';
import agendaJson from '@/genfiles/agendas.json';

const agendas = agendaJson;

export function getAgenda(id: BonusId | PolicyId): ClientAgenda | undefined {
  return agendas[id];
}

export function getAgendaOrThrow(id: BonusId | PolicyId): ClientAgenda {
  const agenda = getAgenda(id);
  if (agenda === undefined) {
    throw new Error(`agenda ${id} not found`);
  }
  return agenda;
}
