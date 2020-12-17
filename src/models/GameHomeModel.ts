
import {Color} from '../Color';
import {GameId} from '../Game';
import {Phase} from '../Phase';
import {PlayerId} from '../Player';

export interface GameHomeModel {
    activePlayer: Color;
    id: GameId;
    phase: Phase;
    players: Array<GameHomePlayerModel>;
}

interface GameHomePlayerModel {
    color: Color;
    id: PlayerId;
    name: string;
}
