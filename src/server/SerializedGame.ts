import {Phase} from '../common/Phase';
import {CardName} from '../common/cards/CardName';
import {SerializedClaimedMilestone} from './milestones/ClaimedMilestone';
import {SerializedFundedAward} from './awards/FundedAward';
import {DeferredAction} from './deferredActions/DeferredAction';
import {SerializedColony} from './SerializedColony';
import {SerializedPlayer} from './SerializedPlayer';
import {SerializedDealer} from './SerializedDealer';
import {SerializedTurmoil} from './turmoil/SerializedTurmoil';
import {PlayerId, GameId, SpectatorId} from '../common/Types';
import {GameOptions} from './GameOptions';
import {AresData} from '../common/ares/AresData';
import {LogMessage} from '../common/logs/LogMessage';
import {SerializedBoard} from './boards/SerializedBoard';
import {SerializedMoonData} from './moon/SerializedMoonData';
import {SerializedPathfindersData} from './pathfinders/SerializedPathfindersData';
import {SerializedDeck} from './cards/SerializedDeck';

export type SerializedGame = {
    activePlayer: PlayerId;
    aresData?: AresData;
    awards: Array<string>;
    board: SerializedBoard;
    currentSeed: number;
    claimedMilestones: Array<SerializedClaimedMilestone>;
    clonedGamedId?: string;
    colonies: Array<SerializedColony>;
    corporationsDraftDirection: 'before' | 'after';
    corporationsToDraft: Array<CardName>;
    // TODO(kberg): Remove dealer, and make the 3 decks non-optional by 2022-12-01.
    // Also, move (project,corporation,prelude)Deck to their lexicographical position once `dealer is gone.
    dealer?: SerializedDealer;
    projectDeck?: SerializedDeck,
    corporationDeck?: SerializedDeck,
    preludeDeck?: SerializedDeck,
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

