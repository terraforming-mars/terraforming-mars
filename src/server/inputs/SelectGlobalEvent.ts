import {BasePlayerInput} from '../PlayerInput';
import {InputResponse, isSelectGlobalEventResponse} from '../../common/inputs/InputResponse';
import {SelectGlobalEventModel} from '../../common/models/PlayerInputModel';
import {IGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';
import {InputError} from './InputError';
import {toName} from '../../common/utils/utils';

export class SelectGlobalEvent extends BasePlayerInput<IGlobalEvent> {
  constructor(public globalEvents: ReadonlyArray<IGlobalEvent>) {
    super('card', 'Select Global Event');
  }

  public toModel(): SelectGlobalEventModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'globalEvent',
      globalEventNames: this.globalEvents.map(toName),
    };
  }

  public process(input: InputResponse) {
    if (!isSelectGlobalEventResponse(input)) {
      throw new InputError('Not a valid SelectGlobalEventResponse');
    }
    const globalEvent = this.globalEvents.find((e) => e.name === input.globalEventName);
    if (globalEvent === undefined) {
      throw new InputError(`Invalid Global Event ${input.globalEventName}`);
    }
    return this.cb(globalEvent);
  }
}
