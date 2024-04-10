import {IPlayer} from '../IPlayer';
import {SelectCard} from '../inputs/SelectCard';
import {CardResource} from '../../common/CardResource';
import {ICard} from '../cards/ICard';
import {Tag} from '../../common/cards/Tag';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {Message} from '../../common/logs/Message';
import {message} from '../logs/MessageBuilder';
import {RobotCardProxy} from '../cards/promo/RobotCardProxy';

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

  /**
   * Returns the cards this deferredAction could apply to. Does not cache results.
   *
   * This is made public because of `Executor.canExecute` and should probably be someplace else.
   */
  public getCards(): Array<ICard> {
    let cards = this.player.getResourceCards(this.resourceType);
    if (this.options.robotCards === true) {
      cards.push(...this.player.getSelfReplicatingRobotsTargetCards());
    }
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

  public execute() {
    const count = this.options.count ?? 1;
    const title = this.options.title ??
    message('Select card to add ${0} ${1}', (b) => b.number(count).string(this.resourceType || 'resources'));

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
    ).andThen(([card]) => {
      this.addResource(card, count);
      return undefined;
    });
  }

  private addResource(card: ICard, qty: number) {
    if (card instanceof RobotCardProxy) {
      const srr = this.player.findSelfReplicatingRobots();
      if (srr !== undefined) {
        srr.addResourcesToAttachedCard(this.player, card, qty);
      } else {
        throw new Error('Player tried to add resource to a RobotProxyCard despite having not played Self-Replicating Robots');
      }
    } else {
      const autoLog = this.options.log !== false;
      this.player.addResourceTo(card, {qty, log: autoLog});
      this.cb(undefined);
    }
  }
}
