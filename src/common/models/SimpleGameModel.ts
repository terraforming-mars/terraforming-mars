
import {Color} from '../Color';
import {PlayerId, GameId, SpectatorId} from '../Types';
import {Phase} from '../Phase';
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
