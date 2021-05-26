import {CardModel} from './CardModel';
import {Color} from '../Color';
import {VictoryPointsBreakdown} from '../VictoryPointsBreakdown';
import {ITagCount} from '../ITagCount';
import {PlayerInputModel} from './PlayerInputModel';
import {SerializedTimer} from '../SerializedTimer';
import {GameModel} from './GameModel';
import {PlayerId} from '../Player';

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
  id: PlayerId | 'invalid',
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

export interface PrivatePlayerModel {
  availableBlueCardActionCount: number;
  cardCost: number;
  cardsInHand: Array<CardModel>;
  corporationCard: CardModel | undefined;
  dealtCorporationCards: Array<CardModel>;
  dealtPreludeCards: Array<CardModel>;
  dealtProjectCards: Array<CardModel>;
  draftedCards: Array<CardModel>;
  id: PlayerId;
  influence: number;
  pickedCorporationCard: Array<CardModel>; // Why Array?
  preludeCardsInHand: Array<CardModel>;
  timer: SerializedTimer;
  waitingFor: PlayerInputModel | undefined;
}

// A player's view of the game includes public game information,
// public information about all the players,
// your private information, and your index in the public players array.
export interface PlayerModel {
  game: GameModel;
  players: Array<PublicPlayerModel>;
  privateModel: PrivatePlayerModel;
  playersIndex: number,
}

export function publicModelOf(playerModel: PlayerModel): PublicPlayerModel {
  return playerModel.players[playerModel.playersIndex];
}
