import {BasePlayerInput} from '../PlayerInput';
import {InputResponse, isSelectGlobalEventResponse} from '../../common/inputs/InputResponse';
import {SelectGlobalEventModel} from '../../common/models/PlayerInputModel';
import {IGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';

export class SelectGlobalEvent extends BasePlayerInput<IGlobalEvent> {
  constructor(public globalEvents: ReadonlyArray<IGlobalEvent>) {
    super('card', 'Select Global Event');
  }

  public toModel(): SelectGlobalEventModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'globalEvent',
      globalEventNames: this.globalEvents.map((globalEvent) => globalEvent.name),
    };
  }

  public process(input: InputResponse) {
    if (!isSelectGlobalEventResponse(input)) {
      throw new Error('Not a valid SelectGlobalEventResponse');
    }
    const globalEvent = this.globalEvents.find((e) => e.name === input.globalEventName);
    if (globalEvent === undefined) {
      throw new Error(`Invalid Global Event ${input.globalEventName}`);
    }
    return this.cb(globalEvent);
  }
}
