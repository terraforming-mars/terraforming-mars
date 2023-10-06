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
    cb(...item: any): PlayerInput | undefined;

    toModel(player: IPlayer): PlayerInputModel;

    /**
     * Processes and validates `response` for this PlayerInput which is meant for the given `player`.
     *
     * This is another mechainsm for calling cb() with a client-side response.
     */
    process(response: InputResponse, player: IPlayer): PlayerInput | undefined;
    maxByDefault?: boolean;
}

export abstract class BasePlayerInput<T> implements PlayerInput {
  public readonly type: PlayerInputType;
  public buttonLabel: string = 'Save';
  public title: string | Message;
  public cb: (param: T) => PlayerInput | undefined = () => undefined;
  public abstract toModel(player: IPlayer): PlayerInputModel;
  public abstract process(response: InputResponse, player: IPlayer): PlayerInput | undefined;

  constructor(type: PlayerInputType, title: string | Message = '') {
    this.type = type;
    this.title = title;
  }

  public andThen(cb: (param: T) => PlayerInput | undefined): this {
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
