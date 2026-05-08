import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';

export class IngegneriSpaziali extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.INGEGNERI_SPAZIALI,
      tags: [Tag.SPACE],
      cost: 20,
      victoryPoints: 1,
      metadata: {
        cardNumber: 'B17',
        description: 'Draw the top 10 cards. Put all Space cards into your hand. Each opponent selects one card to keep, in turn. Discard the rest.',
        renderData: CardRenderer.builder((b) => {
          b.cards(10).br;
          b.tag(Tag.SPACE).colon().cards(1).asterix();
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    const game = player.game;
    const drawn = game.projectDeck.drawN(game, 10);
    const spaceCards = drawn.filter((c) => c.tags.includes(Tag.SPACE));
    const rest = drawn.filter((c) => !c.tags.includes(Tag.SPACE));
    spaceCards.forEach((c) => player.cardsInHand.push(c));
    // TODO: use deferred actions so each opponent interactively picks one card
    const opponents = game.players.filter((p) => p !== player);
    const remaining = [...rest];
    for (const opp of opponents) {
      if (remaining.length === 0) break;
      opp.cardsInHand.push(remaining.shift()!);
    }
    remaining.forEach((c) => game.projectDeck.discard(c));
    return undefined;
  }
}
