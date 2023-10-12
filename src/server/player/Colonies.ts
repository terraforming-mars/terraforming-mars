import {MAX_FLEET_SIZE} from '../../common/constants';
import {CardName} from '../../common/cards/CardName';
import {ColoniesHandler} from '../colonies/ColoniesHandler';
import {AndOptions} from '../inputs/AndOptions';
import {IPlayer} from '../IPlayer';
import {ENERGY_TRADE_COST, MC_TRADE_COST, TITANIUM_TRADE_COST} from '../../common/constants';
import {IColony} from '../colonies/IColony';
import {SelectPaymentDeferred} from '../deferredActions/SelectPaymentDeferred';
import {Resource} from '../../common/Resource';
import {TradeWithTitanFloatingLaunchPad} from '../cards/colonies/TitanFloatingLaunchPad';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {SelectColony} from '../inputs/SelectColony';
import {IColonyTrader} from '../colonies/IColonyTrader';
import {TradeWithCollegiumCopernicus} from '../cards/pathfinders/CollegiumCopernicus';
import {VictoryPointsBreakdown} from '../game/VictoryPointsBreakdown';
import {newMessage} from '../logs/MessageBuilder';
import {TradeWithDarksideSmugglersUnion} from '../cards/moon/DarksideSmugglersUnion';
import {Payment} from '../../common/inputs/Payment';

export class Colonies {
  private player: IPlayer;

  // Each ship in the player's fleet allows a single trade.
  private fleetSize: number = 1;
  public tradesThisGeneration: number = 0;
  // When trading you may increase the Colony track this many steps.
  public tradeOffset: number = 0;

  // When trading you many use this many fewer resources of the trading type.
  public tradeDiscount: number = 0;

  public victoryPoints: number = 0; // Titania Colony VP
  public cardDiscount: number = 0; // Iapetus Colony

  constructor(player: IPlayer) {
    this.player = player;
  }

  /**
   * Returns `true` if this player can execute a trade.
   */
  public canTrade() {
    return ColoniesHandler.tradeableColonies(this.player.game).length > 0 &&
      this.getFleetSize() > this.tradesThisGeneration &&
      this.player.game.tradeEmbargo !== true;
  }

  public coloniesTradeAction(): AndOptions | undefined {
    const game = this.player.game;
    if (game.gameOptions.coloniesExtension && this.canTrade()) {
      return this.tradeWithColony(ColoniesHandler.tradeableColonies(game));
    }
    return undefined;
  }

  private tradeWithColony(openColonies: Array<IColony>): AndOptions | undefined {
    const player = this.player;
    const handlers = [
      new TradeWithDarksideSmugglersUnion(player),
      new TradeWithTitanFloatingLaunchPad(player),
      new TradeWithCollegiumCopernicus(player),
      new TradeWithEnergy(player),
      new TradeWithTitanium(player),
      new TradeWithMegacredits(player),
    ];

    let selected: IColonyTrader | undefined = undefined;

    const howToPayForTrade = new OrOptions();
    howToPayForTrade.title = 'Pay trade fee';
    howToPayForTrade.buttonLabel = 'Pay';
    handlers.forEach((handler) => {
      if (handler.canUse()) {
        howToPayForTrade.options.push(new SelectOption(
          handler.optionText()).andThen(() => {
          selected = handler;
          return undefined;
        }));
      }
    });

    if (howToPayForTrade.options.length === 0) {
      return undefined;
    }

    const selectColony = new SelectColony('Select colony tile for trade', 'trade', openColonies)
      .andThen((colony) => {
        if (selected === undefined) {
          throw new Error(`Unexpected condition: no trade funding source selected when trading with ${colony.name}.`);
        }
        selected.trade(colony);
        return undefined;
      });

    const trade = new AndOptions(howToPayForTrade, selectColony);
    trade.title = 'Trade with a colony tile';
    trade.buttonLabel = 'Trade';

    return trade;
  }

  public getPlayableColonies(allowDuplicate: boolean = false) {
    return this.player.game.colonies
      .filter((colony) => colony.isActive && !colony.isFull())
      .filter((colony) => allowDuplicate || !colony.colonies.includes(this.player.id));
  }

