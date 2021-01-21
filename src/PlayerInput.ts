
import {Message} from './Message';
import {PlayerInputTypes} from './PlayerInputTypes';

export interface PlayerInput {
    inputType: PlayerInputTypes;
    buttonLabel: string;
    options?: Array<PlayerInput>;
    title: string | Message;
    cb: (...item: any) => PlayerInput | undefined;
}
