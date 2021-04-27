import {AndOptions} from '../inputs/AndOptions';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction, Priority} from './DeferredAction';
import {IParty} from '../turmoil/parties/IParty';
import {Agenda} from '../turmoil/PoliticalAgendas';
import {Turmoil} from '../turmoil/Turmoil';

export class ChoosePoliticalAgenda implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
    public player: Player,
    public party: IParty,
    public turmoil: Turmoil,
  ) {}

  public execute() : PlayerInput {
    const agenda: Agenda = {
      bonusId: '',
      policyId: '',
    };
    const bonuses: Array<SelectOption> = this.party.bonuses.map((bonus) => new SelectOption(bonus.description, 'Select', () => {
      agenda.bonusId = bonus.id;
      return undefined;
    }));
    const orBonuses = new OrOptions(...bonuses);
    orBonuses.title = 'Select a ' + this.party.name + ' bonus.';

    const policies = this.party.policies.map((policy) => new SelectOption(policy.description, 'Select', () => {
      agenda.policyId = policy.id;
      return undefined;
    }));
    const orPolicies = new OrOptions(...policies);
    orPolicies.title = 'Select a ' + this.party.name + ' policy.';

    const cb = () => {
      this.turmoil.politicalAgendasData.currentAgenda = agenda;
      this.turmoil.onAgendaSelected(this.player.game);
      return undefined;
    };

    return new AndOptions(cb, orBonuses, orPolicies);
  }
}
