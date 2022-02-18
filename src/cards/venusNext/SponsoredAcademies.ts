import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {Priority} from '../../deferredActions/DeferredAction';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {CardRenderer} from '../render/CardRenderer';
import {DrawCards} from '../../deferredActions/DrawCards';
import {Card} from '../Card';
import {all, digit} from '../Options';

export class SponsoredAcademies extends Card {
  constructor() {
    super({
      name: CardName.SPONSORED_ACADEMIES,
      cardType: CardType.AUTOMATED,
      tags: [Tags.EARTH, Tags.SCIENCE],
      cost: 9,

      victoryPoints: 1,

      metadata: {
        cardNumber: '247',
        renderData: CardRenderer.builder((b) => {
          b.minus().cards(1).br;
          b.plus().cards(3, {digit}).asterix().nbsp.plus().cards(1, {all}).asterix();
        }),
        description: 'Discard 1 card from your hand and THEN draw 3 cards. All OPPONENTS draw 1 card.',
      },
    });
  }
  public override canPlay(player: Player): boolean {
    return player.cardsInHand.length > 1; // this card and at least another
  }

  public play(player: Player) {
    player.game.defer(new DiscardCards(player), Priority.DISCARD_BEFORE_DRAW);
    player.game.defer(DrawCards.keepAll(player, 3));
    const otherPlayers = player.game.getPlayersInGenerationOrder().filter((p) => p.id !== player.id);
    for (const p of otherPlayers) {
      player.game.defer(DrawCards.keepAll(p));
    }
    return undefined;
  }
}
