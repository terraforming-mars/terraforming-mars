import {BasePlayerInput} from '../PlayerInput';
import {isPayment, Payment} from '../../common/inputs/Payment';
import {IProjectCard} from '../cards/IProjectCard';
import {isIStandardProjectCard, IStandardProjectCard} from '../cards/IStandardProjectCard';
import {Units} from '../../common/Units';
import {MoonExpansion} from '../moon/MoonExpansion';
import {CardAction, IPlayer} from '../IPlayer';
import {InputResponse, isSelectProjectCardToPlayResponse, SelectProjectCardToPlayResponse} from '../../common/inputs/InputResponse';
import {CardName} from '../../common/cards/CardName';
import {cardsToModel} from '../models/ModelUtils';
import {SelectProjectCardToPlayModel} from '../../common/models/PlayerInputModel';
import {InputError} from './InputError';
import {Message} from '../../common/logs/Message';

export type PlayCardMetadata = {
  reserveUnits: Readonly<Units>;
  overriddenCost?: number;
};

export abstract class SelectCardToPlay<T extends IProjectCard | IStandardProjectCard> extends BasePlayerInput<T> {
  public cards: Array<T> = [];
  public extras: Map<CardName, PlayCardMetadata>;

  public get enabled(): ReadonlyArray<boolean> | undefined {
    return this.config?.enabled;
  }

  constructor(
    protected player: IPlayer,
    cards: Array<T>, // = player.getPlayableCards(),
    public config?: {
      action?: CardAction,
      enabled?: ReadonlyArray<boolean>,
      title?: string | Message,
      buttonLabel?: string,
      adjustedCost?: (card: IStandardProjectCard) => number,
    }) {
    super('projectCard', config?.title ?? 'Play project card');
    this.buttonLabel = config?.buttonLabel ?? 'Play card';
    this.cards = cards;
    this.extras = new Map(
      cards.map((card) => {
        return [
          card.name,
          {
            reserveUnits: card.reserveUnits ?
              MoonExpansion.adjustedReserveCosts(player, card) :
              Units.EMPTY,
            overriddenCost: (isIStandardProjectCard(card) && config?.adjustedCost) ?
              config.adjustedCost(card) :
              undefined,
          },
        ];
      }));
  }

  public toModel(player: IPlayer): SelectProjectCardToPlayModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'projectCard',
      cards: cardsToModel(player, this.cards, {showCalculatedCost: true, extras: this.extras, enabled: this.config?.enabled}),
      microbes: player.getSpendable('microbes'),
      floaters: player.getSpendable('floaters'),
      paymentOptions: {
        heat: player.canUseHeatAsMegaCredits,
        lunaTradeFederationTitanium: player.canUseTitaniumAsMegacredits,
        plants: player.canUsePlantsAsMegacredits,
      },
      lunaArchivesScience: player.getSpendable('lunaArchivesScience'),
      seeds: player.getSpendable('seeds'),
      graphene: player.getSpendable('graphene'),
      kuiperAsteroids: player.getSpendable('kuiperAsteroids'),
      auroraiData: player.getSpendable('auroraiData'),
      spireScience: player.getSpendable('spireScience'),
    };
  }

  public process(input: InputResponse) {
    if (!isSelectProjectCardToPlayResponse(input)) {
      throw new InputError('Not a valid SelectProjectCardToPlayResponse');
    }
    if (!isPayment(input.payment)) {
      throw new InputError('payment is not a valid type');
    }

    const cardIndex = this.cards.findIndex((card) => card.name === input.card);
    if (cardIndex === -1) {
      throw new InputError('Unknown card name ' + input.card);
    }
    const details = this.extras.get(input.card);
    if (details === undefined) {
      throw new InputError('Unknown card name ' + input.card);
    }
    // These are not used for safety but do help give a better error message
    // to the user
    const reserveUnits = details.reserveUnits;
    if (reserveUnits.steel + input.payment.steel > this.player.steel) {
      throw new InputError(`${reserveUnits.steel} units of steel must be reserved for ${input.card}`);
    }
    if (reserveUnits.titanium + input.payment.titanium > this.player.titanium) {
      throw new InputError(`${reserveUnits.titanium} units of titanium must be reserved for ${input.card}`);
    }
    if (reserveUnits.plants + input.payment.plants > this.player.plants) {
      throw new InputError(`${reserveUnits.titanium} units of plants must be reserved for ${input.card}`);
    }
    const card = this.cards[cardIndex];

    this.validate(card, input, details);

    this.payAndPlay(card, input.payment);
    return undefined;
  }

  protected abstract validate(card: T, input: SelectProjectCardToPlayResponse, details: PlayCardMetadata): void;

  // Public for tests
  public abstract payAndPlay(card: T, payment: Payment): void;
}
