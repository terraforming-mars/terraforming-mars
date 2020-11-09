
import {Color} from '../Color';
import {Phase} from '../Phase';

export interface GameHomeModel {
    activePlayer: Color;
    id: string;
    phase: Phase;
    players: Array<GameHomePlayerModel>;
}

interface GameHomePlayerModel {
    color: Color;
    id: string;
    name: string;
}
