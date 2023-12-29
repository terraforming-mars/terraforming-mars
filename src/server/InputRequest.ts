import {ICard} from './cards/ICard';
import {Message} from '../common/logs/Message';
import {InputRequestType} from '../common/input/InputRequestType';
import {InputResponse} from '../common/inputs/InputResponse';
import {IPlayer} from './IPlayer';
import {InputRequestModel} from '../common/models/InputRequestModel';

export interface InputRequest {
    type: InputRequestType;
    buttonLabel: string;
    title: string | Message;
    cb(...item: any): InputRequest | undefined;

    toModel(player: IPlayer): InputRequestModel;

    /**
     * Processes and validates `response` for this InputRequest which is meant for the given `player`.
     *
     * This is another mechainsm for calling cb() with a client-side response.
     */
    process(response: InputResponse, player: IPlayer): InputRequest | undefined;
    maxByDefault?: boolean;
}

export abstract class BaseInputRequest<T> implements InputRequest {
  public readonly type: InputRequestType;
  public buttonLabel: string = 'Save';
  public title: string | Message;
  public cb: (param: T) => InputRequest | undefined = () => undefined;
  public abstract toModel(player: IPlayer): InputRequestModel;
  public abstract process(response: InputResponse, player: IPlayer): InputRequest | undefined;

  constructor(type: InputRequestType, title: string | Message = '') {
    this.type = type;
    this.title = title;
  }

  public andThen(cb: (param: T) => InputRequest | undefined): this {
    this.cb = cb;
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
