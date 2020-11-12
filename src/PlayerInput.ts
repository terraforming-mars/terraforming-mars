
import {PlayerInputTypes} from './PlayerInputTypes';

export interface PlayerInput {
    inputType: PlayerInputTypes;
    buttonLabel: string;
    title: string;
    cb: (...item: any) => PlayerInput | undefined;
}
