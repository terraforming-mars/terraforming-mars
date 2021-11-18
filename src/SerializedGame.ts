import {Phase} from './Phase';
import {CardName} from './CardName';
import {SerializedClaimedMilestone} from './milestones/ClaimedMilestone';
import {SerializedFundedAward} from './awards/FundedAward';
import {IMilestone} from './milestones/IMilestone';
import {IAward} from './awards/IAward';
import {ColonyDealer} from './colonies/ColonyDealer';
import {DeferredAction} from './deferredActions/DeferredAction';
import {SerializedColony} from './SerializedColony';
import {SerializedPlayer} from './SerializedPlayer';
import {SerializedDealer} from './SerializedDealer';
import {SerializedTurmoil} from './turmoil/SerializedTurmoil';
import {PlayerId} from './Player';
import {GameId, GameOptions, SpectatorId} from './Game';
import {IAresData} from './ares/IAresData';
import {LogMessage} from './LogMessage';
import {SerializedBoard} from './boards/SerializedBoard';
import {SerializedMoonData} from './moon/SerializedMoonData';
import {SerializedPathfindersData} from './pathfinders/SerializedPathfindersData';

export interface SerializedGame {
    activePlayer: PlayerId;
    aresData?: IAresData;
    awards: Array<IAward> | Array<string>; // TODO(bafolts): remove Array<IAward> by 2021-12-01
    board: SerializedBoard;
    claimedMilestones: Array<SerializedClaimedMilestone>;
    clonedGamedId?: string;
    colonies: Array<SerializedColony>;
    colonyDealer: ColonyDealer | undefined;
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
    milestones: Array<IMilestone> | Array<string>; // TODO(bafolts): remove Array<IMilestone> by 2021-12-01
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

