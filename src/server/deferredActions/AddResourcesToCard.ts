import {IPlayer} from '../IPlayer';
import {SelectCard} from '../inputs/SelectCard';
import {CardResource} from '../../common/CardResource';
import {ICard} from '../cards/ICard';
import {Tag} from '../../common/cards/Tag';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {Message} from '../../common/logs/Message';
import {IProjectCard} from '../cards/IProjectCard';
import {message} from '../logs/MessageBuilder';

export type Options = {
  count?: number;
  restrictedTag?: Tag;
  min?: number;
  title?: string | Message;
  robotCards?: boolean;
  filter?(card: ICard): boolean;
  log?: boolean;
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

  private getCardsInPlay(): Array<ICard> {
    let cards = this.player.getResourceCards(this.resourceType);
    const restrictedTag = this.options.restrictedTag;
    if (restrictedTag !== undefined) {
      cards = cards.filter((card) => card.tags.includes(restrictedTag));
    }
    if (this.options.filter !== undefined) {
      cards = cards.filter(this.options.filter);
    }
    const min = this.options.min;
    if (min) {
      cards = cards.filter((c) => c.resourceCount >= min);
    }
    return cards;
  }

  private getSelfReplicatingRobotCards(): Array<IProjectCard> {
    if (this.options.robotCards !== true) {
      return [];
    }
    let cards = this.player.getSelfReplicatingRobotsTargetCards();
    if (this.options.restrictedTag !== undefined) {
      throw new Error('restrictedTag does not work when filtering SRR cards');
    }
    if (this.options.filter !== undefined) {
      throw new Error('Filter does not work when filtering SRR cards');
    }
    if (this.options.min) {
      const min = this.options.min;
      cards = cards.filter((c) => c.resourceCount >= min);
    }
    return cards;
  }

  /**
   * Returns the cards this deferredAction could apply to. Does not cache results.
   *
   * This is made public because of `Executor.canExecute` and should probably be someplace else.
   */
  public getCardCount(): number {
    return this.getCardsInPlay().length + this.getSelfReplicatingRobotCards().length;
  }

  public getCards(): Array<ICard> {
    return [...this.getCardsInPlay(), ...this.getSelfReplicatingRobotCards()];
  }

  public execute() {
    const qty = this.options.count ?? 1;
    const cards = this.getCards();
    if (cards.length === 0) {
      return undefined;
    }

    if (cards.length === 1) {
      this.addResource(cards[0], qty);
      return undefined;
    }

    const count = this.options.count ?? 1;
    const title = this.options.title ??
      message('Select card to add ${0} ${1}', (b) => b.number(count).string(this.resourceType || 'resources'));
    const buttonLabel = count === 1 ? 'Add resource' : 'Add resources';

    return new SelectCard(title, buttonLabel, cards)
      .andThen(([card]) => {
        this.addResource(card, qty);
        return undefined;
      });
  }

  private addResource(card: ICard, qty: number) {
    const autoLog = this.options.log !== false;
    this.player.addResourceTo(card, {qty, log: autoLog});
    this.cb(undefined);
  }
}
