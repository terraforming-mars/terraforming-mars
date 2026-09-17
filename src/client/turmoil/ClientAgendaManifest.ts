import {BonusId, PolicyId} from '@/common/turmoil/Types';
import {IClientAgenda} from '@/common/turmoil/IClientAgenda';
// @ts-ignore agendas.json doesn't exist during npm run build
import agendaJson from '@/genfiles/agendas.json';

const agendas = agendaJson as Partial<Record<BonusId | PolicyId, IClientAgenda>>;

export function getAgenda(id: BonusId | PolicyId): IClientAgenda | undefined {
  return agendas[id];
}

export function getAgendaOrThrow(id: BonusId | PolicyId): IClientAgenda {
  const agenda = getAgenda(id);
  if (agenda === undefined) {
    throw new Error(`agenda ${id} not found`);
  }
  return agenda;
}
