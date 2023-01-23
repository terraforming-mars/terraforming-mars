import {ICard} from './cards/ICard';
import {Message} from '../common/logs/Message';
import {PlayerInputType} from '../common/input/PlayerInputType';
import {InputResponse} from '../common/inputs/InputResponse';
import {Player} from './Player';
import {PlayerInputModel} from '../common/models/PlayerInputModel';

export interface PlayerInput {
    inputType: PlayerInputType;
    buttonLabel: string;
    title: string | Message;
    cb(...item: any): PlayerInput | undefined;
    toModel(model: PlayerInputModel, player: Player): void;
    /**
     * Processes and validates `response` for this PlayerInput which is meant for the given `player`.
     *
     * This is another mechainsm for calling cb() with a client-side response.
     */
    process(response: InputResponse, player: Player): PlayerInput | undefined;
    maxByDefault?: boolean;
}

export abstract class BasePlayerInput implements PlayerInput {
  public readonly inputType: PlayerInputType;
  public buttonLabel: string = 'Save';
  public title: string | Message;

  constructor(inputType: PlayerInputType, title: string | Message = '') {
    this.inputType = inputType;
    this.title = title;
  }

  public abstract cb(...item: any): PlayerInput | undefined;
  public abstract process(response: InputResponse, player: Player): PlayerInput | undefined;
  public abstract toModel(model: PlayerInputModel, player: Player): void;
}

export function getCardFromPlayerInput<T extends ICard>(cards: Array<T>, cardName: string): {card: T, idx: number} {
  const idx = cards.findIndex((card) => card.name === cardName);
  if (idx === -1) {
    throw new Error(`Card ${cardName} not found`);
  }
  const card = cards[idx];
  return {card, idx};
}
