import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {SelectOption} from '../../inputs/SelectOption';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Card, StaticCardProperties} from '../Card';
import {IActionCard} from '../ICard';

export interface Terms {
  from: number,
  to: number,
  limit: number
}

// An abstract base class for SteelMarketMonopolists and TitaniumMarketMonopolists
export abstract class MarketCard extends Card implements IActionCard {
  constructor(
    public readonly tradeResource: Resources,
    public readonly buyingTerms: Terms,
    public readonly sellingTerms: Terms,
    properties: StaticCardProperties) {
    super(properties);
  }

  public play() {
    return undefined;
  }

  private canBuy(player: Player) {
    const availableMC = (player.canUseHeatAsMegaCredits) ? player.megaCredits + player.heat : player.megaCredits;
    return availableMC >= this.buyingTerms.from;
  }

  private canSell(player: Player) {
    return player.getResource(this.tradeResource) >= this.sellingTerms.from;
  }

  public canAct(player: Player): boolean {
    return this.canBuy(player) || this.canSell(player);
  }

  public action(player: Player) {
    const offerBuy = this.canBuy(player);
    const offerSell = this.canSell(player);
    if (offerBuy && offerSell) {
      return new OrOptions(
        new SelectOption(`Buy ${this.tradeResource}`, 'Buy', () => this.getBuyingOption(player)),
        new SelectOption(`Sell ${this.tradeResource}`, 'Sell', () => this.getSellingOption(player)),
      );
    } else if (offerBuy) {
      return this.getBuyingOption(player);
    } else if (offerSell) {
      return this.getSellingOption(player);
    }
    return undefined;
  }

  private getBuyingOption(player: Player): SelectAmount {
    const availableMC = (player.canUseHeatAsMegaCredits) ? player.megaCredits + player.heat : player.megaCredits;
    const terms = this.buyingTerms;
    let limit = Math.floor(availableMC / terms.from);
    limit = Math.min(limit, terms.limit);

    return new SelectAmount(
      `Select a number of trades (${terms.from} M€ => ${terms.to} ${this.tradeResource}, max ${limit})`,
      `Buy ${this.tradeResource}`,
      (tradesRequested: number) => {
        const cashDue = tradesRequested * terms.from;
        const unitsEarned = tradesRequested * terms.to;
        if (player.canUseHeatAsMegaCredits) {
          const howToPay = new SelectHowToPayDeferred(player, cashDue, {afterPay: () => {
            player.addResource(this.tradeResource, unitsEarned);
          }});
          player.game.defer(howToPay);
        } else {
          player.deductResource(Resources.MEGACREDITS, cashDue);
          player.addResource(this.tradeResource, unitsEarned);
        }

        player.game.log('${0} gained ${1} ${2}', (b) => b.player(player).number(tradesRequested).string(this.tradeResource));
        return undefined;
      },
      1,
      limit,
    );
  }

  private getSellingOption(player: Player) {
    const terms = this.sellingTerms;
    if (terms.from !== 1) {
      throw new Error('selling from !== 1 not yet supported.');
    }
    let limit = player.getResource(this.tradeResource);
    limit = Math.min(limit, terms.limit);

    return new SelectAmount(
      `Select a number of trades (${terms.from} ${this.tradeResource} => ${terms.to} M€, max ${limit})`,
      `Sell ${this.tradeResource}`,
      (unitsSold: number) => {
        const cashEarned = unitsSold * terms.to;
        player.addResource(Resources.MEGACREDITS, cashEarned);
        player.deductResource(this.tradeResource, unitsSold);

        player.game.log('${0} sold ${1} ${2}', (b) => b.player(player).number(unitsSold).string(this.tradeResource));
        return undefined;
      },
      1,
      limit,
    );
  }
}
