import {PlayerInput} from '../PlayerInput';
import {InputResponse, isOrOptionsResponse, OrOptionsResponse} from '../../common/inputs/InputResponse';
import {IPlayer} from '../IPlayer';
import {OrOptionsModel} from '../../common/models/PlayerInputModel';
import {OptionsInput} from './OptionsPlayerInput';
import {InputError} from './InputError';
import { SelectCard } from './SelectCard';
import { Random } from '@/common/utils/Random';

export class OrOptions extends OptionsInput<undefined> {
  constructor(...options: Array<PlayerInput>) {
    super('or', 'Select one option', options);
  }

  public toModel(player: IPlayer): OrOptionsModel {
    const initialIdx = this.options.findIndex((option) => option.eligibleForDefault !== false);
    const model: OrOptionsModel = {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'or',
      options: this.options.map((option) => option.toModel(player)),
    };
    if (initialIdx > -1) {
      model.initialIdx = initialIdx;
    }
    return model;
  }

  public process(input: InputResponse, player: IPlayer) {
    if (!isOrOptionsResponse(input)) {
      throw new InputError('Not a valid OrOptionsResponse');
    }
    if (this.options.length <= input.index) {
      throw new InputError('Invalid index');
    }
    player.defer(this.options[input.index].process(input.response, player));
    return this.cb(undefined);
  }

  private getActionable(p: IPlayer) {
    const output: { i: number, opt: PlayerInput}[] = [];
    this.options.forEach((opt, i: number) => {
      if (opt instanceof SelectCard && opt.type === 'card' && opt.title === 'Standard projects' && opt.toModel(p).cards.every(c => c.isDisabled)) {
        // Standard projects are always present in the list, but marked disabled in config if can't be performed
        // If we detect there are no playable cards, remove the option from the list
        return;
      }
      // keep the original index
      output.push({ i, opt });
    });
    return output;
  }

  public getActionSpace(p: IPlayer, rand: Random) {
    // Return a flat list of all the options available
    // If one of the options has nested values, e.g. play a card, we should flatten all of those as items
    const output: { label: string, input: OrOptionsResponse }[] = [];
    this.getActionable(p).forEach(({i, opt}) => {
      // opt could be another oroptions, or a terminal type
      // if terminal, we want to do getActionSpace and add results to list
      // if another oroptions, we want to recursively call and add the nested type/index
        output.push(...opt.getActionSpace(p, rand).map(({label, input}) => {
          return { label, input: { type: 'or', index: i, response: input }};
        }));
    });
    return output;
  }

  public reduce(): PlayerInput | undefined {
    if (this.options.length === 0) {
      return undefined;
    }
    if (this.options.length === 1) {
      return this.options[0].cb();
    }
    return this;
  }
}
