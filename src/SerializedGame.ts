import {Phase} from './common/Phase';
import {CardName} from './common/cards/CardName';
import {SerializedClaimedMilestone} from './milestones/ClaimedMilestone';
import {SerializedFundedAward} from './awards/FundedAward';
import {DeferredAction} from './deferredActions/DeferredAction';
import {SerializedColony} from './SerializedColony';
import {SerializedPlayer} from './SerializedPlayer';
import {SerializedDealer} from './SerializedDealer';
import {SerializedTurmoil} from './turmoil/SerializedTurmoil';
import {PlayerId, GameId, SpectatorId} from './common/Types';
import {GameOptions} from './Game';
import {IAresData} from './common/ares/IAresData';
import {LogMessage} from './common/logs/LogMessage';
import {SerializedBoard} from './boards/SerializedBoard';
import {SerializedMoonData} from './moon/SerializedMoonData';
import {SerializedPathfindersData} from './pathfinders/SerializedPathfindersData';

export interface SerializedGame {
    activePlayer: PlayerId;
    aresData?: IAresData;
    awards: Array<string>;
    board: SerializedBoard;
    // game.rng changes over the course of a game but isn't saved and serialized
    // for instance, in the face of a redeal.
    currentSeed: number | undefined; // TODO(kberg): Remove '|undefined' by 2022-06-01
    claimedMilestones: Array<SerializedClaimedMilestone>;
    clonedGamedId?: string;
    colonies: Array<SerializedColony>;
    dealer: SerializedDealer;
    deferredActions: Array<DeferredAction>;
    donePlayers: Array<PlayerId>;
    draftedPlayers: Array<PlayerId>;
    draftRound: number;
    first: SerializedPlayer | PlayerId;
    fundedAwards: Array<SerializedFundedAward>;
    gameAge: number;
    gameLog: Array<LogMessage>;
    gameOptions: GameOptions;
    generation: number;
    id: GameId;
    initialDraftIteration: number;
    lastSaveId: number;
    milestones: Array<string>;
    monsInsuranceOwner: PlayerId | undefined;
    moonData: SerializedMoonData | undefined;
    pathfindersData: SerializedPathfindersData | undefined;
    oxygenLevel: number;
    passedPlayers: Array<PlayerId>;
    phase: Phase;
    players: Array<SerializedPlayer>;
    researchedPlayers: Array<PlayerId>;
    seed: number;
    someoneHasRemovedOtherPlayersPlants: boolean;
    spectatorId: SpectatorId | undefined;
    syndicatePirateRaider: PlayerId | undefined;
    temperature: number;
    turmoil?: SerializedTurmoil;
    undoCount: number;
    unDraftedCards: Array<[PlayerId, Array<CardName>]>;
    venusScaleLevel: number;
}

