import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {IProjectCard} from '../cards/IProjectCard';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';
import {CardResource} from '../../common/CardResource';
import {CardType} from '../../common/cards/CardType';
import {ChooseCards, ChooseOptions, LogType, keep} from './ChooseCards';

export type DrawOptions = {
  tag?: Tag,
  resource?: CardResource,
  cardType?: CardType,
  include?(card: IProjectCard): boolean,
}

export type AllOptions = DrawOptions & ChooseOptions;

export class DrawCards extends DeferredAction<Array<IProjectCard>> {
  // Visible for tests.
  public constructor(
    player: IPlayer,
    public count: number = 1,
    public options: AllOptions = {},
  ) {
    super(player, Priority.DRAW_CARDS);
  }

  public execute(): undefined {
    this.player.game.resettable = false;
    const game = this.player.game;
    const cards = game.projectDeck.drawByCondition(game, this.count, (card) => {
      if (this.options.resource !== undefined && this.options.resource !== card.resourceType) {
        return false;
      }
      if (this.options.cardType !== undefined && this.options.cardType !== card.type) {
        return false;
      }
      if (this.options.tag !== undefined && !this.player.tags.cardHasTag(card, this.options.tag)) {
        return false;
      }
      if (this.options.include !== undefined && !this.options.include(card)) {
        return false;
      }
      return true;
    });

    this.cb(cards);
    return undefined;
  }

  public static keepAll(player: IPlayer, count: number = 1, options?: DrawOptions): DrawCards {
    return new DrawCards(player, count, options).andThen((cards) => {
      let verbosity = LogType.DREW;
      if (options !== undefined) {
        if (options.tag !== undefined ||
          options.resource !== undefined ||
          options.cardType !== undefined ||
          options.include !== undefined) {
          verbosity = LogType.DREW_VERBOSE;
        }
      }
      keep(player, cards, [], verbosity);
    });
  }

  public static keepSome(player: IPlayer, count: number = 1, options: AllOptions): DrawCards {
    return new DrawCards(player, count, options).andThen((cards) => player.game.defer(new ChooseCards(player, cards, options)));
  }
}
