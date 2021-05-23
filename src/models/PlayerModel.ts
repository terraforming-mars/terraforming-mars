import {CardModel} from './CardModel';
import {Color} from '../Color';
import {VictoryPointsBreakdown} from '../VictoryPointsBreakdown';
import {ITagCount} from '../ITagCount';
import {PlayerInputModel} from './PlayerInputModel';
import {SerializedTimer} from '../SerializedTimer';
import {GameModel} from './GameModel';

export interface PublicPlayerModel {
  actionsTakenThisRound: number;
  actionsThisGeneration: Array<string /* CardName */>;
  availableBlueCardActionCount: number;
  cardCost: number;
  cardsInHandNbr: number;
  citiesCount: number;
  coloniesCount: number;
  color: Color;
  corporationCard: CardModel | undefined;
  energy: number;
  energyProduction: number;
  fleetSize: number;
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
  plants: number;
  plantProduction: number;
  plantsAreProtected: boolean;
  playedCards: Array<CardModel>;
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
}

export interface PlayerModel extends PublicPlayerModel {
  availableBlueCardActionCount: number;
  cardCost: number;
  cardsInHand: Array<CardModel>;
  corporationCard: CardModel | undefined;
  dealtCorporationCards: Array<CardModel>;
  dealtPreludeCards: Array<CardModel>;
  dealtProjectCards: Array<CardModel>;
  draftedCards: Array<CardModel>;
  game: GameModel;
  influence: number;
  pickedCorporationCard: Array<CardModel>; // Why Array?
  players: Array<PublicPlayerModel>;
  preludeCardsInHand: Array<CardModel>;
  timer: SerializedTimer;
  waitingFor: PlayerInputModel | undefined;
}