  public calculateVictoryPoints(victoryPointsBreakdown: VictoryPointsBreakdown) {
    // Titania Colony VP
    if (this.player.colonies.victoryPoints > 0) {
      victoryPointsBreakdown.setVictoryPoints('victoryPoints', this.victoryPoints, 'Colony VP');
    }
  }

  public getFleetSize(): number {
    return this.fleetSize;
  }

  public increaseFleetSize(): void {
    if (this.fleetSize < MAX_FLEET_SIZE) this.fleetSize++;
  }

  public decreaseFleetSize(): void {
    // This fleet size management is a little tricky, because with The Moon, it's possible to
    // have more fleets than MAX_FLEET_SIZE which are then discarded.
    if (this.fleetSize > 0) this.fleetSize--;
  }

  public setFleetSize(fleetSize: number) {
    this.fleetSize = fleetSize;
  }

  public returnTradeFleets(): void {
    const syndicatePirateRaider = this.player.game.syndicatePirateRaider;
    // Syndicate Pirate Raids hook. If it is in effect, then only the syndicate pirate raider will
    // retrieve their fleets.
    // See Colony.ts for the other half of this effect, and Game.ts which disables it.
    if (syndicatePirateRaider === undefined) {
      this.tradesThisGeneration = 0;
    } else if (syndicatePirateRaider === this.player.id) {
      this.tradesThisGeneration = 0;
    }
  }
}

export class TradeWithEnergy implements IColonyTrader {
  private tradeCost;

  constructor(private player: IPlayer) {
    this.tradeCost = ENERGY_TRADE_COST - player.colonies.tradeDiscount;
  }

  public canUse() {
    return this.player.energy >= this.tradeCost;
  }
  public optionText() {
    return newMessage('Pay ${0} energy', (b) => b.number(this.tradeCost));
  }

  public trade(colony: IColony) {
    this.player.stock.deduct(Resource.ENERGY, this.tradeCost);
    this.player.game.log('${0} spent ${1} energy to trade with ${2}', (b) => b.player(this.player).number(this.tradeCost).colony(colony));
    colony.trade(this.player);
  }
}

export class TradeWithTitanium implements IColonyTrader {
  private tradeCost;

  constructor(private player: IPlayer) {
    this.tradeCost = TITANIUM_TRADE_COST - player.colonies.tradeDiscount;
  }

  public canUse() {
    return this.player.titanium >= this.tradeCost;
  }
  public optionText() {
    return newMessage('Pay ${0} titanium', (b) => b.number(this.tradeCost));
  }

  public trade(colony: IColony) {
    this.player.pay(Payment.of({titanium: this.tradeCost}));
    this.player.game.log('${0} spent ${1} titanium to trade with ${2}', (b) => b.player(this.player).number(this.tradeCost).colony(colony));
    colony.trade(this.player);
  }
}


export class TradeWithMegacredits implements IColonyTrader {
  private tradeCost;

  constructor(private player: IPlayer) {
    this.tradeCost = MC_TRADE_COST- player.colonies.tradeDiscount;
    const adhai = player.getCorporation(CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS);
    if (adhai !== undefined) {
      const adhaiDiscount = Math.floor(adhai.resourceCount / 2);
      this.tradeCost = Math.max(0, this.tradeCost - adhaiDiscount);
    }
  }

  public canUse() {
    return this.player.canAfford(this.tradeCost);
  }
  public optionText() {
    return newMessage('Pay ${0} M€', (b) => b.number(this.tradeCost));
  }

  public trade(colony: IColony) {
    this.player.game.defer(new SelectPaymentDeferred(this.player, this.tradeCost,
      {title: newMessage('Select how to pay ${0} for colony trade', (b) => b.number(this.tradeCost))}))
      .andThen(() => {
        this.player.game.log('${0} spent ${1} M€ to trade with ${2}', (b) => b.player(this.player).number(this.tradeCost).colony(colony));
        colony.trade(this.player);
      });
  }
}
