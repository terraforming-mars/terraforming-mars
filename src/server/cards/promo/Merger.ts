import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SelectCard} from '../../inputs/SelectCard';
import {Size} from '../../../common/cards/render/Size';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {Dealer} from '../../Dealer';
import {LogHelper} from '../../LogHelper';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CARD_COST} from '../../../common/constants';

export class Merger extends PreludeCard {
  constructor() {
    super({
      name: CardName.MERGER,

      metadata: {
        cardNumber: 'X41',
        renderData: CardRenderer.builder((b) => {
          b.corporation().asterix().nbsp.megacredits(-42, {size: Size.SMALL});
          b.br.br;
        }),
        description: 'Draw 4 corporation cards. Play one of them and discard the other 3. Then pay 42 M€.',
      },
    });
  }

  public static readonly mergerCost = 42;

  public override bespokePlay(player: Player) {
    const game = player.game;
    const dealtCorps = Merger.dealCorporations(player, game.dealer);
    const enabled = dealtCorps.map((corp) => {
      return player.canAfford(Merger.mergerCost - corp.startingMegaCredits);
    });
    if (enabled.some((v) => v === true) === false) {
      game.log('None of the four drawn corporation cards are affordable.');
    }
    game.defer(new SimpleDeferredAction(player, () => {
      return new SelectCard('Choose corporation card to play', 'Play', dealtCorps, ([card]) => {
        player.playAdditionalCorporationCard(card);
        return undefined;
      },
      {enabled: enabled});
    }));
    game.defer(new SelectPaymentDeferred(player, Merger.mergerCost, {title: 'Select how to pay for Merger'}));
    return undefined;
  }

  private static dealCorporations(player: Player, dealer: Dealer) {
    // is this filter necessary?
    const corpsInPlay = player.game.getPlayers().map((p) => p.corporations).reduce((acc, curVal) => acc.concat(curVal), []).map((c) => c.name);
    let candidateCards = dealer.corporationCards.filter((card) => {
      return !corpsInPlay.includes(card.name);
    });

    candidateCards = Dealer.shuffle(candidateCards);
    const cards: Array<ICorporationCard> = [];
    while (cards.length < 4) {
      const card = candidateCards.pop();
      if (card === undefined) break;
      cards.push(card);
    }
    LogHelper.logDrawnCards(player, cards, true);
    return cards;
  }
  public static setCardCost(player: Player) {
    return player.corporations
      .map((card) => (card.cardCost ?? CARD_COST) - CARD_COST) // Convert every card cost to delta from zero. (e.g. -2, 0, +2)
      .reduce((prev, curr) => prev + curr, CARD_COST); // Add them up, and add CARD_COST back.
  }
}
