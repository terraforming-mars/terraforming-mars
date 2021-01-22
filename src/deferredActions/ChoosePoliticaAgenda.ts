import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction} from './DeferredAction';
import {IParty} from '../turmoil/parties/IParty';
import {Agenda} from '../turmoil/PoliticalAgendas';
import {Turmoil} from '../turmoil/Turmoil';
import {PartyName} from '../turmoil/parties/PartyName';

export class ChoosePoliticalAgenda implements DeferredAction {
  constructor(
    public player: Player,
    public party: IParty,
    public turmoil: Turmoil,
  ) {}

  public execute() : PlayerInput {
    const staticAgendas = this.turmoil.politicalAgendasData.staticAgendas as Map<PartyName, Agenda>;
    const partyAgenda = staticAgendas.get(this.party.name) as Agenda;

    const agenda: Agenda = {
      bonusId: partyAgenda.bonusId,
      policyId: partyAgenda.policyId,
    };

    const bonuses: Array<SelectOption> = this.party.bonuses.map((bonus) => new SelectOption(bonus.description, 'Select', () => {
      agenda.bonusId = bonus.id;
      this.turmoil.politicalAgendasData.currentAgenda = agenda;
      staticAgendas.set(this.party.name, {bonusId: bonus.id, policyId: partyAgenda.policyId});
      this.turmoil.onAgendaSelected(this.player.game);
      return undefined;
    }));
    const orBonuses = new OrOptions(...bonuses);
    orBonuses.title = 'Change ' + this.party.name + ' ruling bonus';

    const policies = this.party.policies.map((policy) => new SelectOption(policy.description, 'Select', () => {
      agenda.policyId = policy.id;
      this.turmoil.politicalAgendasData.currentAgenda = agenda;
      staticAgendas.set(this.party.name, {bonusId: partyAgenda.bonusId, policyId: policy.id});
      this.turmoil.onAgendaSelected(this.player.game);
      return undefined;
    }));
    const orPolicies = new OrOptions(...policies);
    orPolicies.title = 'Change ' + this.party.name + ' ruling policy';

    return new OrOptions(orBonuses, orPolicies);
  }
}
