import {Player} from '../Player';
import {SelectCard} from '../inputs/SelectCard';
import {ResourceType} from '../ResourceType';
import {ICard} from '../cards/ICard';
import {Tags} from '../cards/Tags';
import {DeferredAction, Priority} from './DeferredAction';
import {LogBuilder} from '../LogBuilder';

export namespace AddResourcesToCard {
  export interface Options {
    count?: number;
    restrictedTag?: Tags;
    title?: string;
    filter?: (card: ICard) => boolean;
    logMessage?: string;
    logBuilder?: (builder: LogBuilder) => void;
  }
}

export class AddResourcesToCard implements DeferredAction {
  public priority = Priority.GAIN_RESOURCE_OR_PRODUCTION;
  constructor(
        public player: Player,
        public resourceType: ResourceType | undefined,
        public options: AddResourcesToCard.Options = {},
  ) {}

  public execute() {
    const count = this.options.count ?? 1;
    const title = this.options.title ??
      'Select card to add ' + count + ' ' + (this.resourceType || 'resources') + '(s)';
    let cards = this.player.getResourceCards(this.resourceType);

    if (this.options.restrictedTag !== undefined) {
      cards = cards.filter((card) => card.tags.includes(this.options.restrictedTag!));
    }
    if (this.options.filter !== undefined) {
      cards = cards.filter(this.options.filter);
    }

    if (cards.length === 0) {
      return undefined;
    }

    if (cards.length === 1) {
      this.player.addResourceTo(cards[0], {qty: count, log: true});
      return undefined;
    }

    return new SelectCard(
      title,
      count === 1 ? 'Add resource' : 'Add resources',
      cards,
      (selected: Array<ICard>) => {
        this.player.addResourceTo(selected[0], {qty: count, log: true});
        return undefined;
      },
    );
  }
}
