import {AndOptions} from '../inputs/AndOptions';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {Game} from '../Game';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction} from './DeferredAction';
import {IParty} from '../turmoil/parties/IParty';

export class ChoosePoliticalAgenda implements DeferredAction {
  constructor(
    public player: Player,
    public party: IParty,
    public game: Game,
  ) {}

  public execute() : PlayerInput {
    const bonuses: Array<SelectOption> = this.party.bonuses.map((bonus) => new SelectOption(bonus.description, 'Select', () => {
      return undefined;
    }));
    const orBonuses = new OrOptions(...bonuses);

    const policies = this.party.policies.map((policy) => new SelectOption(policy.description, 'Select', () => {
      return undefined;
    }));
    const orPolicies = new OrOptions(...policies);

    const cb = () => {
      return undefined;
    };

    return new AndOptions(cb, orBonuses, orPolicies);
  }
}
