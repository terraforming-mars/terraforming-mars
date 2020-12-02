
import {DynamicTranslatableStringModel} from './models/DynamicTranslatableStringModel';
import {PlayerInputTypes} from './PlayerInputTypes';

export interface PlayerInput {
    inputType: PlayerInputTypes;
    buttonLabel: string;
    title: string | DynamicTranslatableStringModel;
    cb: (...item: any) => PlayerInput | undefined;
}
