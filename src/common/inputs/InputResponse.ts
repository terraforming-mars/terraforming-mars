import {CardName} from '../cards/CardName';
import {ColonyName} from '../colonies/ColonyName';
import {ColorWithNeutral} from '../Color';
import {GlobalEventName} from '../turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../turmoil/PartyName';
import {SpaceId} from '../Types';
import {Units} from '../Units';
import {twoWayDifference} from '../utils/utils';
import {AresGlobalParametersResponse} from './AresGlobalParametersResponse';
import {Payment} from './Payment';

function matches(response: any, fields: Array<string>) {
  return twoWayDifference(Object.keys(response), fields).length === 0;
}
export interface SelectOptionResponse {
  type: 'option',
}

export function isSelectOptionResponse(response: InputResponse): response is SelectOptionResponse {
  return response.type === 'option' && Object.keys(response).length === 1;
}

export interface OrOptionsResponse {
  type: 'or',
  index: number;
  response: InputResponse;
}

export function isOrOptionsResponse(response: InputResponse): response is OrOptionsResponse {
  return response.type === 'or' && matches(response, ['type', 'index', 'response']);
}

export interface AndOptionsResponse {
  type: 'and',
  responses: Array<InputResponse>;
}

export function isAndOptionsResponse(response: InputResponse): response is AndOptionsResponse {
  return response.type === 'and' && matches(response, ['type', 'responses']);
}

export interface SelectCardResponse {
  type: 'card',
  cards: Array<CardName>;
}

export function isSelectCardResponse(response: InputResponse): response is SelectCardResponse {
  return response.type === 'card' && matches(response, ['type', 'cards']);
}

export interface SelectProjectCardToPlayResponse {
  type: 'projectCard',
  card: CardName;
  payment: Payment;
}

export function isSelectProjectCardToPlayResponse(response: InputResponse): response is SelectProjectCardToPlayResponse {
  return response.type === 'projectCard' && matches(response, ['type', 'card', 'payment']);
}

export interface SelectSpaceResponse {
  type: 'space',
  spaceId: SpaceId;
}

export function isSelectSpaceResponse(response: InputResponse): response is SelectSpaceResponse {
  return response.type === 'space' && matches(response, ['type', 'spaceId']);
}

export interface SelectPlayerResponse {
  type: 'player',
  player: ColorWithNeutral | undefined;
}

export function isSelectPlayerResponse(response: InputResponse): response is SelectPlayerResponse {
  return response.type === 'player' && matches(response, ['type', 'player']);
}

export interface SelectPartyResponse {
  type: 'party',
  partyName: PartyName | undefined;
}

export function isSelectPartyResponse(response: InputResponse): response is SelectPartyResponse {
  return response.type === 'party' && matches(response, ['type', 'partyName']);
}

export interface SelectDelegateResponse {
  type: 'delegate',
  player: ColorWithNeutral;
}

export function isSelectDelegateResponse(response: InputResponse): response is SelectDelegateResponse {
  return response.type === 'delegate' && matches(response, ['type', 'player']);
}

export interface SelectAmountResponse {
  type: 'amount',
  amount: number;
}

export function isSelectAmountResponse(response: InputResponse): response is SelectAmountResponse {
  return response.type === 'amount' && matches(response, ['type', 'amount']);
}

export interface SelectColonyResponse {
  type: 'colony',
  colonyName: ColonyName;
}

export function isSelectColonyResponse(response: InputResponse): response is SelectColonyResponse {
  return response.type === 'colony' && matches(response, ['type', 'colonyName']);
}

export interface SelectPaymentResponse {
  type: 'payment',
  payment: Payment;
}

export function isSelectPaymentResponse(response: InputResponse): response is SelectPaymentResponse {
  return response.type === 'payment' && matches(response, ['type', 'payment']);
}

export interface SelectProductionToLoseResponse {
  type: 'productionToLose',
  units: Units;
}

export function isSelectProductionToLoseResponse(response: InputResponse): response is SelectProductionToLoseResponse {
  return response.type === 'productionToLose' && matches(response, ['type', 'units']);
}

export interface ShiftAresGlobalParametersResponse {
  type: 'aresGlobalParameters',
  response: AresGlobalParametersResponse;
}

export function isShiftAresGlobalParametersResponse(response: InputResponse): response is ShiftAresGlobalParametersResponse {
  return response.type === 'aresGlobalParameters' && matches(response, ['type', 'response']);
}

// This applies to the input in AresGlobalParametersResponse.ts, which should
// probably move here.
export function isAresGlobalParametersResponse(obj: any): obj is AresGlobalParametersResponse {
  return matches(obj, ['lowOceanDelta', 'highOceanDelta', 'temperatureDelta', 'oxygenDelta']);
}

export interface SelectGlobalEventResponse {
  type: 'globalEvent',
  globalEventName: GlobalEventName;
}

export function isSelectGlobalEventResponse(response: InputResponse): response is SelectGlobalEventResponse {
  return response.type === 'globalEvent' && matches(response, ['type', 'globalEventName']);
}

export type InputResponse =
  AndOptionsResponse |
  OrOptionsResponse |
  SelectAmountResponse |
  SelectCardResponse |
  SelectColonyResponse |
  SelectDelegateResponse |
  SelectOptionResponse |
  SelectPartyResponse |
  SelectPaymentResponse |
  SelectPlayerResponse |
  SelectProductionToLoseResponse |
  SelectProjectCardToPlayResponse |
  SelectSpaceResponse |
  ShiftAresGlobalParametersResponse |
  SelectGlobalEventResponse;
