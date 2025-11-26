import {Phase} from '@/common/Phase';
import {SerializedClaimedMilestone} from '@/server/milestones/ClaimedMilestone';
import {SerializedFundedAward} from '@/server/awards/FundedAward';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {SerializedColony} from '@/server/SerializedColony';
import {SerializedPlayer} from '@/server/SerializedPlayer';
import {SerializedTurmoil} from '@/server/turmoil/SerializedTurmoil';
import {PlayerId, GameId, SpectatorId, SpaceId} from '@/common/Types';
import {GameOptions} from '@/server/game/GameOptions';
import {AresData} from '@/common/ares/AresData';
import {LogMessage} from '@/common/logs/LogMessage';
import {SerializedBoard} from '@/server/boards/SerializedBoard';
import {SerializedMoonData} from '@/server/moon/SerializedMoonData';
import {SerializedPathfindersData} from '@/server/pathfinders/SerializedPathfindersData';
import {SerializedDeck} from '@/server/cards/SerializedDeck';
import {UnderworldData} from '@/server/underworld/UnderworldData';
import {AwardName} from '@/common/ma/AwardName';
import {GlobalParameter} from '@/common/GlobalParameter';
import {MilestoneName} from '@/common/ma/MilestoneName';
import {Tag} from '@/common/cards/Tag';

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
    exploitationOfVenusInEffect: boolean;
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
