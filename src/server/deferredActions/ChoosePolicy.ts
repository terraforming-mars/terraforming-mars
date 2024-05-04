import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {PolicyId} from '../../common/turmoil/Types';
import {Policy, policyDescription} from '../turmoil/Policy';
import {message} from '../logs/MessageBuilder';

export class ChoosePolicy extends DeferredAction {
  constructor(
    player: IPlayer,
    public policies: Array<Policy>,
    public policyCb: (policyId: PolicyId) => void,
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute(): PlayerInput {
    const policyOptions = this.policies.map((policy) => {
      return new SelectOption(policyDescription(policy, this.player),
        'Select')
        .andThen(() => {
          this.policyCb(policy.id);
          return undefined;
        });
    });
    const orPolicies = new OrOptions(...policyOptions);
    orPolicies.title = message('Select a policy');

    return orPolicies;
  }
}
