import {CardModel} from './CardModel';
import {ColonyModel} from './ColonyModel';
import {Color} from '../Color';
import {VictoryPointsBreakdown} from '../VictoryPointsBreakdown';
import {ITagCount} from '../ITagCount';
import {TurmoilModel} from './TurmoilModel';
import {ClaimedMilestoneModel} from './ClaimedMilestoneModel';
import {FundedAwardModel} from './FundedAwardModel';
import {Phase} from '../Phase';
import {PlayerInputModel} from './PlayerInputModel';
import {RandomMAOptionType} from '../RandomMAOptionType';
import {SpaceModel} from './SpaceModel';
import {IAresData} from '../ares/IAresData';
import {AgendaStyle} from '../turmoil/PoliticalAgendas';
import {SerializedTimer} from '../SerializedTimer';

export interface PlayerModel {
    aresExtension: boolean;
    aresData: IAresData | undefined;
    politicalAgendasExtension: AgendaStyle;
    awards: Array<FundedAwardModel>;
    boardName: string;
    corporationCard: CardModel | undefined;
    playedCards: Array<CardModel>;
    cardCost: number;
    cardsInHand: Array<CardModel>;
    cardsInHandNbr: number;
    citiesCount: number;
    coloniesCount: number;
    corporateEra: boolean;
    draftedCards: Array<CardModel>;
    noTagsCount: number;
    influence: number;
    colonies: Array<ColonyModel>;
    coloniesExtension: boolean;
    color: Color;
    energy: number;
    energyProduction: number;
    gameAge: number;
    generation: number;
    heat: number;
    heatProduction: number;
    id: string;
    isActive: boolean;
    isSoloModeWin: boolean;
    megaCredits: number;
    megaCreditProduction: number;
    milestones: Array<ClaimedMilestoneModel>;
    name: string;
    oceans: number;
    oxygenLevel: number;
    phase: Phase;
    plants: number;
    plantProduction: number;
    plantsAreProtected: boolean;
    players: Array<PlayerModel>;
    randomMA: RandomMAOptionType;
    spaces: Array<SpaceModel>;
    steel: number;
    steelProduction: number;
    steelValue: number;
    temperature: number;
    terraformRating: number;
    titanium: number;
    titaniumProduction: number;
    titaniumValue: number;
    turmoil: TurmoilModel | undefined;
    turmoilExtension: boolean;
    venusNextExtension: boolean;
    venusScaleLevel: number;
    victoryPointsBreakdown: VictoryPointsBreakdown;
    tags: Array<ITagCount>;
    showOtherPlayersVP: boolean;
    showTimers: boolean;
    actionsThisGeneration: Array<string>;
    fleetSize: number;
    tradesThisTurn: number;
    selfReplicatingRobotsCards: Array<CardModel>;
    dealtCorporationCards: Array<CardModel>;
    dealtPreludeCards: Array<CardModel>;
    dealtProjectCards: Array<CardModel>;
    initialDraft: boolean;
    needsToDraft: boolean | undefined;
    passedPlayers: Array<Color>;
    actionsTakenThisRound: number;
    deckSize: number;
    preludeExtension: boolean;
    waitingFor: PlayerInputModel | undefined;
    timer: SerializedTimer;
}
