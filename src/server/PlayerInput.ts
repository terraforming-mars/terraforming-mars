import {ICard} from './cards/ICard';
import {Message} from '../common/logs/Message';
import {PlayerInputType} from '../common/input/PlayerInputType';
import {InputResponse} from '../common/inputs/InputResponse';
import {IPlayer} from './IPlayer';

export interface PlayerInput {
    inputType: PlayerInputType;
    buttonLabel: string;
    options?: Array<PlayerInput>;
    title: string | Message;
    cb(...item: any): PlayerInput | undefined;
    /**
     * Processes and validates `response` for this PlayerInput which is meant for the given `player`.
     *
     * This is another mechainsm for calling cb() with a client-side response.
     */
    process(response: InputResponse, player: IPlayer): PlayerInput | undefined;
    maxByDefault?: boolean;
}

export abstract class BasePlayerInput implements PlayerInput {
  public readonly inputType: PlayerInputType;
  public buttonLabel: string = 'Save';
  public title: string | Message;
  public abstract cb(...item: any): PlayerInput | undefined;
  public abstract process(response: InputResponse, player: IPlayer): PlayerInput | undefined;

  constructor(inputType: PlayerInputType, title: string | Message = '') {
    this.inputType = inputType;
    this.title = title;
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
