
import {Color} from '../Color';
import {GameId, GameOptions} from '../Game';
import {Phase} from '../Phase';
import {PlayerId} from '../Player';

export interface GameHomeModel {
    activePlayer: Color;
    id: GameId;
    phase: Phase;
    players: Array<GameHomePlayerModel>;
    gameOptions: GameOptions;
}

interface GameHomePlayerModel {
    color: Color;
    id: PlayerId;
    name: string;
}
