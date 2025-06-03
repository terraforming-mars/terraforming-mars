import {Phase} from '../common/Phase';
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
import {MilestoneName} from '../common/ma/MilestoneName';
import {Tag} from '../common/cards/Tag';
import {Expansion} from '../common/cards/GameModule';

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
    draftRound: number;
    // TODO(kberg): Remove ? by 2025-08-01
    expansions?: Record<Expansion, boolean>;
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
    milestones: Array<MilestoneName>;
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
    tags: ReadonlyArray<Tag>
    temperature: number;
    tradeEmbargo?: boolean;
    turmoil?: SerializedTurmoil;
    undoCount: number;
    underworldData: UnderworldData;
    venusScaleLevel: number;
    verminInEffect: boolean;
}

