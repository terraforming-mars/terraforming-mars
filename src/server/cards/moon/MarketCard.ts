import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {SelectOption} from '../../inputs/SelectOption';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {Card, StaticCardProperties} from '../Card';
import {IActionCard} from '../ICard';
import {newMessage} from '../../logs/MessageBuilder';
import {PathfindersExpansion} from '../..//pathfinders/PathfindersExpansion';

export interface Terms {
  from: number,
  to: number,
  limit: number
}

// An abstract base class for SteelMarketMonopolists and TitaniumMarketMonopolists
export abstract class MarketCard extends Card implements IActionCard {
  constructor(
    public readonly tradeResource: Resource,
    public readonly buyingTerms: Terms,
    public readonly sellingTerms: Terms,
    properties: StaticCardProperties) {
    super(properties);
  }

  private canBuy(player: IPlayer) {
    return player.spendableMegacredits() >= this.buyingTerms.from;
  }

  private canSell(player: IPlayer) {
    return player.stock.get(this.tradeResource) >= this.sellingTerms.from;
  }

  public canAct(player: IPlayer): boolean {
    return this.canBuy(player) || this.canSell(player);
  }

  public action(player: IPlayer) {
    const offerBuy = this.canBuy(player);
    const offerSell = this.canSell(player);
    if (offerBuy && offerSell) {
      return new OrOptions(
        new SelectOption(newMessage('Buy ${0}', (b) => b.string(this.tradeResource)), 'Buy').andThen(() => this.getBuyingOption(player)),
        new SelectOption(newMessage('Sell ${0}', (b) => b.string(this.tradeResource)), 'Sell').andThen(() => this.getSellingOption(player)),
      );
    } else if (offerBuy) {
      return this.getBuyingOption(player);
    } else if (offerSell) {
      return this.getSellingOption(player);
    }
    return undefined;
  }

  private getBuyingOption(player: IPlayer): SelectAmount {
    const availableMC = player.spendableMegacredits();
    const terms = this.buyingTerms;
    let limit = Math.floor(availableMC / terms.from);
    limit = Math.min(limit, terms.limit);

    // TODO(kberg): use Messages.
    return new SelectAmount(
      newMessage(
        'Select a number of trades (${terms.from} M€ => ${terms.to} ${this.tradeResource}, max ${limit})',
        (b) => b.number(terms.from).number(terms.to).string(this.tradeResource).number(limit)),
      `Buy ${this.tradeResource}`,
      1,
      limit,
    ).andThen( (tradesRequested: number) => {
      const cashDue = tradesRequested * terms.from;
      const unitsEarned = tradesRequested * terms.to;
      player.game.defer(new SelectPaymentDeferred(player, cashDue))
        .andThen(() => player.stock.add(this.tradeResource, unitsEarned, {log: true}));
      return undefined;
    });
  }

  private getSellingOption(player: IPlayer) {
    const terms = this.sellingTerms;
    if (terms.from !== 1) {
      throw new Error('selling from !== 1 not yet supported.');
    }
    let limit = player.stock.get(this.tradeResource);
    limit = Math.min(limit, terms.limit);

    // TODO(kberg): use Messages.
    return new SelectAmount(
      `Select a number of trades (${terms.from} ${this.tradeResource} => ${terms.to} M€, max ${limit})`,
      `Sell ${this.tradeResource}`, 1, limit,
    ).andThen((unitsSold: number) => {
      const cashEarned = unitsSold * terms.to;
      player.stock.add(Resource.MEGACREDITS, cashEarned);
      player.stock.deduct(this.tradeResource, unitsSold);
      PathfindersExpansion.addToSolBank(player);

      player.game.log('${0} sold ${1} ${2}', (b) => b.player(player).number(unitsSold).string(this.tradeResource));
      return undefined;
    });
  }
}
