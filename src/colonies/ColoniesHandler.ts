import {ENERGY_TRADE_COST, MC_TRADE_COST, TITANIUM_TRADE_COST} from '../common/constants';
import {Game} from '../Game';
import {Player} from '../Player';
import {Colony} from './Colony';
import {ColonyName} from '../common/colonies/ColonyName';
import {SelectHowToPayDeferred} from '../deferredActions/SelectHowToPayDeferred';
import {Resources} from '../common/Resources';
import {TradeWithTitanFloatingLaunchPad} from '../cards/colonies/TitanFloatingLaunchPad';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {SelectColony} from '../inputs/SelectColony';
import {AndOptions} from '../inputs/AndOptions';
import {IColonyTrader} from './IColonyTrader';
import {TradeWithCollegiumCopernicus} from '../cards/pathfinders/CollegiumCopernicus';
import {CardName} from '../common/cards/CardName';

export class ColoniesHandler {
  public static getColony(game: Game, colonyName: ColonyName, includeDiscardedColonies: boolean = false): Colony {
    let colony = game.colonies.find((c) => c.name === colonyName);
    if (colony !== undefined) return colony;
    if (includeDiscardedColonies === true && game.colonyDealer !== undefined) {
      colony = game.colonyDealer.discardedColonies.find((c) => c.name === colonyName);
      if (colony !== undefined) return colony;
    }
    throw new Error(`Unknown colony '${colonyName}'`);
  }

  public static tradeableColonies(game: Game) {
    return game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);
  }
  public static canTrade(player: Player) {
    return ColoniesHandler.tradeableColonies(player.game).length > 0 &&
      player.getFleetSize() > player.tradesThisGeneration;
  }

  public static coloniesTradeAction(player: Player): AndOptions | undefined {
    if (player.game.gameOptions.coloniesExtension) {
      const openColonies = this.tradeableColonies(player.game);
      if (openColonies.length > 0 &&
        player.getFleetSize() > player.tradesThisGeneration) {
        return ColoniesHandler.tradeWithColony(player, openColonies);
      }
    }
    return undefined;
  }

  private static tradeWithColony(player: Player, openColonies: Array<Colony>): AndOptions | undefined {
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

    const selectColony = new SelectColony('Select colony tile for trade', 'trade', openColonies, (colony: Colony) => {
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
}

export class TradeWithEnergy implements IColonyTrader {
  private tradeCost;

  constructor(private player: Player) {
    this.tradeCost = ENERGY_TRADE_COST - player.colonyTradeDiscount;
  }

  public canUse() {
    return this.player.energy >= this.tradeCost;
  }
  public optionText() {
    return 'Pay ' + this.tradeCost +' Energy';
  }

  public trade(colony: Colony) {
    this.player.deductResource(Resources.ENERGY, this.tradeCost);
    this.player.game.log('${0} spent ${1} energy to trade with ${2}', (b) => b.player(this.player).number(this.tradeCost).colony(colony));
    colony.trade(this.player);
  }
}

export class TradeWithTitanium implements IColonyTrader {
  private tradeCost;

  constructor(private player: Player) {
    this.tradeCost = TITANIUM_TRADE_COST - player.colonyTradeDiscount;
  }

  public canUse() {
    return this.player.titanium >= this.tradeCost;
  }
  public optionText() {
    return 'Pay ' + this.tradeCost +' Titanium';
  }

  public trade(colony: Colony) {
    this.player.deductResource(Resources.TITANIUM, this.tradeCost);
    this.player.game.log('${0} spent ${1} titanium to trade with ${2}', (b) => b.player(this.player).number(this.tradeCost).colony(colony));
    colony.trade(this.player);
  }
}


export class TradeWithMegacredits implements IColonyTrader {
  private tradeCost;

  constructor(private player: Player) {
    this.tradeCost = MC_TRADE_COST- player.colonyTradeDiscount;
    if (player.isCorporation(CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS)) {
      const adhaiDiscount = Math.floor((player.corporationCard?.resourceCount || 0) / 2);
      this.tradeCost = Math.max(0, this.tradeCost - adhaiDiscount);
    }
  }

  public canUse() {
    return this.player.canAfford(this.tradeCost);
  }
  public optionText() {
    return 'Pay ' + this.tradeCost +' M€';
  }

  public trade(colony: Colony) {
    this.player.game.defer(new SelectHowToPayDeferred(
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
