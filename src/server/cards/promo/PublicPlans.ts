import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {SelectCard} from '../../inputs/SelectCard';
import {Resource} from '../../../common/Resource';

export class PublicPlans extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.PUBLIC_PLANS,
      cost: 7,

      victoryPoints: 1,

      metadata: {
        cardNumber: 'X77',
        renderData: CardRenderer.builder((b) => b.text(
          'REVEAL ANY NUMBER OF OTHER CARDS FROM YOUR HAND. (YOUR OPPONENTS MAY INSPECT THEM.) GAIN 1 M€ FOR EACH REVEALED CARD.',
        )),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    if (player.cardsInHand.length === 0) {
      player.game.log('${0} has no cards to show', (b) => b.player(player));
      return undefined;
    }

    return new SelectCard('Select cards to reveal', undefined, player.cardsInHand, {
      min: 0,
      max: player.cardsInHand.length,
    }).andThen((cards) => {
      player.stock.add(Resource.MEGACREDITS, cards.length, {log: true, from: {card: this}});
      for (const card of cards) {
        player.game.log('${0} revealed ${1}', (b) => b.player(player).card(card));
      }
      return undefined;
    });
  }
}
