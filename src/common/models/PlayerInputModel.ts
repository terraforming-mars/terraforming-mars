import {CardModel} from './CardModel';
import {ColonyModel} from './ColonyModel';
import {Color, ColorWithNeutral} from '../Color';
import {PayProductionModel} from './PayProductionUnitsModel';
import {AresData} from '../ares/AresData';
import {Message} from '../logs/Message';
import {PartyName} from '../turmoil/PartyName';
import {SpaceId} from '../Types';
import {PaymentOptions} from '../inputs/Payment';

export type BaseInputModel = {
  title: string | Message;
  buttonLabel: string;
}
export type AndOptionsModel = BaseInputModel & {
  type: 'and';
  options: Array<PlayerInputModel>;
}

export type OrOptionsModel = BaseInputModel & {
  type: 'or';
  options: Array<PlayerInputModel>;
}

export type SelectInitialCardsModel = BaseInputModel & {
  type: 'initialCards';
  options: Array<PlayerInputModel>;
}

export type SelectOptionModel = BaseInputModel & {
  type: 'option';
}

export type SelectProjectCardToPlayModel = BaseInputModel & {
  type: 'projectCard';
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
  type: 'card';
  cards: Array<CardModel>;
  max: number;
  min: number;
  showOnlyInLearnerMode: boolean;
  selectBlueCardAction: boolean;
  showOwner: boolean;
}

export type SelectColonyModel = BaseInputModel & {
  type: 'colony';
  coloniesModel: Array<ColonyModel>;
}

export type SelectPaymentModel = BaseInputModel & {
  type: 'payment';
  amount: number;
  paymentOptions: Partial<PaymentOptions>;
  seeds: number;
  auroraiData: number;
  kuiperAsteroids: number;
  spireScience: number;
}

export type SelectPlayerModel = BaseInputModel & {
  type: 'player';
  players: Array<Color>;
}

export type SelectSpaceModel = BaseInputModel & {
  type: 'space';
  spaces: Array<SpaceId>;
}

export type SelectAmountModel = BaseInputModel & {
  type: 'amount';
  min: number;
  max: number;
  maxByDefault: boolean;
}

export type SelectDelegateModel = BaseInputModel & {
  type: 'delegate';
  players: Array<ColorWithNeutral>;
}

export type SelectPartyModel = BaseInputModel & {
  type: 'party';
  parties: Array<PartyName>;
}

export type SelectProductionToLoseModel = BaseInputModel & {
  type: 'productionToLose';
  payProduction: PayProductionModel;
}

export type ShiftAresGlobalParametersModel = BaseInputModel & {
  type: 'aresGlobalParameters';
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
