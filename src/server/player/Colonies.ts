import {MAX_FLEET_SIZE} from '../../common/constants';
import {CardName} from '../../common/cards/CardName';
import {ColoniesHandler} from '../colonies/ColoniesHandler';
import {AndOptions} from '../inputs/AndOptions';
import {Player} from '../Player';
import {ENERGY_TRADE_COST, MAX_COLONIES_PER_TILE, MC_TRADE_COST, TITANIUM_TRADE_COST} from '../../common/constants';
import {IColony} from '../colonies/IColony';
import {SelectPaymentDeferred} from '../deferredActions/SelectPaymentDeferred';
import {Resources} from '../../common/Resources';
import {TradeWithTitanFloatingLaunchPad} from '../cards/colonies/TitanFloatingLaunchPad';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {SelectColony} from '../inputs/SelectColony';
import {IColonyTrader} from '../colonies/IColonyTrader';
import {TradeWithCollegiumCopernicus} from '../cards/pathfinders/CollegiumCopernicus';
import {VictoryPointsBreakdown} from '../VictoryPointsBreakdown';

export class Colonies {
  private player: Player;

  // Each ship in the player's fleet allows a single trade.
  private fleetSize: number = 1;
  public tradesThisGeneration: number = 0;
  // When trading you may increase the Colony track this many steps.
  public tradeOffset: number = 0;

  // When trading you many use this many fewer resources of the trading type.
  public tradeDiscount: number = 0;

  public victoryPoints: number = 0; // Titania Colony VP
  public cardDiscount: number = 0; // Iapetus Colony

  constructor(player: Player) {
    this.player = player;
  }

  public canTrade() {
    return ColoniesHandler.tradeableColonies(this.player.game).length > 0 &&
      this.getFleetSize() > this.tradesThisGeneration;
  }

  public coloniesTradeAction(): AndOptions | undefined {
    const game = this.player.game;
    if (game.gameOptions.coloniesExtension) {
      const openColonies = ColoniesHandler.tradeableColonies(game);
      if (openColonies.length > 0 &&
        this.fleetSize > this.tradesThisGeneration) {
        return this.tradeWithColony(openColonies);
      }
    }
    return undefined;
  }

  private tradeWithColony(openColonies: Array<IColony>): AndOptions | undefined {
    const player = this.player;
    const handlers = [
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
          handler.optionText(), '', () => {
            selected = handler;
            return undefined;
          }));
      }
    });

    if (howToPayForTrade.options.length === 0) {
      return undefined;
    }

    const selectColony = new SelectColony('Select colony tile for trade', 'trade', openColonies, (colony: IColony) => {
      if (selected === undefined) {
        throw new Error(`Unexpected condition: no trade funding source selected when trading with ${colony.name}.`);
      }
      selected.trade(colony);
      return undefined;
    });

    const trade = new AndOptions(
      () => {
        return undefined;
      },
      howToPayForTrade,
      selectColony,
    );

    trade.title = 'Trade with a colony tile';
    trade.buttonLabel = 'Trade';

    return trade;
  }

  public getPlayableColonies(allowDuplicate: boolean = false) {
    if (this.player.game.gameOptions.coloniesExtension === false) return [];

    return this.player.game.colonies
      .filter((colony) => colony.isActive)
      .filter((colony) => colony.colonies.length < MAX_COLONIES_PER_TILE)
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

  constructor(private player: Player) {
    this.tradeCost = ENERGY_TRADE_COST - player.colonies.tradeDiscount;
  }

  public canUse() {
    return this.player.energy >= this.tradeCost;
  }
  public optionText() {
    return 'Pay ' + this.tradeCost +' Energy';
  }

  public trade(colony: IColony) {
    this.player.deductResource(Resources.ENERGY, this.tradeCost);
    this.player.game.log('${0} spent ${1} energy to trade with ${2}', (b) => b.player(this.player).number(this.tradeCost).colony(colony));
    colony.trade(this.player);
  }
}

export class TradeWithTitanium implements IColonyTrader {
  private tradeCost;

  constructor(private player: Player) {
    this.tradeCost = TITANIUM_TRADE_COST - player.colonies.tradeDiscount;
  }

  public canUse() {
    return this.player.titanium >= this.tradeCost;
  }
  public optionText() {
    return 'Pay ' + this.tradeCost +' Titanium';
  }

  public trade(colony: IColony) {
    this.player.deductResource(Resources.TITANIUM, this.tradeCost);
    this.player.game.log('${0} spent ${1} titanium to trade with ${2}', (b) => b.player(this.player).number(this.tradeCost).colony(colony));
    colony.trade(this.player);
  }
}


export class TradeWithMegacredits implements IColonyTrader {
  private tradeCost;

  constructor(private player: Player) {
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
    return 'Pay ' + this.tradeCost +' M€';
  }

  public trade(colony: IColony) {
    this.player.game.defer(new SelectPaymentDeferred(
      this.player,
      this.tradeCost,
      {
        title: 'Select how to pay ' + this.tradeCost + ' for colony trade',
        afterPay: () => {
          this.player.game.log('${0} spent ${1} M€ to trade with ${2}', (b) => b.player(this.player).number(this.tradeCost).colony(colony));
          colony.trade(this.player);
        },
      },
    ));
  }
}
