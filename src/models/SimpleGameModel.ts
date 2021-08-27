
import {Color} from '../Color';
import {GameId, SpectatorId} from '../Game';
import {Phase} from '../Phase';
import {PlayerId} from '../Player';
import {GameOptionsModel} from './GameOptionsModel';

export interface SimpleGameModel {
    activePlayer: Color;
    id: GameId;
    phase: Phase;
    players: Array<SimplePlayerModel>;
    spectatorId: SpectatorId | undefined;
    gameOptions: GameOptionsModel;
    lastSoloGeneration: number;
}

interface SimplePlayerModel {
    color: Color;
    id: PlayerId;
    name: string;
}
