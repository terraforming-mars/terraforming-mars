import {CardModel} from './CardModel';
import {Color} from '../Color';
import {IVictoryPointsBreakdown} from '../game/IVictoryPointsBreakdown';
import {TagCount} from '../cards/TagCount';
import {PlayerInputModel} from './PlayerInputModel';
import {TimerModel} from './TimerModel';
import {GameModel} from './GameModel';
import {PlayerId, ParticipantId} from '../Types';
import {CardName} from '../cards/CardName';
import {Resource} from '../Resource';

export interface ViewModel {
  game: GameModel;
  players: Array<PublicPlayerModel>;
  id?: ParticipantId;
  thisPlayer: PublicPlayerModel | undefined;
  runId: string;
}

// 'off': Resources (or production) are unprotected.
// 'on': Resources (or production) are protected.
// 'half': Half resources are protected when targeted. Applies to Botanical Experience.
export type Protection = 'off' | 'on' | 'half';

/** The public information about a player */
export type PublicPlayerModel = {
  actionsTakenThisRound: number;
  actionsThisGeneration: Array<string /* CardName */>;
  actionsTakenThisGame: number;
  availableBlueCardActionCount: number;
  cardCost: number;
  cardDiscount: number;
  cardsInHandNbr: number;
  citiesCount: number;
  coloniesCount: number;
  color: Color;
  corruption: number,
  energy: number;
  energyProduction: number;
  excavations: number,
  fleetSize: number;
  heat: number;
  heatProduction: number;
  id: PlayerId | undefined;
  influence: number;
  isActive: boolean;
  lastCardPlayed?: CardName;
  megaCredits: number;
  megaCreditProduction: number;
  name: string;
  needsToDraft: boolean | undefined;
  needsToResearch: boolean | undefined;
  noTagsCount: number;
  plants: number;
  plantProduction: number;
  protectedResources: Record<Resource, Protection>;
  protectedProduction: Record<Resource, Protection>;
  tableau: Array<CardModel>;
  selfReplicatingRobotsCards: Array<CardModel>;
  steel: number;
  steelProduction: number;
  steelValue: number;
  tags: Array<TagCount>;
  terraformRating: number;
  timer: TimerModel;
  titanium: number;
  titaniumProduction: number;
  titaniumValue: number;
  tradesThisGeneration: number;
  victoryPointsBreakdown: IVictoryPointsBreakdown;
  victoryPointsByGeneration: Array<number>;
}

/** A player's view of the game, including their secret information. */
export interface PlayerViewModel extends ViewModel {
  cardsInHand: Array<CardModel>;
  dealtCorporationCards: Array<CardModel>;
  dealtPreludeCards: Array<CardModel>;
  dealtProjectCards: Array<CardModel>;
  dealtCeoCards: Array<CardModel>;
  draftedCorporations: Array<CardModel>;
  draftedCards: Array<CardModel>;
  id: PlayerId;
  ceoCardsInHand: Array<CardModel>;
  pickedCorporationCard: Array<CardModel>; // Why Array?
  preludeCardsInHand: Array<CardModel>;
  thisPlayer: PublicPlayerModel;
  waitingFor: PlayerInputModel | undefined;
}
