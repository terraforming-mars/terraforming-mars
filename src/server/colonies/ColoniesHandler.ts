import {ENERGY_TRADE_COST, MAX_COLONIES_PER_TILE, MC_TRADE_COST, TITANIUM_TRADE_COST} from '../../common/constants';
import {Game} from '../Game';
import {Player} from '../Player';
import {IColony} from './IColony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {SelectPaymentDeferred} from '../deferredActions/SelectPaymentDeferred';
import {Resources} from '../../common/Resources';
import {TradeWithTitanFloatingLaunchPad} from '../cards/colonies/TitanFloatingLaunchPad';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {SelectColony} from '../inputs/SelectColony';
import {AndOptions} from '../inputs/AndOptions';
import {IColonyTrader} from './IColonyTrader';
import {TradeWithCollegiumCopernicus} from '../cards/pathfinders/CollegiumCopernicus';
import {CardName} from '../../common/cards/CardName';
import {ICard} from '../cards/ICard';
import {Tag} from '../../common/cards/Tag';

export class ColoniesHandler {
  public static getColony(game: Game, colonyName: ColonyName, includeDiscardedColonies: boolean = false): IColony {
    let colony: IColony | undefined = game.colonies.find((c) => c.name === colonyName);
    if (colony !== undefined) return colony;
    if (includeDiscardedColonies === true) {
      colony = game.discardedColonies.find((c) => c.name === colonyName);
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

  public static onCardPlayed(game: Game, card: ICard) {
    if (!game.gameOptions.coloniesExtension) return;
    game.colonies.forEach((colony) => {
      ColoniesHandler.maybeActivateColony(colony, card);
    });
  }

  /*
   * Conditionally activate the incoming colony based on the played card.
   *
   * Returns `true` if the colony is already active, or becomes active from this
   * method.
   */
  public static maybeActivateColony(colony: IColony, card: ICard): boolean {
    if (colony.isActive === true) {
      return true;
    }
    if (colony.metadata.resourceType !== undefined && colony.metadata.resourceType === card.resourceType) {
      colony.isActive = true;
      return true;
    }

    if (colony.name === ColonyName.VENUS && card.tags.includes(Tag.VENUS)) {
      colony.isActive = true;
      return true;
    }
    return false;
  }

  private static tradeWithColony(player: Player, openColonies: Array<IColony>): AndOptions | undefined {
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

  public static getPlayableColonies(player: Player, allowDuplicate: boolean = false) {
    if (player.game.gameOptions.coloniesExtension === false) return [];

    return player.game.colonies
      .filter((colony) => colony.isActive)
      .filter((colony) => colony.colonies.length < MAX_COLONIES_PER_TILE)
      .filter((colony) => allowDuplicate || !colony.colonies.includes(player.id));
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

  public trade(colony: IColony) {
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

  public trade(colony: IColony) {
    this.player.deductResource(Resources.TITANIUM, this.tradeCost);
    this.player.game.log('${0} spent ${1} titanium to trade with ${2}', (b) => b.player(this.player).number(this.tradeCost).colony(colony));
    colony.trade(this.player);
  }
}


export class TradeWithMegacredits implements IColonyTrader {
  private tradeCost;

  constructor(private player: Player) {
    this.tradeCost = MC_TRADE_COST- player.colonyTradeDiscount;
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
