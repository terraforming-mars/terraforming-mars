import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {SelectAmount} from '../../inputs/SelectAmount';

export class CompanyRestructuring extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.COMPANY_RESTRUCTURING,
      tags: [Tag.EARTH],
      cost: 8,
      victoryPoints: 1,
      metadata: {
        cardNumber: 'B38',
        description: 'Discard any number of cards and get 3 M€ each. Opponents can do the same and get 2 M€ each.',
        renderData: CardRenderer.builder((b) => {
          b.cards(-1).colon().megacredits(3).br;
          b.cards(-1).colon().megacredits(2);
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    if (player.cardsInHand.length === 0) return undefined;
    return new SelectAmount('How many cards to discard for 3 M€ each?', 'Discard', 0, player.cardsInHand.length)
      .andThen((count) => {
        for (let i = 0; i < count; i++) {
          player.game.projectDeck.discard(player.cardsInHand.pop()!);
        }
        player.stock.add(Resource.MEGACREDITS, count * 3, {log: true});
        // TODO: deferred OrOptions for each opponent to optionally discard for 2 M€ each
        return undefined;
      });
  }
}
