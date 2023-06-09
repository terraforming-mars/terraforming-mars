import {IPlayer} from '../IPlayer';
import {SelectCard} from '../inputs/SelectCard';
import {CardResource} from '../../common/CardResource';
import {ICard} from '../cards/ICard';
import {Tag} from '../../common/cards/Tag';
import {DeferredAction, Priority} from './DeferredAction';

export type Options = {
  count?: number;
  restrictedTag?: Tag;
  title?: string;
  filter?: (card: ICard) => boolean;
  log?: () => void;
}

export class AddResourcesToCard extends DeferredAction {
  constructor(
    player: IPlayer,
    /** The card type to add to. Undefined means any resource. */
    public resourceType: CardResource | undefined,
    public options: Options = {},
  ) {
    super(player, Priority.GAIN_RESOURCE_OR_PRODUCTION);
  }

  /**
   * Returns the cards this deferredAction could apply to. Does not cache results.
   *
   * This is made public because of `Executor.canExecute` and should probably be someplace else.
   */
  public getCards() {
    let cards = this.player.getResourceCards(this.resourceType);
    const restrictedTag = this.options.restrictedTag;
    if (restrictedTag !== undefined) {
      cards = cards.filter((card) => card.tags.includes(restrictedTag));
    }
    if (this.options.filter !== undefined) {
      cards = cards.filter(this.options.filter);
    }
    return cards;
  }

  public execute() {
    const count = this.options.count ?? 1;
    const title = this.options.title ??
      'Select card to add ' + count + ' ' + (this.resourceType || 'resources') + '(s)';

    const cards = this.getCards();
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
      ([card]) => {
        this.addResource(card, count);
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
