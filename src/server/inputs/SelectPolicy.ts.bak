import {Message} from '../../common/logs/Message';
import {BasePlayerInput} from '../PlayerInput';
import {InputResponse, isSelectPolicyResponse} from '../../common/inputs/InputResponse';
import {SelectPolicyModel} from '../../common/models/PlayerInputModel';
import {policiesToModel} from '../models/ModelUtils';
import {InputError} from './InputError';
import {Policy} from '../turmoil/Policy';

export class SelectPolicy extends BasePlayerInput<Policy> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    public policies: Array<Policy>,
  ) {
    super('policy', title);
    this.buttonLabel = buttonLabel;
  }

  public override toModel(): SelectPolicyModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'policy',
      policies: policiesToModel(this.policies),
    };
  }

  public process(input: InputResponse) {
    if (!isSelectPolicyResponse(input)) {
      throw new InputError('Not a valid SelectPolicyResponse');
    }
    if (input.policyId === undefined) {
      throw new InputError('No policy selected');
    }
    const policy = this.policies.find((c) => c.id === input.policyId);
    if (policy === undefined) {
      throw new InputError(`policy ${input.policyId} not found`);
    }
    return this.cb(policy);
  }
}
