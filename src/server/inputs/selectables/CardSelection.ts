import {ICard} from '../../cards/ICard';
import {Message} from '../../../common/logs/Message';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import { SelectionHandler } from './SelectionHandler';
import { SelectionType } from '@/common/input/SelectionType';
import { cardToModel } from '@/server/models/ModelUtils';

export type Options = {
  /** When provided, then the cards with false in `enabled` are not selectable and grayed out */
  enabled: Map<CardName, boolean>,
  /** Default is true. If true, then shows resources on those cards. If false than shows discounted price. */
  played: boolean | CardName.SELF_REPLICATING_ROBOTS
  /** Default is false. If true then show the name of the card owner below. */
  showOwner: boolean,
}

export class CardSelection<T extends ICard> extends SelectionHandler<T> {
  constructor(
    title: string | Message,
    buttonLabel: string = 'Save',
    cards: Array<T>,
    private config?: Partial<Options>,
  ) {
    super(cards, SelectionType.CARD, title, buttonLabel);
  }

  public override GetOptionName(option: T): string {
    return option.name
  }

  public override OptionAsModel(option: T, player: IPlayer) {
    return cardToModel(option, player, {
      showCalculatedCost: this?.config?.played === false || this.config.played === CardName.SELF_REPLICATING_ROBOTS,
      showResources: this.config.played === true || this.config.played === CardName.SELF_REPLICATING_ROBOTS,
      enabled: this.config.enabled,
      showOwner: this.config.showOwner
    })
  }
}
