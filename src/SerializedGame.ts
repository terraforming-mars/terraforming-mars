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
import { PlayerId } from "./Player";

export interface SerializedGame {
    id: string;
    players: Array<SerializedPlayer>;
    first: SerializedPlayer;
    preludeExtension: boolean;
    draftVariant: boolean;
    showOtherPlayersVP: boolean;
    venusNextExtension: boolean;
    coloniesExtension: boolean;
    customCorporationsList: boolean;
    corporationList: Array<CardName>;
    boardName: BoardName;
    seed?: number
    activePlayer: SerializedPlayer;
    claimedMilestones: Array<ClaimedMilestone>;
    milestones: Array<IMilestone>;
    dealer: SerializedDealer;
    fundedAwards: Array<FundedAward>;
    awards: Array<IAward>;
    generation: number;
    draftRound: number;
    phase: Phase;
    donePlayers: Set<PlayerId>;
    oxygenLevel: number;
    venusScaleLevel: number;
    passedPlayers: Set<PlayerId>;
    researchedPlayers: Set<PlayerId>;
    draftedPlayers: Set<PlayerId>;
    board: Board;
    temperature: number;
    gameLog: Array<String>;
    gameAge: number;
    unDraftedCards: Map<SerializedPlayer, Array<IProjectCard>>;
    interrupts: Array<PlayerInterrupt>;
    monsInsuranceOwner: PlayerId | undefined;
    colonies: Array<IColony>;
    colonyDealer: ColonyDealer | undefined;
    pendingOceans: number;
    lastSaveId: number;
    turmoil: SerializedTurmoil;
}

