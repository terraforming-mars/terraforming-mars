import {AndOptions} from '../inputs/AndOptions';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {Game} from '../Game';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction} from './DeferredAction';
import {IParty} from '../turmoil/parties/IParty';
import {Agenda} from '../turmoil/PoliticalAgendas';
import {Turmoil} from '../turmoil/Turmoil';

export class ChoosePoliticalAgenda implements DeferredAction {
  constructor(
    public player: Player,
    public party: IParty,
    public game: Game,
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

    const policies = this.party.policies.map((policy) => new SelectOption(policy.description, 'Select', () => {
      agenda.policyId = policy.id;
      return undefined;
    }));
    const orPolicies = new OrOptions(...policies);

    const cb = () => {
      this.turmoil.politicalAgendasData.currentAgenda = agenda;
      this.turmoil.onAgendaSelected(this.game);
      return undefined;
    };

    return new AndOptions(cb, orBonuses, orPolicies);
  }
}
