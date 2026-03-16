import {Message} from '../../common/logs/Message';
import {PlayerInput} from '../PlayerInput';
import {BasePlayerInput} from '../PlayerInput';
import {InputResponse, isSelectOptionResponse} from '../../common/inputs/InputResponse';
import {SelectOptionModel} from '../../common/models/PlayerInputModel';
import {Warning} from '../../common/cards/Warning';
import {ICard} from '../cards/ICard';
import {IPlayer} from '../IPlayer';
import {cardsToModel} from '../models/ModelUtils';
import {InputError} from './InputError';

export class SelectOption extends BasePlayerInput<undefined> {
  public warnings?: ReadonlyArray<Warning>;
  public cards?: ReadonlyArray<ICard>;
  public greyedOutCards?: ReadonlyArray<ICard>;

  constructor(
    title: string | Message,
    buttonLabel: string = 'Confirm',
    warnings?: ReadonlyArray<Warning>,
    cards?: ReadonlyArray<ICard>,
    greyedOutCards?: ReadonlyArray<ICard>,
  ) {
    super('option', title);
    this.buttonLabel = buttonLabel;
    this.warnings = warnings;
    this.cards = cards;
    this.greyedOutCards = greyedOutCards;
  }

  public override toModel(player: IPlayer): SelectOptionModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'option',
      warnings: this.warnings,
      polling: this.polling,
      cards: this.cards ? cardsToModel(player, this.cards, {showResources: true}) : undefined,
      greyedOutCards: this.greyedOutCards ? cardsToModel(player, this.greyedOutCards, {showResources: true, enabled: this.greyedOutCards.map(() => false)}) : undefined,
    };
  }
  public process(response: InputResponse): PlayerInput | undefined {
    if (!isSelectOptionResponse(response)) {
      throw new InputError('Not a valid SelectOptionResponse');
    }
    return this.cb(undefined);
  }
}
