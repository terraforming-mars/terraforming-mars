import {InputResponse} from '../../common/inputs/InputResponse';
import {PlayerInput} from '../PlayerInput';
import {OptionsInput} from './OptionsPlayerInput';

/**
 * Whether `response` has the shape `input` accepts.
 *
 * Only the structure is compared: the types agree at every level, an `or`
 * response picks an existing option and an `and` response answers every
 * option. Values such as card names or payments are left to `process`.
 * A mismatch means the response was built for a different prompt, typically
 * by a page that never received the outcome of its previous submission.
 */
export function responseMatchesInput(input: PlayerInput, response: InputResponse): boolean {
  if (typeof response !== 'object' || response === null || response.type !== input.type) {
    return false;
  }
  if (!(input instanceof OptionsInput)) {
    return true;
  }
  switch (response.type) {
  case 'or': {
    const option = Number.isInteger(response.index) ? input.options[response.index] : undefined;
    return option !== undefined && responseMatchesInput(option, response.response);
  }
  case 'and':
  case 'initialCards':
    return Array.isArray(response.responses) &&
      response.responses.length === input.options.length &&
      response.responses.every((r, idx) => responseMatchesInput(input.options[idx], r));
  default:
    return true;
  }
}
