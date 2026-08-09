import {Units} from '../../common/Units';
import {ICard} from '../cards/ICard';
import {TRSource} from '../../common/cards/TRSource';
import {BuildColony} from '../deferredActions/BuildColony';
import {DecreaseAnyProduction} from '../deferredActions/DecreaseAnyProduction';
import {PlaceCityTile} from '../deferredActions/PlaceCityTile';
import {PlaceGreeneryTile} from '../deferredActions/PlaceGreeneryTile';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
import {RemoveAnyPlants} from '../deferredActions/RemoveAnyPlants';
import {MoonExpansion} from '../moon/MoonExpansion';
import {PlaceMoonHabitatTile} from '../moon/PlaceMoonHabitatTile';
import {PlaceMoonMineTile} from '../moon/PlaceMoonMineTile';
import {PlaceMoonRoadTile} from '../moon/PlaceMoonRoadTile';
import {PlaceSpecialMoonTile} from '../moon/PlaceSpecialMoonTile';
import {CanAffordOptions, IPlayer} from '../IPlayer';
import {Behavior} from './Behavior';
import {Counter, ICounter} from './Counter';
import {Turmoil} from '../turmoil/Turmoil';
import {SendDelegateToArea} from '../deferredActions/SendDelegateToArea';
import {BehaviorExecutor} from './BehaviorExecutor';
import {PlaceTile} from '../deferredActions/PlaceTile';
import {Resource} from '../../common/Resource';
import {SelectPaymentDeferred} from '../deferredActions/SelectPaymentDeferred';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {Payment} from '../../common/inputs/Payment';
import {SelectResources} from '../inputs/SelectResources';
import {TITLES} from '../inputs/titles';
import {message} from '../logs/MessageBuilder';
import {IdentifySpacesDeferred} from '../underworld/IdentifySpacesDeferred';
import {ClaimSpacesDeferred} from '../underworld/ClaimSpacesDeferred';
import {ExcavateSpacesDeferred} from '../underworld/ExcavateSpacesDeferred';
import {UnderworldExpansion} from '../underworld/UnderworldExpansion';
import {SelectResource} from '../inputs/SelectResource';
import {RemoveResourcesFromCard} from '../deferredActions/RemoveResourcesFromCard';
import {isIProjectCard} from '../cards/IProjectCard';
import {MAXIMUM_HABITAT_RATE, MAXIMUM_LOGISTIC_RATE, MAXIMUM_MINING_RATE, MAX_OCEAN_TILES, MAX_OXYGEN_LEVEL, MAX_TEMPERATURE, MAX_VENUS_SCALE} from '../../common/constants';
import {CardName} from '../../common/cards/CardName';
import {inplaceRemove} from '../../common/utils/utils';
import {SelectCard} from '../inputs/SelectCard';
import {IGlobalEvent, isIGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';
import {ProxyCard} from '../cards/ProxyCard';
import {From} from '../logs/From';
import {BaseStock} from '../player/StockBase';
import {AddResourcesToAnyCardExecutor} from './AddResourcesToAnyCardExecutor';

/**
 * Caps each count at what `lose` is allowed to take: never below zero, so a countable that
 * went negative takes nothing instead of granting a gain, and never more than the player
 * can give up, so `add` logs the amount that really changed.
 */
function loseable(units: Units, stock: BaseStock, minMegacredits: number): Units {
  const capped = {...Units.EMPTY};
  for (const key of Units.keys) {
    const floor = key === 'megacredits' ? minMegacredits : 0;
    capped[key] = Math.max(0, Math.min(units[key], stock[key] - floor));
  }
  return capped;
}

export class Executor implements BehaviorExecutor {
  public canExecute(behavior: Behavior, player: IPlayer, card: ICard, canAffordOptions?: CanAffordOptions) {
    const ctx = new Counter(player, card);
    const asTrSource = this.toTRSource(behavior, ctx);
    const game = player.game;

    if (behavior.production && !player.production.canAdjust(ctx.countUnits(behavior.production))) {
      return false;
    }

    if (behavior.or) {
      // Checks every sub-behavior (using map vs some)
      // so that all warnings get set on the card.
      const executable = behavior.or.behaviors.map((behavior) => this.canExecute(behavior, player, card, canAffordOptions));
      if (!executable.some((result) => result)) {
        return false;
      }
    }

    if (behavior.drawCard !== undefined) {
      const drawCard = behavior.drawCard;
      const count = typeof(drawCard) === 'number' ? drawCard : ctx.count(drawCard.count);
      if (game.projectDeck.canDraw(count) === false) {
        return false;
      }
    }

    if (behavior.global !== undefined) {
      const g = behavior.global;
      if (g.temperature !== undefined && game.getTemperature() >= MAX_TEMPERATURE) {
        card.addWarning('maxtemp');
      }
      if (g.oxygen !== undefined && game.getOxygenLevel() >= MAX_OXYGEN_LEVEL) {
        if (g.oxygen < 0) {
          card.addWarning('maxoxygen-reduce');
        } else {
          card.addWarning('maxoxygen');
        }
      }
      if (g.venus !== undefined && game.getVenusScaleLevel() >= MAX_VENUS_SCALE) {
        card.addWarning('maxvenus');
      }
    }

    if (behavior.ocean !== undefined && game.board.getOceanSpaces().length >= MAX_OCEAN_TILES) {
      card.addWarning('maxoceans');
    }

    if (behavior.stock !== undefined) {
      const stock = behavior.stock;
      // Only supporting positive values for now.
      // (Also supporting Countable because it's a pain.)
      if (Units.keys.some((key) => {
        const v = stock[key];
        return (typeof v === 'number') ? v < 0 : false;
      })) {
        throw new Error('Not supporting negative units for now: ' + card.name);
      }

      // if (!player.hasUnits(behavior.stock)) {
      //   return false;
      // }
    }

    // TODO(kberg): Spend is not combined with PredictedCost.
    if (behavior.spend !== undefined) {
      const spend = behavior.spend;
      if (spend.megacredits && !player.canAfford({
        cost: spend.megacredits,
        steel: spend.canUseSteel,
        titanium: spend.canUseTitanium,
        tr: asTrSource,
      })) {
        return false;
      }
      if (spend.steel && player.steel < spend.steel) {
        return false;
      }
      if (spend.titanium && player.titanium < spend.titanium) {
        return false;
      }
      if (spend.plants && player.plants < spend.plants) {
        return false;
      }
      if (spend.energy) {
        if (player.energy < spend.energy) {
          return false;
        }
        if (!player.canAfford({
          cost: 0,
          reserveUnits: Units.of({energy: spend.energy}),
          tr: asTrSource,
        })) {
          return false;
        }
      }
      if (spend.heat) {
        if (player.availableHeat() < spend.heat) {
          return false;
        }
        if (!player.canAfford({
          cost: 0,
          reserveUnits: Units.of({heat: spend.heat}),
          tr: asTrSource,
        })) {
          return false;
        }
      }
      if (spend.resourcesHere) {
        if (card.resourceCount < spend.resourcesHere) {
          return false;
        }
        if (!player.canAfford({cost: 0, tr: asTrSource})) {
          return false;
        }
      }
      if (spend.resourceFromAnyCard && player.getCardsWithResources(spend.resourceFromAnyCard.type).length === 0) {
        return false;
      }
      if (spend.corruption && player.underworldData.corruption < spend.corruption) {
        return false;
      }
      if (spend.cards) {
        if (player.cardsInHand.filter((c) => card !== c).length < spend.cards) {
          return false;
        }
      }
    }

    if (behavior.removeResourcesFromAnyCard !== undefined) {
      const r = behavior.removeResourcesFromAnyCard;
      const source = r.source ?? 'self';
      // Solo mode has no opponents to steal from, but the attack still resolves (as insurance) — see execute().
      if (!(source !== 'self' && game.isSoloMode())) {
        const count = ctx.count(r.count ?? 1);
        if (RemoveResourcesFromCard.getAvailableTargetCards(player, r.type, source, count).length === 0) {
          return false;
        }
      }
    }

    if (behavior.decreaseAnyProduction !== undefined) {
      if (!game.isSoloMode()) {
        const dap = behavior.decreaseAnyProduction;
        const targets = game.players.filter((p) => p.canHaveProductionReduced(dap.type, dap.count, player));

        if (targets.length === 0) {
          return false;
        }
        if (targets.length === 1 && targets[0] === player) {
          card.addWarning('decreaseOwnProduction');
        }
      }
    }

    if (behavior.colonies?.buildColony !== undefined) {
      if (player.colonies.getPlayableColonies(behavior.colonies.buildColony.allowDuplicates).length === 0) {
        return false;
      }
    }

    if (behavior.city !== undefined) {
      if (behavior.city.space === undefined) {
        if (game.board.getAvailableSpacesForType(player, behavior.city.on ?? 'city', canAffordOptions).length === 0) {
          return false;
        }
      } else {
        // Special case for Star Vegas. The space may already be occupied.
        if (game.board.getSpaceOrThrow(behavior.city.space).tile !== undefined) {
          return false;
        }
      }
    }

    if (behavior.greenery !== undefined) {
      const spaces = game.board.getAvailableSpacesForType(player, behavior.greenery.on ?? 'greenery', canAffordOptions);
      const filtered = game.board.filterSpacesAroundRedCity(spaces);
      if (filtered.length === 0) {
        return false;
      }
    }

    if (behavior.tile !== undefined) {
      if (game.board.getAvailableSpacesForType(player, behavior.tile.on, canAffordOptions).length === 0) {
        return false;
      }
    }

    if (behavior.addResourcesToAnyCard !== undefined) {
      const subExecutor = new AddResourcesToAnyCardExecutor(player, card, behavior, ctx, behavior.addResourcesToAnyCard);
      if (!subExecutor.canExecute()) {
        return false;
      }
    }

    if (behavior.turmoil) {
      const turmoil = Turmoil.getTurmoil(game);
      if (behavior.turmoil.sendDelegates) {
        const count = ctx.count(behavior.turmoil.sendDelegates.count);
        if (turmoil.getAvailableDelegateCount(player) < count) {
          return false;
        }
      }
    }

    if (behavior.moon !== undefined) {
      const moon = behavior.moon;
      const moonData = MoonExpansion.moonData(game);
      if (moon.habitatTile !== undefined && moon.habitatTile.space === undefined) {
        if (moonData.moon.getAvailableSpacesOnLand(player).length === 0) {
          return false;
        }
      }
      if (moon.mineTile !== undefined && moon.mineTile.space === undefined) {
        if (moonData.moon.getAvailableSpacesForMine(player).length === 0) {
          return false;
        }
      }
      if (moon.roadTile !== undefined && moon.roadTile.space === undefined) {
        if (moonData.moon.getAvailableSpacesOnLand(player).length === 0) {
          return false;
        }
      }
      if ((moon.habitatRate ?? 0) >= MAXIMUM_HABITAT_RATE) {
        card.addWarning('maxHabitatRate');
      }
      if ((moon.miningRate ?? 0) >= MAXIMUM_MINING_RATE) {
        card.addWarning('maxMiningRate');
      }
      if ((moon.logisticRate ?? 0) >= MAXIMUM_LOGISTIC_RATE) {
        card.addWarning('maxLogisticRate');
      }
    }

    if (behavior.underworld !== undefined) {
      const underworld = behavior.underworld;
      if (underworld.identify !== undefined) {
        const count = typeof(underworld.identify) === 'number' ? underworld.identify : underworld.identify.count;
        if (UnderworldExpansion.canIdentifyN(player, count) === false) {
          return false;
        }
        // Right now identifies are always more than excavates, so there's no reason to count excavates.
      }

      if (underworld.excavate !== undefined) {
        const excavate = underworld.excavate;
        const count = typeof(excavate) === 'number' ? excavate : ctx.count(excavate.count);
        if (UnderworldExpansion.canExcavateN(player, count) === false) {
          return false;
        }
      }
    }

    return true;
  }

  public execute(behavior: Behavior, player: IPlayer, inputCard: ICard | IGlobalEvent) {
    const card = isIGlobalEvent(inputCard) ? new ProxyCard(CardName.GLOBAL_EVENT_PROXY) : inputCard;
    const globalEvent = isIGlobalEvent(inputCard) ? inputCard : undefined;

    // Only log from for global events
    const from: From | undefined = globalEvent ? {globalEvent} : undefined;

    const ctx = new Counter(player, card);

    if (behavior.or !== undefined) {
      // Warnings the card already had (unrelated to this or-block) must survive it.
      const saved = new Set(card.warnings);
      const options: Array<SelectOption> = [];
      for (const subBehavior of behavior.or.behaviors) {
        // Check (and clear) one sub-behavior at a time so its warnings don't bleed into
        // the next sub-behavior's option.
        card.clearWarnings();
        if (!this.canExecute(subBehavior, player, card)) {
          continue;
        }
        const option = new SelectOption(subBehavior.title)
          .andThen(() => {
            this.execute(subBehavior, player, inputCard);
            return undefined;
          });
        if (card.warnings.size > 0) {
          option.warnings = Array.from(card.warnings);
        }
        options.push(option);
      }
      card.clearWarnings();
      saved.forEach((warning) => card.addWarning(warning));
      if (options.length === 1 && behavior.or.autoSelect === true) {
        options[0].cb(undefined);
      } else {
        const orOptions = new OrOptions(...options);
        if (behavior.or.title) {
          orOptions.title = behavior.or.title;
        }
        player.defer(orOptions);
      }
    }

    if (behavior.spend !== undefined) {
      const spend = behavior.spend;
      const remainder = {...behavior};
      delete remainder['spend'];

      if (spend.megacredits) {
        player.game.defer(new SelectPaymentDeferred(player, spend.megacredits, {
          title: TITLES.payForCardAction(card.name),
          canUseSteel: spend.canUseSteel,
          canUseTitanium: spend.canUseTitanium,
        })).andThen(() => this.execute(remainder, player, inputCard));
        // Exit early as the rest of handled by the deferred action.
        return;
      }
      // player.pay triggers Sol Bank.
      player.pay(Payment.of({
        steel: spend.steel ?? 0,
        titanium: spend.titanium ?? 0,
      }));
      if (spend.plants) {
        player.stock.deduct(Resource.PLANTS, spend.plants);
      }
      if (spend.energy) {
        player.stock.deduct(Resource.ENERGY, spend.energy);
      }
      if (spend.heat) {
        player.defer(player.spendHeat(spend.heat, () => {
          this.execute(remainder, player, card);
          return undefined;
        }));
        // Exit early as the rest of handled by the deferred action.
        return;
      }
      if (spend.resourcesHere) {
        player.removeResourceFrom(card, spend.resourcesHere);
      }
      if (spend.resourceFromAnyCard) {
        player.game.defer(new RemoveResourcesFromCard(player, spend.resourceFromAnyCard.type, 1, {source: 'self', blockable: false}))
          .andThen(() => this.execute(remainder, player, card));
        // Exit early as the rest of handled by the deferred action.
        return;
      }
      if (spend.corruption) {
        UnderworldExpansion.loseCorruption(player, spend.corruption);
      }
      if ((spend.cards ?? 0) > 0) {
        const count: number = spend.cards ?? 0;
        const cards = player.cardsInHand.filter((c) => card !== c);
        player.defer(
          new SelectCard(
            message('Select ${0} card(s) to discard', (b) => b.number(count)),
            undefined,
            cards,
            {min: count, max: count},
          ).andThen((cards) => {
            for (const c of cards) {
              inplaceRemove(player.cardsInHand, c);
              player.game.projectDeck.discard(c);
            }
            this.execute(remainder, player, card);
            return undefined;
          }),
        );
        // Exit early as the rest of handled by the deferred action.
        return;
      }
    }

    if (behavior.removeResourcesFromAnyCard !== undefined) {
      const r = behavior.removeResourcesFromAnyCard;
      const remainder = {...behavior};
      delete remainder['removeResourcesFromAnyCard'];
      const source = r.source ?? 'self';
      const count = ctx.count(r.count ?? 1);
      player.game.defer(new RemoveResourcesFromCard(player, r.type, count, {source, blockable: source !== 'self', log: true, min: count}))
        .andThen((response) => {
          if (response.proceed) {
            this.execute(remainder, player, inputCard);
          }
        });
      // Exit early — the rest only runs if the removal isn't blocked.
      return;
    }

    if (behavior.lose !== undefined) {
      const lose = behavior.lose;
      if (lose.production) {
        // Production megacredits bottom out at -5, not 0.
        const units = loseable(ctx.countUnits(lose.production), player.production, -5);
        player.production.adjust(Units.negative(units), {log: true, from});
      }
      if (lose.stock) {
        const units = loseable(ctx.countUnits(lose.stock), player.stock, 0);
        player.stock.adjust(Units.negative(units), {log: true, from});
      }
    }
    if (behavior.production !== undefined) {
      const units = ctx.countUnits(behavior.production);
      player.production.adjust(units, {log: true, from});
    }
    if (behavior.stock) {
      const units = ctx.countUnits(behavior.stock);
      player.stock.adjust(units, {log: true, from});
    }
    if (behavior.standardResource) {
      const entry = behavior.standardResource;
      const count = typeof(entry) === 'number' ? entry : entry.count;
      const same = typeof(entry) === 'number' ? true : entry.same ?? true;
      if (same === false) {
        player.defer(
          new SelectResources(message('Gain ${0} standard resources', (b) => b.number(count)), count)
            .andThen((units) => {
              player.stock.adjust(units, {log: true, from});
              return undefined;
            }));
      } else {
        player.defer(
          new SelectResource(message('Gain ${0} units of a standard resource', (b) => b.number(count)))
            .andThen((unit) => {
              player.stock.add(unit, count, {log: true, from});
              return undefined;
            }));
      }
    }
    if (behavior.steelValue === 1) {
      player.increaseSteelValue();
    }
    if (behavior.titanumValue === 1) {
      player.increaseTitaniumValue();
    }

    if (behavior?.greeneryDiscount) {
      player.plantsNeededForGreenery -= behavior.greeneryDiscount;
    }
    if (behavior.drawCard !== undefined) {
      const drawCard = behavior.drawCard;
      if (typeof(drawCard) === 'number') {
        player.drawCard(drawCard);
      } else {
        // This conditional could probably be removed, using the else clause for both.
        if (drawCard.keep === undefined && drawCard.pay === undefined) {
          player.drawCard(ctx.count(drawCard.count), {tag: drawCard.tag, resource: drawCard.resource, cardType: drawCard.type});
        } else {
          player.drawCardKeepSome(ctx.count(drawCard.count), {
            tag: drawCard.tag,
            resource: drawCard.resource,
            cardType: drawCard.type,
            keepMax: drawCard.keep,
            paying: drawCard.pay,
          });
        }
      }
    }

    if (behavior.global !== undefined) {
      const g = behavior.global;
      if (g.temperature !== undefined) {
        player.game.increaseTemperature(player, g.temperature);
      }
      if (g.oxygen !== undefined) {
        player.game.increaseOxygenLevel(player, g.oxygen);
      }
      if (g.venus !== undefined) {
        player.game.increaseVenusScaleLevel(player, g.venus);
      }
    }

    if (behavior.tr !== undefined) {
      const count = ctx.count(behavior.tr);
      const log = typeof(behavior.tr) === 'object';
      if (count >= 0) {
        player.increaseTerraformRating(count, {log: log});
      } else {
        player.decreaseTerraformRating(-count, {log: log});
      }
    }
    const addResources = behavior.addResources;
    if (addResources !== undefined) {
      if (player.game.inDoubleDown && player.game.doubleDownPrelude === card.name) {
        player.game.log('Resources from ${0} cannot be added to ${1}', (b) => b.card(card).cardName(CardName.DOUBLE_DOWN));
      } else {
        const count = ctx.count(addResources);
        player.defer(() => {
          player.addResourceTo(card, {qty: count, log: true, from});
          return undefined;
        });
      }
    }

    if (behavior.addResourcesToAnyCard) {
      const subExecutor = new AddResourcesToAnyCardExecutor(player, card, behavior, ctx, behavior.addResourcesToAnyCard);
      subExecutor.execute();
    }

    if (behavior.decreaseAnyProduction !== undefined) {
      player.game.defer(new DecreaseAnyProduction(player, behavior.decreaseAnyProduction.type, {count: behavior.decreaseAnyProduction.count}));
    }
    if (behavior.removeAnyPlants !== undefined) {
      player.game.defer(new RemoveAnyPlants(player, behavior.removeAnyPlants));
    }
    if (behavior.colonies !== undefined) {
      const colonies = behavior.colonies;
      if (colonies.buildColony !== undefined) {
        player.game.defer(new BuildColony(player, {allowDuplicate: colonies.buildColony.allowDuplicates}));
      }
      if (colonies.addTradeFleet !== undefined) {
        for (let idx = 0; idx < colonies.addTradeFleet; idx++) {
          player.colonies.increaseFleetSize();
        }
      }
      if (colonies.tradeDiscount !== undefined) {
        player.colonies.tradeDiscount += colonies.tradeDiscount;
      }
      if (colonies.tradeOffset !== undefined) {
        player.colonies.tradeOffset += colonies.tradeOffset;
      }
    }

    if (behavior.ocean !== undefined) {
      if (behavior.ocean.count === 2) {
        player.game.defer(new PlaceOceanTile(player, {title: 'Select space for first ocean'}));
        player.game.defer(new PlaceOceanTile(player, {title: 'Select space for second ocean'}));
      } else if (behavior.ocean.firstPlayerPlaces === true) {
        player.game.defer(new PlaceOceanTile(player.game.first, {
          creditedPlayer: player,
          title: message('Select space for ${0} to place an ocean', (b) => b.player(player)),
        }));
      } else {
        player.game.defer(new PlaceOceanTile(player, {on: behavior.ocean.on}));
      }
    }
    if (behavior.city !== undefined) {
      if (behavior.city.space !== undefined) {
        const space = player.game.board.getSpaceOrThrow(behavior.city.space);
        player.game.addCity(player, space);
        if (space.tile !== undefined) { // Should never be undefined
          space.tile.card = card.name;
        }
      } else {
        player.game.defer(new PlaceCityTile(player, {on: behavior.city.on}));
      }
    }
    if (behavior.greenery !== undefined) {
      player.game.defer(new PlaceGreeneryTile(player, behavior.greenery.on));
    }
    if (behavior.tile !== undefined) {
      const tile = behavior.tile;
      player.game.defer(new PlaceTile(player, {
        tile: {
          tileType: tile.type,
          card: card.name,
        },
        on: tile.on,
        title: tile.title ?? message('Select space for ${0} tile', (b) => b.cardName(card.name)),
        adjacencyBonus: tile.adjacencyBonus,
      }));
    }

    if (behavior.turmoil) {
      const turmoil = Turmoil.getTurmoil(player.game);
      if (behavior.turmoil.influenceBonus === 1) {
        turmoil.addInfluenceBonus(player);
      }

      if (behavior.turmoil.sendDelegates) {
        const sendDelegates = behavior.turmoil.sendDelegates;
        const count = ctx.count(sendDelegates.count);
        if (sendDelegates.manyParties) {
          for (let i = 0; i < count; i++) {
            player.game.defer(new SendDelegateToArea(player, 'Select where to send delegate'));
          }
        } else {
          player.game.defer(new SendDelegateToArea(player, `Select where to send ${sendDelegates.count} delegates`, {count: count}));
        }
      }
    }

    if (behavior.moon !== undefined) {
      const moon = behavior.moon;
      if (moon.habitatTile !== undefined) {
        if (moon.habitatTile.space === undefined) {
          player.game.defer(new PlaceMoonHabitatTile(player));
        } else {
          MoonExpansion.addHabitatTile(player, moon.habitatTile.space, card?.name);
          MoonExpansion.raiseHabitatRate(player);
        }
      }
      if (moon.mineTile !== undefined) {
        if (moon.mineTile.space === undefined) {
          player.game.defer(new PlaceMoonMineTile(player));
        } else {
          MoonExpansion.addMineTile(player, moon.mineTile.space, card?.name);
          MoonExpansion.raiseMiningRate(player);
        }
      }
      if (moon.roadTile !== undefined) {
        if (moon.roadTile.space === undefined) {
          player.game.defer(new PlaceMoonRoadTile(player));
        } else {
          MoonExpansion.addRoadTile(player, moon.roadTile.space, card?.name);
          MoonExpansion.raiseLogisticRate(player);
        }
      }
      if (moon.tile !== undefined) {
        if (moon.tile.space !== undefined) {
          MoonExpansion.addTile(player, moon.tile.space, {tileType: moon.tile.type, card: card?.name});
        } else {
          player.game.defer(new PlaceSpecialMoonTile(player, {tileType: moon.tile.type, card: card?.name}));
        }
      }
      if (moon.habitatRate !== undefined) {
        MoonExpansion.raiseHabitatRate(player, moon.habitatRate);
      }
      if (moon.miningRate !== undefined) {
        MoonExpansion.raiseMiningRate(player, moon.miningRate);
      }
      if (moon.logisticRate !== undefined) {
        MoonExpansion.raiseLogisticRate(player, moon.logisticRate);
      }
    }

    if (behavior.underworld !== undefined) {
      const underworld = behavior.underworld;
      const identify = underworld.identify;
      if (identify !== undefined) {
        if (typeof(identify) === 'number') {
          player.game.defer(new IdentifySpacesDeferred(player, identify));
        } else {
          const deferred = player.game.defer(new IdentifySpacesDeferred(player, identify.count));
          const claim = identify.claim ?? 0;
          if (claim > 0) {
            deferred.andThen((spaces) => {
              player.game.defer(new ClaimSpacesDeferred(player, ctx.count(claim), spaces));
            });
          }
        }
      }
      if (underworld.excavate !== undefined) {
        const excavate = underworld.excavate;
        if (typeof(excavate) === 'number') {
          player.game.defer(new ExcavateSpacesDeferred(player, excavate));
        } else {
          player.game.defer(new ExcavateSpacesDeferred(
            player, ctx.count(excavate.count), excavate.ignorePlacementRestrictions));
        }
      }
      if (underworld.corruption !== undefined) {
        UnderworldExpansion.gainCorruption(player, ctx.count(underworld.corruption), {log: true});
      }
      if (underworld.markThisGeneration !== undefined) {
        if (isIProjectCard(card)) {
          card.generationUsed = player.game.generation;
        }
      }
    }

    if (behavior.log !== undefined) {
      this.log(behavior.log, player, card);
    }
  }

  private log(message: string, player: IPlayer, card: ICard) {
    const replaced = message
      .replaceAll('${player}', '${0}')
      .replaceAll('${card}', '${1}');
    player.game.log(replaced, (b) => b.player(player).card(card));
  }

  public onDiscard(behavior: Behavior, player: IPlayer, _card: ICard) {
    if (behavior.steelValue === 1) {
      player.decreaseSteelValue();
    }
    if (behavior.titanumValue === 1) {
      player.decreaseTitaniumValue();
    }

    if (behavior?.greeneryDiscount) {
      player.plantsNeededForGreenery += behavior.greeneryDiscount;
    }

    if (behavior.colonies !== undefined) {
      const colonies = behavior.colonies;
      if (colonies.addTradeFleet !== undefined) {
        for (let idx = 0; idx < colonies.addTradeFleet; idx++) {
          player.colonies.decreaseFleetSize();
        }
      }
      if (colonies.tradeDiscount !== undefined) {
        player.colonies.tradeDiscount -= colonies.tradeDiscount;
      }
      if (colonies.tradeOffset !== undefined) {
        player.colonies.tradeOffset -= colonies.tradeOffset;
      }
    }
  }

  public toTRSource(behavior: Behavior, ctx: ICounter): TRSource {
    let tr: number | undefined = undefined;
    if (behavior.tr !== undefined) {
      if (typeof(behavior.tr) === 'number') {
        tr = behavior.tr;
      } else {
        tr = ctx.count(behavior.tr);
      }
    }

    // TODO(kberg): Use undefined instead of 0.
    const trSource: TRSource = {
      tr: tr,
      temperature: behavior.global?.temperature,
      oxygen: (behavior.global?.oxygen ?? 0) + (behavior.greenery !== undefined ? 1 : 0),
      venus: behavior.global?.venus,
      oceans: behavior.ocean !== undefined ? (behavior.ocean.count ?? 1) : undefined,

      moonHabitat: (behavior.moon?.habitatRate ?? 0) + (behavior.moon?.habitatTile !== undefined ? 1 : 0),
      moonMining: (behavior.moon?.miningRate ?? 0) + (behavior.moon?.mineTile !== undefined ? 1 : 0),
      moonLogistic: (behavior.moon?.logisticRate ?? 0) + (behavior.moon?.roadTile !== undefined ? 1 : 0),
    };
    return trSource;
  }
}
