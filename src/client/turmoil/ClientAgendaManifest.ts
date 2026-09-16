import {BonusId, PolicyId} from '@/common/turmoil/Types';
import {IClientAgenda} from '@/common/turmoil/IClientAgenda';
// @ts-ignore agendas.json doesn't exist during npm run build
import agendaJson from '@/genfiles/agendas.json';

const agendas: Map<BonusId | PolicyId, IClientAgenda> = new Map();
(agendaJson as any as Array<IClientAgenda>).forEach((agenda) => {
  agendas.set(agenda.id, agenda);
});

export function getAgendaDescription(id: BonusId | PolicyId): string {
  return agendas.get(id)?.description ?? `Unknown agenda ${id}`;
}
