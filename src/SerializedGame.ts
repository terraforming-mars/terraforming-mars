import {Player} from "./Player";
import {IProjectCard} from "./cards/IProjectCard";
import {Phase} from "./Phase";
import {ClaimedMilestone} from "./ClaimedMilestone";
import {FundedAward} from "./FundedAward";
import {IMilestone} from "./milestones/IMilestone";
import {IAward} from "./awards/IAward";
import {IColony} from "./colonies/Colony";
import {ColonyDealer} from "./colonies/ColonyDealer";
import {PlayerInterrupt} from "./interrupts/PlayerInterrupt";
import {Board} from "./Board";
import { CardName } from "./CardName";
import { BoardName } from "./BoardName";
import { SerializedPlayer } from "./SerializedPlayer";
import { SerializedDealer } from "./SerializedDealer";
import { SerializedTurmoil } from "./turmoil/SerializedTurmoil";

export interface SerializedGame {
    id: string;
    players: Array<SerializedPlayer>;
    first: Player;
    preludeExtension: boolean;
    draftVariant: boolean;
    showOtherPlayersVP: boolean;
    venusNextExtension: boolean;
    coloniesExtension: boolean;
    customCorporationsList: boolean;
    corporationList: Array<CardName>;
    boardName: BoardName;
    seed?: number
    activePlayer: Player;
    claimedMilestones: Array<ClaimedMilestone>;
    milestones: Array<IMilestone>;
    dealer: SerializedDealer;
    fundedAwards: Array<FundedAward>;
    awards: Array<IAward>;
    generation: number;
    draftRound: number;
    phase: Phase;
    donePlayers: Set<Player>;
    oxygenLevel: number;
    venusScaleLevel: number;
    passedPlayers: Set<Player>;
    researchedPlayers: Set<Player>;
    draftedPlayers: Set<Player>;
    board: Board;
    temperature: number;
    gameLog: Array<String>;
    gameAge: number;
    unDraftedCards: Map<Player, Array<IProjectCard>>;
    interrupts: Array<PlayerInterrupt>;
    monsInsuranceOwner: Player | undefined;
    colonies: Array<IColony>;
    colonyDealer: ColonyDealer | undefined;
    pendingOceans: number;
    lastSaveId: number;
    turmoil: SerializedTurmoil;
}

