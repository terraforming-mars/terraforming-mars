import {Phase} from './Phase';
import {CardName} from './CardName';
import {ClaimedMilestone} from './ClaimedMilestone';
import {FundedAward} from './FundedAward';
import {IMilestone} from './milestones/IMilestone';
import {IAward} from './awards/IAward';
import {ColonyDealer} from './colonies/ColonyDealer';
import {DeferredAction} from './deferredActions/DeferredAction';
import {Board} from './boards/Board';
import {SerializedColony} from './SerializedColony';
import {SerializedPlayer} from './SerializedPlayer';
import {SerializedDealer} from './SerializedDealer';
import {SerializedTurmoil} from './turmoil/SerializedTurmoil';
import {PlayerId} from './Player';
import {GameId, GameOptions} from './Game';
import {IAresData} from './ares/IAresData';
import {LogMessage} from './LogMessage';

export interface SerializedGame {
    activePlayer: PlayerId;
    aresData?: IAresData;
    awards: Array<IAward>;
    board: Board;
    claimedMilestones: Array<ClaimedMilestone>;
    clonedGamedId?: string;
    colonies: Array<SerializedColony>;
    colonyDealer: ColonyDealer | undefined;
    dealer: SerializedDealer;
    deferredActions: Array<DeferredAction>;
    donePlayers: Array<PlayerId>;
    draftedPlayers: Array<PlayerId>;
    draftRound: number;
    first: SerializedPlayer | PlayerId;
    fundedAwards: Array<FundedAward>;
    gameAge: number;
    gameLog: Array<LogMessage>;
    gameOptions: GameOptions;
    generation: number;
    id: GameId;
    initialDraftIteration: number;
    lastSaveId: number;
    milestones: Array<IMilestone>;
    monsInsuranceOwner: PlayerId | undefined;
    oxygenLevel: number;
    passedPlayers: Array<PlayerId>;
    phase: Phase;
    players: Array<SerializedPlayer>;
    researchedPlayers: Array<PlayerId>;
    seed: number
    someoneHasRemovedOtherPlayersPlants: boolean;
    temperature: number;
    turmoil?: SerializedTurmoil;
    unDraftedCards: Array<[PlayerId, Array<CardName>]>;
    venusScaleLevel: number;
}

