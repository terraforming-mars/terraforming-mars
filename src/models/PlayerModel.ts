import {CardModel} from './CardModel';
import {Color} from '../Color';
import {VictoryPointsBreakdown} from '../VictoryPointsBreakdown';
import {ITagCount} from '../ITagCount';
import {PlayerInputModel} from './PlayerInputModel';
import {SerializedTimer} from '../SerializedTimer';
import {GameModel} from './GameModel';

export interface PlayerModel {
  actionsTakenThisRound: number;
  actionsThisGeneration: Array<string>;
  availableBlueCardActionCount: number;
  cardCost: number;
  cardsInHand: Array<CardModel>;
  cardsInHandNbr: number;
  citiesCount: number;
  coloniesCount: number;
  color: Color;
  corporationCard: CardModel | undefined;
  dealtCorporationCards: Array<CardModel>;
  dealtPreludeCards: Array<CardModel>;
  dealtProjectCards: Array<CardModel>;
  draftedCards: Array<CardModel>;
  energy: number;
  energyProduction: number;
  fleetSize: number;
  game: GameModel;
  heat: number;
  heatProduction: number;
  id: string; // PlayerId
  influence: number;
  isActive: boolean;
  megaCredits: number;
  megaCreditProduction: number;
  name: string;
  needsToDraft: boolean | undefined;
  needsToResearch: boolean | undefined;
  noTagsCount: number;
  pickedCorporationCard: Array<CardModel>; // Array?
  plants: number;
  plantProduction: number;
  plantsAreProtected: boolean;
  playedCards: Array<CardModel>;
  players: Array<PlayerModel>;
  preludeCardsInHand: Array<CardModel>;
  selfReplicatingRobotsCards: Array<CardModel>;
  steel: number;
  steelProduction: number;
  steelValue: number;
  tags: Array<ITagCount>;
  terraformRating: number;
  timer: SerializedTimer;
  titanium: number;
  titaniumProduction: number;
  titaniumValue: number;
  tradesThisGeneration: number;
  victoryPointsBreakdown: VictoryPointsBreakdown;
  waitingFor: PlayerInputModel | undefined;
}
