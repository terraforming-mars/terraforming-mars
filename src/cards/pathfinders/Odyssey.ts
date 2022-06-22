import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';
import {SelectCard} from '../../inputs/SelectCard';
import {Priority} from '../../deferredActions/DeferredAction';
import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {Size} from '../../common/cards/render/Size';

export class Odyssey extends Card implements ICorporationCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.ODYSSEY,
      startingMegaCredits: 33,

      metadata: {
        cardNumber: 'PfC18',
        description: 'You start with 33 M€',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br.br.br.br.megacredits(33).nbsp.nbsp.nbsp;
          b.colon().cards(1, {secondaryTag: Tags.EVENT}).asterix().br;
          b.text('(Effect: Your event cards stay face up, and their tags are in use as if the event was an automated card.)',
            Size.TINY, false, false).br;
          b.action('You may play an event card you have already played that costs 16MC or less, after which, discard that card.', (e) => {
            e.empty().startAction.event({played}).asterix().text('<=16');
          });
        }),
      },
    });
  }

  public availableEventCards(player: Player) {
    return player.playedCards.filter((card) => card.cardType === CardType.EVENT && card.cost <= 16);
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player) {
    return this.availableEventCards(player).length > 0;
  }

  public action(player: Player) {
    return new SelectCard(
      'Select an event card to replay, and then discard',
      'Play',
      this.availableEventCards(player),
      (cards) => {
        const card = cards[0];
        player.game.log('${0} is replaying ${1}', (b) => b.player(player).card(card));
        player.defer(card.play(player), Priority.DEFAULT);
        this.discard(player, card);
        return undefined;
      },
    );
  }

  private discard(player: Player, card: IProjectCard) {
    // This is copied straight out of Project Workshop.
    const cardIndex = player.playedCards.findIndex((c) => c.name === card.name);
    player.playedCards.splice(cardIndex, 1);
    player.game.dealer.discard(card);

    if (card.onDiscard) {
      card.onDiscard(player);
    }

    player.game.log('${0} discarded ${1}', (b) => b.player(player).card(card));
  }
}
