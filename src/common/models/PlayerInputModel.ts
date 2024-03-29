import {Message} from '../logs/Message';
import {PaymentOptions} from '../inputs/Payment';
import { SelectionType } from '../input/SelectionType';
import { PlayerInputType } from '../input/PlayerInputType';
import { Warning } from '../cards/Warning';

export interface PlayerInputModel {
  title: string | Message;
  buttonLabel: string;
  type: PlayerInputType;
}

export interface AndOptionsModel extends PlayerInputModel {
  type: PlayerInputType.AND;
  options: Array<PlayerInputModel>;
}

export interface OrOptionsModel extends PlayerInputModel {
  type: PlayerInputType.OR;
  options: Array<PlayerInputModel>;
  // When set, initialIdx represents the option within `options` that should be
  // shows as the default selection.
  initialIdx?: number;
}

export interface SelectionInputModel extends PlayerInputModel {
  options: Record<string, any>;
  selectionType: SelectionType;
}

export interface SelectOneModel extends SelectionInputModel {
  type: PlayerInputType.SELECT_ONE;
}

export interface SelectManyModel extends SelectionInputModel {
  type: PlayerInputType.SELECT_MANY;
  min: number;
  max: number;
}

export interface SelectWithInputModel extends SelectOneModel {
  secondaryInputs: Record<string, PlayerInputModel>;
}

export interface SelectPaymentModel extends PlayerInputModel {
  type: PlayerInputType.PAYMENT;
  amount: number;
  paymentOptions: PaymentOptions;
}

export interface SelectAmountModel extends PlayerInputModel {
  type: PlayerInputType.AMOUNT;
  min: number;
  max: number;
  maxByDefault: boolean;
}

export interface SelectOptionModel extends PlayerInputModel {
  type: PlayerInputType.OPTION;
  warnings?: Array<Warning>;
}
