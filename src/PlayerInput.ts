import {Message} from './Message';
import {Player} from './Player';
import {PlayerInputTypes} from './PlayerInputTypes';

export interface PlayerInput {
    inputType: PlayerInputTypes;
    buttonLabel: string;
    options?: Array<PlayerInput>;
    title: string | Message;
    cb: (...item: any) => PlayerInput | undefined;
    runInput: (player: Player, input: ReadonlyArray<ReadonlyArray<string>>) => void;
}

export namespace PlayerInput {
  export function checkInputLength(input: ReadonlyArray<ReadonlyArray<string>>, length: number, firstOptionLength?: number) {
    if (input.length !== length) {
      throw new Error('Incorrect options provided');
    }
    if (firstOptionLength !== undefined && input[0].length !== firstOptionLength) {
      throw new Error('Incorrect options provided (nested)');
    }
  }
}
