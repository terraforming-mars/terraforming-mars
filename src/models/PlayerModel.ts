import {CardModel} from './CardModel';
import {Color} from '../Color';
import {VictoryPointsBreakdown} from '../VictoryPointsBreakdown';
import {ITagCount} from '../ITagCount';
import {PlayerInputModel} from './PlayerInputModel';
import {SerializedTimer} from '../SerializedTimer';
import {GameModel} from './GameModel';
import {PlayerId} from '../Player';

export interface BasePlayerModel {
  name: string;
  color: Color;
}

/** The public information about a player */
export interface PublicPlayerModel extends BasePlayerModel {
  actionsTakenThisRound: number;
  actionsThisGeneration: Array<string /* CardName */>;
  availableBlueCardActionCount: number;
  cardCost: number;
  cardsInHandNbr: number;
  citiesCount: number;
  coloniesCount: number;
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

/** A player's view of the game, including their secret information. */
export interface PlayerViewModel {
  cardsInHand: Array<CardModel>;
  dealtCorporationCards: Array<CardModel>;
  dealtPreludeCards: Array<CardModel>;
  dealtProjectCards: Array<CardModel>;
  draftedCards: Array<CardModel>;
  game: GameModel;
  id: PlayerId;
  pickedCorporationCard: Array<CardModel>; // Why Array?
  players: Array<PublicPlayerModel>;
  thisPlayerIndex: number;
  thisPlayer: PublicPlayerModel;
  waitingFor: PlayerInputModel | undefined;
}
