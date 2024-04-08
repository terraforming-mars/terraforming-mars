import {Phase} from '../common/Phase';
import {CardName} from '../common/cards/CardName';
import {SerializedClaimedMilestone} from './milestones/ClaimedMilestone';
import {SerializedFundedAward} from './awards/FundedAward';
import {DeferredAction} from './deferredActions/DeferredAction';
import {SerializedColony} from './SerializedColony';
import {SerializedPlayer} from './SerializedPlayer';
import {SerializedTurmoil} from './turmoil/SerializedTurmoil';
import {PlayerId, GameId, SpectatorId, SpaceId} from '../common/Types';
import {GameOptions} from './game/GameOptions';
import {AresData} from '../common/ares/AresData';
import {LogMessage} from '../common/logs/LogMessage';
import {SerializedBoard} from './boards/SerializedBoard';
import {SerializedMoonData} from './moon/SerializedMoonData';
import {SerializedPathfindersData} from './pathfinders/SerializedPathfindersData';
import {SerializedDeck} from './cards/SerializedDeck';
import {UnderworldData} from './underworld/UnderworldData';
import {AwardName} from '../common/ma/AwardName';
import {GlobalParameter} from '../common/GlobalParameter';

export type SerializedGame = {
    activePlayer: PlayerId;
    aresData?: AresData;
    awards: Array<AwardName>;
    beholdTheEmperor?: boolean;
    board: SerializedBoard;
    ceoDeck: SerializedDeck;
    currentSeed: number;
    claimedMilestones: Array<SerializedClaimedMilestone>;
    clonedGamedId?: string;
    colonies: Array<SerializedColony>;
    corporationDeck: SerializedDeck,
    createdTimeMs: number;
    deferredActions: Array<DeferredAction>;
    donePlayers: Array<PlayerId>;
    draftedPlayers: Array<PlayerId>;
    draftRound: number;
    first: PlayerId;
    fundedAwards: Array<SerializedFundedAward>;
    gagarinBase: Array<SpaceId>;
    gameAge: number;
    gameLog: Array<LogMessage>;
    gameOptions: GameOptions;
    generation: number;
    globalsPerGeneration: Array<Partial<Record<GlobalParameter, number>>>;
    id: GameId;
    initialDraftIteration: number;
    lastSaveId: number;
    milestones: Array<string>;
    moonData: SerializedMoonData | undefined;
    nomadSpace: SpaceId | undefined;
    pathfindersData: SerializedPathfindersData | undefined;
    oxygenLevel: number;
    passedPlayers: Array<PlayerId>;
    phase: Phase;
    players: Array<SerializedPlayer>;
    preludeDeck: SerializedDeck,
    projectDeck: SerializedDeck,
    researchedPlayers: Array<PlayerId>;
    seed: number;
    someoneHasRemovedOtherPlayersPlants: boolean;
    spectatorId: SpectatorId | undefined;
    stJosephCathedrals: Array<SpaceId>;
    syndicatePirateRaider: PlayerId | undefined;
    temperature: number;
    tradeEmbargo?: boolean;
    turmoil?: SerializedTurmoil;
    undoCount: number;
    underworldData?: UnderworldData;
    unDraftedCards: Array<[PlayerId, Array<CardName>]>;
    venusScaleLevel: number;
}

