import {ICard} from './cards/ICard';
import {Message} from '../common/logs/Message';
import {PlayerInputType} from '../common/input/PlayerInputType';
import {InputResponse} from '../common/inputs/InputResponse';
import {IPlayer} from './IPlayer';
import {PlayerInputModel} from '../common/models/PlayerInputModel';

export interface PlayerInput {
    type: PlayerInputType;
    buttonLabel: string;
    title: string | Message;
    warning?: string | Message;
    /**
     * When false, this input should not be the default selected PlayerInput.
     * When unset or true, this input may be the default selected PlayerInput.
     *
     * Used only when this option is a child option of an OrOptions.
     */
    eligibleForDefault?: boolean;

    cb(...item: any): PlayerInput | undefined;

    /**
     * Converts this PlayerInput to the model received by the UI.
     */
    toModel(player: IPlayer): PlayerInputModel;

    /**
     * Processes and validates `response` for this PlayerInput which is meant for the given `player`.
     *
     * This is another mechainsm for calling cb() with a client-side response.
     */
    process(response: InputResponse, player: IPlayer): PlayerInput | undefined;
}

const NULL_FUNCTION = () => undefined;

export abstract class BasePlayerInput<T> implements PlayerInput {
  public readonly type: PlayerInputType;
  public buttonLabel: string = 'Save';
  public title: string | Message;
  public warning?: string | Message;
  public cb: (param: T) => PlayerInput | undefined = NULL_FUNCTION;
  public eligibleForDefault: boolean | undefined = undefined;

  public abstract toModel(player: IPlayer): PlayerInputModel;
  public abstract process(response: InputResponse, player: IPlayer): PlayerInput | undefined;

  constructor(type: PlayerInputType, title: string | Message = '') {
    this.type = type;
    this.title = title;
  }

  public andThen(cb: (param: T) => PlayerInput | undefined): this {
    if (this.cb !== NULL_FUNCTION) {
      const THROW_STATE_ERRORS = Boolean(process.env.THROW_STATE_ERRORS);
      if (THROW_STATE_ERRORS) {
        throw new Error('andThen called twice');
      } else {
        console.error('andThen called twice');
        return this;
      }
    }
    this.cb = cb;
    return this;
  }

  public setTitle(title: string | Message) : this {
    this.title = title;
    return this;
  }

  public setButtonLabel(buttonLabel: string) : this {
    this.buttonLabel = buttonLabel;
    return this;
  }

  public setWarning(warning: string | Message) : this {
    this.warning = warning;
    return this;
  }
}

export function getCardFromPlayerInput<T extends ICard>(cards: ReadonlyArray<T>, cardName: string): {card: T, idx: number} {
  const idx = cards.findIndex((card) => card.name === cardName);
  if (idx === -1) {
    throw new Error(`Card ${cardName} not found`);
  }
  const card = cards[idx];
  return {card, idx};
}
