import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tags} from '../../../common/cards/Tags';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {IActionCard} from '../ICard';
import {Size} from '../../../common/cards/render/Size';

export class Odyssey extends Card implements ICorporationCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.ODYSSEY,
      startingMegaCredits: 33,

      metadata: {
        cardNumber: 'PfC18',
        description: 'You start with 33 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br.br.br.br.megacredits(33).nbsp.nbsp.nbsp;
          b.colon().cards(1, {secondaryTag: Tags.EVENT}).asterix().br;
          b.text('(Effect: Your event cards stay face up, and their tags are in use as if those were automated (green) cards.)',
            Size.TINY, false, false).br;
          b.action('Pay for and play an event card you have already played that has a base cost of 16M€ or less, after which discard that card.', (e) => {
            e.empty().startAction.event({played}).asterix().nbsp.text('≤').nbsp.megacredits(16);
          });
        }),
      },
    });
  }

  public availableEventCards(player: Player) {
    return player.playedCards.filter((card) => {
      return card.cardType === CardType.EVENT &&
        card.cost <= 16 &&
        player.canPlay(card);
    });
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player) {
    return this.availableEventCards(player).length > 0;
  }

  public action(player: Player) {
    const eventCards = this.availableEventCards(player);
    return player.getPlayProjectCardInput(eventCards, 'discard');
  }
}
