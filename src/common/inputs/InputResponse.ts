import {PlayerInputType} from '../input/PlayerInputType';
import {Payment} from './Payment';

export interface InputResponse {
  type: PlayerInputType;
}

export interface OrOptionsResponse extends InputResponse {
  type: PlayerInputType.OR,
  index: number;
  response: InputResponse;
}

export interface AndOptionsResponse extends InputResponse {
  type: PlayerInputType.AND,
  responses: Array<InputResponse>;
}

export interface SelectOneResponse extends InputResponse {
  type: PlayerInputType.SELECT_ONE,
  option: string
}

export interface SelectManyResponse extends InputResponse {
  type: PlayerInputType.SELECT_MANY,
  options: Array<string>
}

export interface SelectWithInputResponse extends SelectOneResponse {
  response: InputResponse
}

export interface SelectPaymentResponse extends InputResponse {
  type: PlayerInputType.PAYMENT,
  payment: Payment;
}

export interface SelectAmountResponse extends InputResponse {
  type: PlayerInputType.AMOUNT,
  amount: number;
}

export interface SelectOptionResponse extends InputResponse {
  type: PlayerInputType.OPTION,
}



