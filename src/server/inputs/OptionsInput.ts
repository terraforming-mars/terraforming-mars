import {PlayerInputType} from '@/common/input/PlayerInputType';
import {Message} from '@/common/logs/Message';
import {BasePlayerInput, PlayerInput} from '../PlayerInput';

export abstract class OptionsInput extends BasePlayerInput {
  public options: Array<PlayerInput> = [];

  constructor(inputType: PlayerInputType, options: Array<PlayerInput>, title: string | Message = '') {
    super(inputType, title);
    this.options = options;
  }

  public toModel(): void {
  }
}
