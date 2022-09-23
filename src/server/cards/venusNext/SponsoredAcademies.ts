import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {Priority} from '../../deferredActions/DeferredAction';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {CardRenderer} from '../render/CardRenderer';
import {DrawCards} from '../../deferredActions/DrawCards';
import {Card} from '../Card';
import {all, digit} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class SponsoredAcademies extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SPONSORED_ACADEMIES,
      cardType: CardType.AUTOMATED,
      tags: [Tag.EARTH, Tag.SCIENCE],
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
  public override bespokeCanPlay(player: Player): boolean {
    return player.cardsInHand.length > 1; // this card and at least another
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new DiscardCards(player), Priority.SPONSORED_ACADEMIES);
    player.game.defer(DrawCards.keepAll(player, 3), Priority.SPONSORED_ACADEMIES);
    const otherPlayers = player.game.getPlayers().filter((p) => p.id !== player.id);
    for (const p of otherPlayers) {
      player.game.defer(DrawCards.keepAll(p));
    }
    return undefined;
  }
}
