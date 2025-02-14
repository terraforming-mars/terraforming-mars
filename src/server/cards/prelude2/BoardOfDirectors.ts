import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IActionCard} from '../ICard';
import {PreludeCard} from '../prelude/PreludeCard';
import {IPlayer} from '../../IPlayer';
import {SelectCard} from '../../inputs/SelectCard';
import {message} from '../../logs/MessageBuilder';
import {PreludesExpansion} from '../../preludes/PreludesExpansion';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {IPreludeCard} from '../prelude/IPreludeCard';

export class BoardOfDirectors extends PreludeCard implements IActionCard {
  constructor() {
    super({
      name: CardName.BOARD_OF_DIRECTORS,
      tags: [Tag.EARTH],
      resourceType: CardResource.DIRECTOR,

      behavior: {
        addResources: 4,
      },

      metadata: {
        cardNumber: 'P45',
        renderData: CardRenderer.builder((b) => {
          b.plainText('ACTION: ').arrow().br;
          b.plainText('DRAW 1 PRELUDE CARD: EITHER DISCARD IT, OR PAY 12 M€ AND REMOVE 1 DIRECTOR RESOURCE HERE TO PLAY IT.').br;
          b.resource(CardResource.DIRECTOR, 4);
        }),
        description: 'Add 4 director resources here.',
      },
    });
  }

  public canAct(player: IPlayer) {
    if (!player.canAfford(12)) {
      this.warnings.add('cannotAffordBoardOfDirectors');
    }
    return this.resourceCount > 0 && player.game.preludeDeck.canDraw(1);
  }

  private discard(player: IPlayer, prelude: IPreludeCard) {
    const game = player.game;
    game.log('${0} drew and discarded a prelude', (b) => b.player(player));
    game.log('You drew and discarded ${0}', (b) => b.card(prelude), {reservedFor: player});
    game.preludeDeck.discard(prelude);
  }

  public action(player: IPlayer) {
    const game = player.game;
    const prelude = game.preludeDeck.drawOrThrow(player.game);

    if (player.canAfford(12)) {
      if (prelude.canPlay?.(player, {cost: 12}) === false) {
        prelude.warnings.add('preludeFizzle');
      }

      return new SelectCard(
        message('Would you like pay 12 M€ and one Director to play ${0}', (b)=> b.card(prelude)),
        'Buy', [prelude], {min: 0, max: 1}).andThen((selected) => {
        if (selected.length === 1) {
          const card = selected[0];
          game.defer(new SelectPaymentDeferred(player, 12, {title: 'Select how to pay 12 M€'})).andThen(() => {
            player.removeResourceFrom(this, 1);
            if (card.canPlay?.(player) === false) {
              PreludesExpansion.fizzle(player, card);
            } else {
              player.playCard(card, undefined, 'add');
            }
            return undefined;
          });
        } else {
          this.discard(player, prelude);
        }
        return undefined;
      });
    } else {
      this.discard(player, prelude);
    }

    return undefined;
  }
}
