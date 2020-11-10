import {IProjectCard} from './cards/IProjectCard';
import {Phase} from './Phase';
import {ClaimedMilestone} from './ClaimedMilestone';
import {FundedAward} from './FundedAward';
import {IMilestone} from './milestones/IMilestone';
import {IAward} from './awards/IAward';
import {ColonyDealer} from './colonies/ColonyDealer';
import {DeferredAction} from './deferredActions/DeferredAction';
import {Board} from './Board';
import {CardName} from './CardName';
import {BoardName} from './BoardName';
import {SerializedColony} from './SerializedColony';
import {SerializedPlayer} from './SerializedPlayer';
import {SerializedDealer} from './SerializedDealer';
import {SerializedTurmoil} from './turmoil/SerializedTurmoil';
import {PlayerId} from './Player';
import {GameOptions} from './Game';
import {IAresData} from './ares/IAresData';

export interface SerializedGame {
    id: string;

    lastSaveId: number;
    seed: number
    deferredActions: Array<DeferredAction>;
    gameLog: Array<String>;
    gameAge: number;

    generation: number;
    phase: Phase;
    dealer: SerializedDealer;
    boardName: BoardName;
    board: Board;
    gameOptions: GameOptions;

    oxygenLevel: number;
    temperature: number;
    venusScaleLevel: number;

    first: SerializedPlayer;
    activePlayer: PlayerId;
    players: Array<SerializedPlayer>;
    donePlayers: Set<PlayerId>;
    passedPlayers: Set<PlayerId>;
    researchedPlayers: Set<PlayerId>;
    draftedPlayers: Set<PlayerId>;

    draftVariant: boolean;
    draftRound: number;
    unDraftedCards: Map<SerializedPlayer, Array<IProjectCard>>;

    claimedMilestones: Array<ClaimedMilestone>;
    milestones: Array<IMilestone>;
    fundedAwards: Array<FundedAward>;
    awards: Array<IAward>;

    venusNextExtension: boolean;
    coloniesExtension: boolean;
    colonies: Array<SerializedColony>;
    colonyDealer: ColonyDealer | undefined;
    preludeExtension: boolean;
    turmoil: SerializedTurmoil;
    aresData: IAresData;

    monsInsuranceOwner: PlayerId | undefined;
    someoneHasRemovedOtherPlayersPlants: boolean;

    showOtherPlayersVP: boolean;
    customCorporationsList: boolean;
    corporationList: Array<CardName>;
}

