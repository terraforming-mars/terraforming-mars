
import {Color} from '../common/Color';
import {PlayerId, GameId, SpectatorId} from '../common/Types';
import {Phase} from '../common/Phase';
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
