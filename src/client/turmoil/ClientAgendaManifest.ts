import {BonusId, PolicyId} from '@/common/turmoil/Types';
import {ClientAgenda} from '@/common/turmoil/ClientAgenda';
// @ts-ignore agendas.json doesn't exist during npm run build
import agendaJson from '@/genfiles/agendas.json';

const agendas = agendaJson as Partial<Record<BonusId | PolicyId, ClientAgenda>>;

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
