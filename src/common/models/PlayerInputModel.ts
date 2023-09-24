import {CardModel} from './CardModel';
import {ColonyModel} from './ColonyModel';
import {Color, ColorWithNeutral} from '../Color';
import {PayProductionModel} from './PayProductionUnitsModel';
import {AresData} from '../ares/AresData';
import {Message} from '../logs/Message';
import {PartyName} from '../turmoil/PartyName';
import {TurmoilModel} from './TurmoilModel';
import {SpaceId} from '../Types';
import {PaymentOptions} from '../inputs/Payment';

export type BaseInputModel = {
  title: string | Message;
  buttonLabel: string;
}
export type AndOptionsModel = BaseInputModel & {
  inputType: 'and';
  options: Array<PlayerInputModel>;
}

export type OrOptionsModel = BaseInputModel & {
  inputType: 'or';
  options: Array<PlayerInputModel>;
}

export type SelectInitialCardsModel = BaseInputModel & {
  inputType: 'initialCards';
  options: Array<PlayerInputModel>;
}

export type SelectOptionModel = BaseInputModel & {
  inputType: 'option';
}

export type SelectProjectCardToPlayModel = BaseInputModel & {
  inputType: 'projectCard';
  cards: Array<CardModel>;
  paymentOptions: Partial<PaymentOptions>,
  microbes: number;
  floaters: number;
  lunaArchivesScience: number;
  seeds: number;
  graphene: number;
  kuiperAsteroids: number;
}

export type SelectCardModel = BaseInputModel & {
  inputType: 'card';
  cards: Array<CardModel>;
  max: number;
  min: number;
  // TODO(kberg): Dig into client to remove 'undefined'
  showOnlyInLearnerMode: boolean | undefined;
  selectBlueCardAction: boolean;
  showOwner: boolean;
}

export type SelectColonyModel = BaseInputModel & {
  inputType: 'colony';
  coloniesModel: Array<ColonyModel>;
}

export type SelectPaymentModel = BaseInputModel & {
  inputType: 'payment';
  amount: number;
  paymentOptions: Partial<PaymentOptions>;
  seeds: number;
  auroraiData: number;
  kuiperAsteroids: number;
  spireScience: number;
}

export type SelectPlayerModel = BaseInputModel & {
  inputType: 'player';
  players: Array<Color>;
}

export type SelectSpaceModel = BaseInputModel & {
  inputType: 'space';
  // TODO(kberg): Rename to 'spaces'
  availableSpaces: Array<SpaceId>;
}

export type SelectAmountModel = BaseInputModel & {
  inputType: 'amount';
  min: number;
  max: number;
  // TODO(kberg): Dig into client to remove 'undefined'
  maxByDefault: boolean | undefined;
}

export type SelectDelegateModel = BaseInputModel & {
  inputType: 'delegate';
  players: Array<ColorWithNeutral>;
}

export type SelectPartyModel = BaseInputModel & {
  inputType: 'party';
  // TODO(kberg): Rename to 'parties'
  availableParties: Array<PartyName>;
  // Is this necessary?
  turmoil: TurmoilModel;
}

export type SelectProductionToLoseModel = BaseInputModel & {
  inputType: 'productionToLose';
  payProduction: PayProductionModel;
}

export type ShiftAresGlobalParametersModel = BaseInputModel & {
  inputType: 'aresGlobalParameters';
  aresData: AresData;
}

export type PlayerInputModel =
  AndOptionsModel |
  OrOptionsModel |
  SelectInitialCardsModel |
  SelectOptionModel |
  SelectProjectCardToPlayModel |
  SelectCardModel |
  SelectAmountModel |
  SelectCardModel |
  SelectColonyModel |
  SelectDelegateModel |
  SelectPartyModel |
  SelectPaymentModel |
  SelectPlayerModel |
  SelectProductionToLoseModel |
  SelectProjectCardToPlayModel |
  SelectSpaceModel |
  ShiftAresGlobalParametersModel;
