import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SelectCard} from '../../inputs/SelectCard';
import {Size} from '../../../common/cards/render/Size';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {Dealer} from '../../Dealer';
import {LogHelper} from '../../LogHelper';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CARD_COST} from '../../../common/constants';
import {ColoniesHandler} from '../../colonies/ColoniesHandler';

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

  private static mergerCost = 42;

  public play(player: Player) {
    const game = player.game;
    const dealtCorps = Merger.dealCorporations(player, game.dealer);
    const availableCorps = dealtCorps.filter((corp) => {
      const balance = Merger.mergerCost - corp.startingMegaCredits;
      return player.canAfford(balance);
    });
    if (availableCorps.length === 0) {
      return undefined;
    }
    game.defer(new SimpleDeferredAction(player, () => {
      return new SelectCard('Choose corporation card to play', 'Play', availableCorps, ([card]) => {
        Merger.playSecondCorporationCard(player, card);
        return undefined;
      });
    }));
    game.defer(new SelectHowToPayDeferred(player, Merger.mergerCost, {title: 'Select how to pay for prelude'}));
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

  public static playSecondCorporationCard(player: Player, corporationCard: ICorporationCard) {
    player.corporations.push(corporationCard);
    player.megaCredits += corporationCard.startingMegaCredits;
    Merger.setCardCostIfNeeded(player, corporationCard);
    corporationCard.play(player);
    if (corporationCard.initialAction !== undefined) {
      player.pendingInitialActions.push(corporationCard);
    }
    player.game.log('${0} played ${1}', (b) => b.player(player).card(corporationCard));
    player.game.triggerOtherCorpEffects(player, corporationCard);
    ColoniesHandler.onCardPlayed(player.game, corporationCard);
  }

  private static setCardCostIfNeeded(player: Player, corporationCard: ICorporationCard) {
    const corpNames = player.corporations.map((corp) => corp.name);
    if (corporationCard.cardCost !== undefined) {
      if (corpNames.includes(CardName.TERRALABS_RESEARCH) && corpNames.includes(CardName.POLYPHEMOS)) {
        player.cardCost = CARD_COST;
      } else {
        player.cardCost = corporationCard.cardCost;
      }
    }
  }
}
