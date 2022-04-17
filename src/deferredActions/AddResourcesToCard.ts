import {Player} from '../Player';
import {SelectCard} from '../inputs/SelectCard';
import {CardResource} from '../common/CardResource';
import {ICard} from '../cards/ICard';
import {Tags} from '../common/cards/Tags';
import {DeferredAction, Priority} from './DeferredAction';

export namespace AddResourcesToCard {
  export interface Options {
    count?: number;
    restrictedTag?: Tags;
    title?: string;
    filter?: (card: ICard) => boolean;
    log?: () => void;
  }
}

export class AddResourcesToCard extends DeferredAction {
  constructor(
    player: Player,
    public resourceType: CardResource | undefined,
    public options: AddResourcesToCard.Options = {},
  ) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
  }

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
      this.addResource(cards[0], count);
      return undefined;
    }

    return new SelectCard(
      title,
      count === 1 ? 'Add resource' : 'Add resources',
      cards,
      (selected: Array<ICard>) => {
        this.addResource(selected[0], count);
        return undefined;
      },
    );
  }

  private addResource(card: ICard, qty: number) {
    const autoLog = this.options.log === undefined;
    this.player.addResourceTo(card, {qty, log: autoLog});
    this.options.log?.();
  }
}
