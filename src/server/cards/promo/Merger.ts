import {IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {SelectCard} from '../../inputs/SelectCard';
import {Size} from '../../../common/cards/render/Size';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {LogHelper} from '../../LogHelper';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CARD_COST} from '../../../common/constants';
import {CorporationDeck} from '../Deck';
import {Countable} from '../../behavior/Countable';
import {PreludesExpansion} from '../../preludes/PreludesExpansion';

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

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    const dealtCorps = Merger.dealCorporations(player, game.corporationDeck);
    LogHelper.logDrawnCards(player, dealtCorps, true);
    const enabled = dealtCorps.map((corp) => {
      return player.canAfford(Merger.mergerCost - this.spendableMegacredits(player, corp));
    });
    if (enabled.some((v) => v === true) === false) {
      PreludesExpansion.fizzle(player, this);
      dealtCorps.forEach((corp) => game.corporationDeck.discard(corp));
      return undefined;
    }
    game.defer(new SimpleDeferredAction(player, () => {
      return new SelectCard('Choose corporation card to play', 'Play', dealtCorps, {enabled: enabled})
        .andThen(([card]) => {
          player.playAdditionalCorporationCard(card);
          dealtCorps.forEach((corp) => {
            if (corp.name !== card.name) {
              game.corporationDeck.discard(corp);
            }
          });
          game.defer(new SelectPaymentDeferred(player, Merger.mergerCost, {title: 'Select how to pay for Merger'}));
          return undefined;
        });
    }));
    return undefined;
  }

  private static dealCorporations(player: IPlayer, corporationDeck: CorporationDeck) {
    const cards: Array<ICorporationCard> = [];
    try {
      while (cards.length < 4) {
        cards.push(corporationDeck.draw(player.game));
      }
    } catch (err) {
      // Error will only occur if the deck is empty. That won't happen, but here we'll just do our best.
      player.game.log('Not enough corporations while resolving ${0}', (b) => b.cardName(CardName.MERGER));
    }
    LogHelper.logDrawnCards(player, cards, /* privateMessage= */true);
    return cards;
  }
  public static setCardCost(player: IPlayer) {
    return player.corporations
      .map((card) => (card.cardCost ?? CARD_COST) - CARD_COST) // Convert every card cost to delta from zero. (e.g. -2, 0, +2)
      .reduce((prev, curr) => prev + curr, CARD_COST); // Add them up, and add CARD_COST back.
  }


  // Returns the delta of spendable MC made avialable by a merged corporation.
  // Much of this code is similar to Player.spendableMegaCredits, but that can't
  // be used since corp is not yet part of player's tableau.
  //
  // Spendable Megacredits matter if:
  //
  // Player has Manutech and incoming cards add MC, heat, or titanium production
  // TO DO: Player has LTF and incoming card raises titanium value (e.g. Phobolog)
  // TO DO: Player has LTF and incoming card adds titanium
  // No use cases coded yet, but player has UNMO and incoming card raises TR.
  private spendableMegacredits(player: IPlayer, corp: ICorporationCard) {
    // short-circuit. No need for all the work below if the card
    // comes with enough MC.
    if (corp.startingMegaCredits >= Merger.mergerCost) {
      return corp.startingMegaCredits;
    }
    const behavior = corp.behavior;
    const stock = behavior?.stock;
    const production = behavior?.production;
    let sum = corp.startingMegaCredits;

    // Used to filter down anything of type Countable.
    const asNumber = (x: Countable | undefined) => typeof(x) === 'number' ? x : 0;

    let incomingTitanium = asNumber(stock?.titanium);
    // const titaniumValue = player.getTitaniumValue() + (behavior?.titanumValue ?? 0);
    const titaniumValue = player.getTitaniumValue();

    if (player.isCorporation(CardName.MANUTECH)) {
      sum += asNumber(production?.megacredits);
      incomingTitanium += asNumber(production?.titanium);
    }
    if (corp.name === CardName.LUNA_TRADE_FEDERATION || player.isCorporation(CardName.LUNA_TRADE_FEDERATION)) {
      sum += (player.titanium + incomingTitanium) * (titaniumValue - 1);
    }

    return sum;
  }
}
