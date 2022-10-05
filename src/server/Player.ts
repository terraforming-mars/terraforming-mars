import * as constants from '../common/constants';
import {PlayerId} from '../common/Types';
import {DEFAULT_FLOATERS_VALUE, DEFAULT_MICROBES_VALUE, MILESTONE_COST, REDS_RULING_POLICY_COST} from '../common/constants';
import {Aridor} from './cards/colonies/Aridor';
import {Board} from './boards/Board';
import {CardFinder} from './CardFinder';
import {CardName} from '../common/cards/CardName';
import {CardType} from '../common/cards/CardType';
import {Color} from '../common/Color';
import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {Game} from './Game';
import {Payment, PaymentKey, PAYMENT_KEYS} from '../common/inputs/Payment';
import {IAward} from './awards/IAward';
import {ICard, isIActionCard, IActionCard, DynamicTRSource} from './cards/ICard';
import {TRSource} from '../common/cards/TRSource';
import {IMilestone} from './milestones/IMilestone';
import {IProjectCard} from './cards/IProjectCard';
import {LogMessageDataType} from '../common/logs/LogMessageDataType';
import {OrOptions} from './inputs/OrOptions';
import {PartyHooks} from './turmoil/parties/PartyHooks';
import {PartyName} from '../common/turmoil/PartyName';
import {PharmacyUnion} from './cards/promo/PharmacyUnion';
import {Phase} from '../common/Phase';
import {PlayerInput} from './PlayerInput';
import {Resources} from '../common/Resources';
import {CardResource} from '../common/CardResource';
import {SelectCard} from './inputs/SelectCard';
import {SellPatentsStandardProject} from './cards/base/standardProjects/SellPatentsStandardProject';
import {SendDelegateToArea} from './deferredActions/SendDelegateToArea';
import {Priority, SimpleDeferredAction} from './deferredActions/DeferredAction';
import {SelectPaymentDeferred} from './deferredActions/SelectPaymentDeferred';
import {SelectProjectCardToPlay} from './inputs/SelectProjectCardToPlay';
import {SelectOption} from './inputs/SelectOption';
import {SelectSpace} from './inputs/SelectSpace';
import {RobotCard, SelfReplicatingRobots} from './cards/promo/SelfReplicatingRobots';
import {SerializedCard} from './SerializedCard';
import {SerializedPlayer} from './SerializedPlayer';
import {SpaceType} from '../common/boards/SpaceType';
import {StormCraftIncorporated} from './cards/colonies/StormCraftIncorporated';
import {Tag} from '../common/cards/Tag';
import {VictoryPointsBreakdown} from './VictoryPointsBreakdown';
import {IVictoryPointsBreakdown} from '../common/game/IVictoryPointsBreakdown';
import {Timer} from '../common/Timer';
import {TurmoilHandler} from './turmoil/TurmoilHandler';
import {GameCards} from './GameCards';
import {DrawCards} from './deferredActions/DrawCards';
import {Units} from '../common/Units';
import {MoonExpansion} from './moon/MoonExpansion';
import {IStandardProjectCard} from './cards/IStandardProjectCard';
import {ConvertPlants} from './cards/base/standardActions/ConvertPlants';
import {ConvertHeat} from './cards/base/standardActions/ConvertHeat';
import {LunaProjectOffice} from './cards/moon/LunaProjectOffice';
import {GlobalParameter} from '../common/GlobalParameter';
import {GlobalEventName} from '../common/turmoil/globalEvents/GlobalEventName';
import {LogHelper} from './LogHelper';
import {UndoActionOption} from './inputs/UndoActionOption';
import {LawSuit} from './cards/promo/LawSuit';
import {CrashSiteCleanup} from './cards/promo/CrashSiteCleanup';
import {Turmoil} from './turmoil/Turmoil';
import {PathfindersExpansion} from './pathfinders/PathfindersExpansion';
import {deserializeProjectCard, serializeProjectCard} from './cards/CardSerialization';
import {ColoniesHandler} from './colonies/ColoniesHandler';
import {MonsInsurance} from './cards/promo/MonsInsurance';
import {InputResponse} from '../common/inputs/InputResponse';
import {Tags} from './player/Tags';
import {Colonies} from './player/Colonies';
import {Production} from './player/Production';
import {Merger} from './cards/promo/Merger';
import {getBehaviorExecutor} from './behavior/BehaviorExecutor';

/**
 * Behavior when playing a card:
 *   add it to the tableau
 *   discard it from the tableau
 *   or do nothing.
 */

export type CardAction ='add' | 'discard' | 'nothing';
export class Player {
  public readonly id: PlayerId;
  protected waitingFor?: PlayerInput;
  protected waitingForCb?: () => void;
  public game: Game;
  public tags: Tags;
  public colonies: Colonies;
  public readonly production: Production;

  // Corporate identity
  public corporations: Array<ICorporationCard> = [];

  // Used only during set-up
  public pickedCorporationCard?: ICorporationCard;

  // Terraforming Rating
  private terraformRating: number = 20;
  public hasIncreasedTerraformRatingThisGeneration: boolean = false;
  public terraformRatingAtGenerationStart: number = 20;

  // Resources
  public megaCredits: number = 0;
  public steel: number = 0;
  public titanium: number = 0;
  public plants: number = 0;
  public energy: number = 0;
  public heat: number = 0;

  // Resource values
  private titaniumValue: number = 3;
  private steelValue: number = 2;
  // Helion
  public canUseHeatAsMegaCredits: boolean = false;
  // Luna Trade Federation
  public canUseTitaniumAsMegacredits: boolean = false;

  // This generation / this round
  public actionsTakenThisRound: number = 0;
  private actionsThisGeneration: Set<CardName> = new Set();
  public lastCardPlayed: CardName | undefined;
  public pendingInitialActions: Array<ICorporationCard> = [];

  // Cards
  public dealtCorporationCards: Array<ICorporationCard> = [];
  public dealtProjectCards: Array<IProjectCard> = [];
  public dealtPreludeCards: Array<IProjectCard> = [];
  public cardsInHand: Array<IProjectCard> = [];
  public preludeCardsInHand: Array<IProjectCard> = [];
  public playedCards: Array<IProjectCard> = [];
  public draftedCards: Array<IProjectCard> = [];
  public draftedCorporations: Array<ICorporationCard> = [];
  public cardCost: number = constants.CARD_COST;
  public needsToDraft?: boolean;

  public timer: Timer = Timer.newInstance();

  // Turmoil
  public turmoilPolicyActionUsed: boolean = false;
  public politicalAgendasActionUsedCount: number = 0;

  public oceanBonus: number = constants.OCEAN_BONUS;

  // Custom cards
  // Leavitt Station.
  // TODO(kberg): move scienceTagCount to Tags?
  public scienceTagCount: number = 0;
  // PoliticalAgendas Scientists P41
  public hasTurmoilScienceTagBonus: boolean = false;
  // Ecoline
  public plantsNeededForGreenery: number = 8;
  // Lawsuit
  public removingPlayers: Array<PlayerId> = [];
  // For Playwrights corp.
  // removedFromPlayCards is a bit of a misname: it's a temporary storage for
  // cards that provide 'next card' discounts. This will clear between turns.
  public removedFromPlayCards: Array<IProjectCard> = [];

  // Stats
  public actionsTakenThisGame: number = 0;
  public victoryPointsByGeneration: Array<number> = [];
  public totalDelegatesPlaced: number = 0;

  constructor(
    public name: string,
    public color: Color,
    public beginner: boolean,
    public handicap: number = 0,
    id: PlayerId) {
    this.id = id;
    // This seems pretty bad. The game will be set before the Player is actually
    // used, and if that doesn't happen, well, it's a worthy error.
    // The alterantive, to make game type Game | undefined, will cause compilation
    // issues throughout the app.
    // Ideally the right thing is to invert how players and games get created.
    // But one thing at a time.
    this.game = undefined as unknown as Game;
    this.tags = new Tags(this);
    this.colonies = new Colonies(this);
    this.production = new Production(this);
  }

  public static initialize(
    name: string,
    color: Color,
    beginner: boolean,
    handicap: number = 0,
    id: PlayerId): Player {
    const player = new Player(name, color, beginner, handicap, id);
    return player;
  }

  public tearDown() {
    this.game = undefined as unknown as Game;
  }

  public get tableau(): Array<ICorporationCard | IProjectCard> {
    return [...this.corporations, ...this.playedCards];
  }

  public isCorporation(corporationName: CardName): boolean {
    return this.getCorporation(corporationName) !== undefined;
  }

  public getCorporation(corporationName: CardName): ICorporationCard | undefined {
    return this.corporations.find((c) => c.name === corporationName);
  }

  public getCorporationOrThrow(corporationName: CardName): ICorporationCard {
    const corporation = this.getCorporation(corporationName);
    if (corporation === undefined) {
      throw new Error(`player ${this.name} does not have corporation ${corporationName}`);
    }
    return corporation;
  }

  public getTitaniumValue(): number {
    if (PartyHooks.shouldApplyPolicy(this, PartyName.UNITY)) return this.titaniumValue + 1;
    return this.titaniumValue;
  }

  public increaseTitaniumValue(): void {
    this.titaniumValue++;
  }

  public decreaseTitaniumValue(): void {
    if (this.titaniumValue > constants.DEFAULT_TITANIUM_VALUE) {
      this.titaniumValue--;
    }
  }

  public getSelfReplicatingRobotsTargetCards(): Array<RobotCard> {
    return (<SelfReplicatingRobots> this.playedCards.find((card) => card instanceof SelfReplicatingRobots))?.targetCards ?? [];
  }

  public getSteelValue(): number {
    if (PartyHooks.shouldApplyPolicy(this, PartyName.MARS, 'mfp03')) return this.steelValue + 1;
    return this.steelValue;
  }

  public increaseSteelValue(): void {
    this.steelValue++;
  }

  public decreaseSteelValue(): void {
    if (this.steelValue > constants.DEFAULT_STEEL_VALUE) {
      this.steelValue--;
    }
  }

  public getTerraformRating(): number {
    return this.terraformRating;
  }

  public decreaseTerraformRating(opts: {log?: boolean} = {}) {
    this.decreaseTerraformRatingSteps(1, opts);
  }

  public increaseTerraformRating(opts: {log?: boolean} = {}) {
    this.increaseTerraformRatingSteps(1, opts);
  }

  public increaseTerraformRatingSteps(steps: number, opts: {log?: boolean} = {}) {
    const raiseRating = () => {
      this.terraformRating += steps;

      this.hasIncreasedTerraformRatingThisGeneration = true;
      if (opts.log === true) {
        this.game.log('${0} gained ${1} TR', (b) => b.player(this).number(steps));
      }
      this.game.getPlayersInGenerationOrder().forEach((player) => {
        player.corporations.forEach((corp) => {
          corp.onIncreaseTerraformRating?.(this, player, steps);
        });
      });
    };

    if (PartyHooks.shouldApplyPolicy(this, PartyName.REDS)) {
      if (!this.canAfford(REDS_RULING_POLICY_COST * steps)) {
        // Cannot pay Reds, will not increase TR
        return;
      }
      const deferred = new SelectPaymentDeferred(
        this,
        REDS_RULING_POLICY_COST * steps,
        {
          title: 'Select how to pay for TR increase',
          afterPay: raiseRating,
        });
      this.game.defer(deferred, Priority.COST);
    } else {
      raiseRating();
    }
  }

  public decreaseTerraformRatingSteps(steps: number, opts: {log?: boolean} = {}) {
    this.terraformRating -= steps;
    if (opts.log === true) {
      this.game.log('${0} lost ${1} TR', (b) => b.player(this).number(steps));
    }
  }

  public setTerraformRating(value: number) {
    return this.terraformRating = value;
  }

  public getResource(resource: Resources): number {
    if (resource === Resources.MEGACREDITS) return this.megaCredits;
    if (resource === Resources.STEEL) return this.steel;
    if (resource === Resources.TITANIUM) return this.titanium;
    if (resource === Resources.PLANTS) return this.plants;
    if (resource === Resources.ENERGY) return this.energy;
    if (resource === Resources.HEAT) return this.heat;
    throw new Error('Resource ' + resource + ' not found');
  }

  public logUnitDelta(
    resource: Resources,
    amount: number,
    unitType: 'production' | 'amount',
    from: Player | GlobalEventName | undefined,
    stealing = false,
  ) {
    if (amount === 0) {
      // Logging zero units doesn't seem to happen
      return;
    }

    const modifier = amount > 0 ? 'increased' : 'decreased';
    const absAmount = Math.abs(amount);
    // TODO(kberg): remove the ${2} for increased and decreased, I bet it's not used.
    let message = '${0}\'s ${1} ' + unitType + ' ${2} by ${3}';

    if (from !== undefined) {
      if (stealing === true) {
        message = message + ' stolen';
      }
      message = message + ' by ${4}';
    }

    this.game.log(message, (b) => {
      b.player(this)
        .string(resource)
        .string(modifier)
        .number(absAmount);
      if (from instanceof Player) {
        b.player(from);
      } else if (from !== undefined) {
        b.globalEventName(from);
      }
    });
  }

  public deductResource(
    resource: Resources,
    amount: number,
    options? : {
      log?: boolean,
      from? : Player | GlobalEventName,
      stealing?: boolean
    }) {
    this.addResource(resource, -amount, options);
  }

  public addResource(
    resource: Resources,
    amount: number,
    options? : {
      log?: boolean,
      from? : Player | GlobalEventName,
      stealing?: boolean
    }) {
    // When amount is negative, sometimes the amount being asked to be removed is more than the player has.
    // delta represents an adjusted amount which basically declares that a player cannot lose more resources
    // then they have.
    const playerAmount = this.getResource(resource);
    const delta = (amount >= 0) ? amount : Math.max(amount, -playerAmount);

    // Lots of calls to addResource used to deduct resources are done by cards and/or players stealing some
    // fixed amount which, if the current player doesn't have it. it just removes as much as possible.
    // (eg. Sabotage.) That's what the delta above, is for.
    //
    // But if the intent is to remove the amount requested (spending 8 plants to place a greenery) then there
    // better be 8 units. The code outside this call is responsible in those cases for making sure the player
    // has enough resource units to pay for an action.
    //
    // In those cases, if the player calls this, but the logic is wrong, the player could wind up with a
    // negative amount of units. This will break other actions in the game. So instead, this method deducts as
    // much as possible, and lots that there was a game error.
    //
    // The shortcut for knowing if this is the case is when `options.from` is undefined.
    if (delta !== amount && options?.from === undefined) {
      this.game.logIllegalState(
        `Adjusting ${amount} ${resource} when player has ${playerAmount}`,
        {player: {color: this.color, id: this.id, name: this.name}, resource, amount});
    }

    if (resource === Resources.MEGACREDITS) this.megaCredits += delta;
    else if (resource === Resources.STEEL) this.steel += delta;
    else if (resource === Resources.TITANIUM) this.titanium += delta;
    else if (resource === Resources.PLANTS) this.plants += delta;
    else if (resource === Resources.ENERGY) this.energy += delta;
    else if (resource === Resources.HEAT) this.heat += delta;
    else {
      throw new Error(`tried to add unsupported resource ${resource}`);
    }

    if (options?.log === true) {
      this.logUnitDelta(resource, delta, 'amount', options.from, options.stealing);
    }

    if (options?.from instanceof Player) {
      LawSuit.resourceHook(this, resource, delta, options.from);
      CrashSiteCleanup.resourceHook(this, resource, delta, options.from);
    }

    // Mons Insurance hook
    if (options?.from !== undefined && delta < 0 && (options.from instanceof Player && options.from.id !== this.id)) {
      this.resolveInsurance();
    }
  }

  // Returns true when the player has the supplied units in its inventory.
  public hasUnits(units: Units): boolean {
    return this.megaCredits - units.megacredits >= 0 &&
      this.steel - units.steel >= 0 &&
      this.titanium - units.titanium >= 0 &&
      this.plants - units.plants >= 0 &&
      this.energy - units.energy >= 0 &&
      // Stormcraft Incorporated can supply heat, so use `availableHeat`
      this.availableHeat() - units.heat >= 0;
  }

  public addUnits(units: Partial<Units>, options? : {
    log?: boolean,
    from? : Player | GlobalEventName,
  }) {
    this.addResource(Resources.MEGACREDITS, units.megacredits || 0, options);
    this.addResource(Resources.STEEL, units.steel || 0, options);
    this.addResource(Resources.TITANIUM, units.titanium || 0, options);
    this.addResource(Resources.PLANTS, units.plants || 0, options);
    this.addResource(Resources.ENERGY, units.energy || 0, options);
    this.addResource(Resources.HEAT, units.heat || 0, options);
  }

  public deductUnits(units: Units) {
    this.deductResource(Resources.MEGACREDITS, units.megacredits);
    this.deductResource(Resources.STEEL, units.steel);
    this.deductResource(Resources.TITANIUM, units.titanium);
    this.deductResource(Resources.PLANTS, units.plants);
    this.deductResource(Resources.ENERGY, units.energy);
    this.deductResource(Resources.HEAT, units.heat);
  }

  public getActionsThisGeneration(): Set<CardName> {
    return this.actionsThisGeneration;
  }

  public addActionThisGeneration(cardName: CardName): void {
    this.actionsThisGeneration.add(cardName);
    return;
  }

  public getVictoryPoints(): IVictoryPointsBreakdown {
    const victoryPointsBreakdown = new VictoryPointsBreakdown();

    // Victory points from cards
    for (const playedCard of this.tableau) {
      if (playedCard.victoryPoints !== undefined) {
        victoryPointsBreakdown.setVictoryPoints('victoryPoints', playedCard.getVictoryPoints(this), playedCard.name);
      }
    }

    // Victory points from TR
    victoryPointsBreakdown.setVictoryPoints('terraformRating', this.terraformRating);

    // Victory points from awards
    this.giveAwards(victoryPointsBreakdown);

    // Victory points from milestones
    for (const milestone of this.game.claimedMilestones) {
      if (milestone.player !== undefined && milestone.player.id === this.id) {
        victoryPointsBreakdown.setVictoryPoints('milestones', 5, 'Claimed '+milestone.milestone.name+' milestone');
      }
    }

    // Victory points from board
    this.game.board.spaces.forEach((space) => {
      // Victory points for greenery tiles
      if (Board.isGreenerySpace(space) && Board.spaceOwnedBy(space, this)) {
        victoryPointsBreakdown.setVictoryPoints('greenery', 1);
      }

      // Victory points for greenery tiles adjacent to cities
      if (Board.isCitySpace(space) && Board.spaceOwnedBy(space, this)) {
        const adjacent = this.game.board.getAdjacentSpaces(space);
        for (const adj of adjacent) {
          if (Board.isGreenerySpace(adj)) {
            victoryPointsBreakdown.setVictoryPoints('city', 1);
          }
        }
      }
    });

    // Turmoil Victory Points
    const includeTurmoilVP = this.game.gameIsOver() || this.game.phase === Phase.END;

    Turmoil.ifTurmoil(this.game, (turmoil) => {
      if (includeTurmoilVP) {
        victoryPointsBreakdown.setVictoryPoints('victoryPoints', turmoil.getPlayerVictoryPoints(this), 'Turmoil Points');
      }
    });

    this.colonies.calculateVictoryPoints(victoryPointsBreakdown);
    MoonExpansion.calculateVictoryPoints(this, victoryPointsBreakdown);
    PathfindersExpansion.calculateVictoryPoints(this, victoryPointsBreakdown);

    // Escape velocity VP penalty
    if (this.game.gameOptions.escapeVelocityMode) {
      const threshold = this.game.gameOptions.escapeVelocityThreshold;
      const period = this.game.gameOptions.escapeVelocityPeriod;
      const penaltyPerMin = this.game.gameOptions.escapeVelocityPenalty ?? 1;
      const elapsedTimeInMinutes = this.timer.getElapsedTimeInMinutes();
      if (threshold !== undefined && period !== undefined && elapsedTimeInMinutes > threshold) {
        const overTimeInMinutes = Math.max(elapsedTimeInMinutes - threshold - (this.actionsTakenThisGame * (constants.BONUS_SECONDS_PER_ACTION / 60)), 0);
        // Don't lose more VP than what is available
        victoryPointsBreakdown.updateTotal();

        const totalBeforeEscapeVelocity = victoryPointsBreakdown.points.total;
        const penaltyTotal = Math.min(penaltyPerMin * Math.floor(overTimeInMinutes / period), totalBeforeEscapeVelocity);
        victoryPointsBreakdown.setVictoryPoints('escapeVelocity', -penaltyTotal, 'Escape Velocity Penalty');
      }
    }

    victoryPointsBreakdown.updateTotal();
    return victoryPointsBreakdown.points;
  }

  public cardIsInEffect(cardName: CardName): boolean {
    return this.playedCards.some(
      (playedCard) => playedCard.name === cardName);
  }

  public hasProtectedHabitats(): boolean {
    return this.cardIsInEffect(CardName.PROTECTED_HABITATS);
  }

  public plantsAreProtected(): boolean {
    return this.hasProtectedHabitats() || this.cardIsInEffect(CardName.ASTEROID_DEFLECTION_SYSTEM);
  }

  public alloysAreProtected(): boolean {
    return this.cardIsInEffect(CardName.LUNAR_SECURITY_STATIONS);
  }

  public canReduceAnyProduction(resource: Resources, minQuantity: number = 1): boolean {
    // in soloMode you don't have to decrease resources
    const game = this.game;
    if (game.isSoloMode()) return true;
    return game.getPlayers().some((p) => p.canHaveProductionReduced(resource, minQuantity, this));
  }

  public canHaveProductionReduced(resource: Resources, minQuantity: number, attacker: Player) {
    if (resource === Resources.MEGACREDITS) {
      if ((this.production[resource] + 5) < minQuantity) return false;
    } else {
      if (this.production[resource] < minQuantity) return false;
    }

    if (resource === Resources.STEEL || resource === Resources.TITANIUM) {
      if (this.alloysAreProtected()) return false;
    }

    // The pathfindersExpansion test is just an optimization for non-Pathfinders games.
    if (this.game.gameOptions.pathfindersExpansion && this.productionIsProtected(attacker)) return false;
    return true;
  }

  public productionIsProtected(attacker: Player): boolean {
    return attacker !== this && this.cardIsInEffect(CardName.PRIVATE_SECURITY);
  }

  // Return the number of cards in the player's hand without tags.
  // Wild tags are ignored in this computation. (why?)
  public getNoTagsCount() {
    let noTagsCount = 0;

    noTagsCount += this.corporations.filter((card) => card.cardType !== CardType.EVENT && card.tags.every((tag) => tag === Tag.WILD)).length;
    noTagsCount += this.playedCards.filter((card) => card.cardType !== CardType.EVENT && card.tags.every((tag) => tag === Tag.WILD)).length;

    return noTagsCount;
  }

  /**
   * In the multiplayer game, after an attack, the attacked player makes a claim
   * for insurance. If Mons Insurance is in the game, the claimant will receive
   * as much as possible from the insurer.
   *
   * `this` is the attacked player.
   */
  public resolveInsurance() {
  // game.monsInsuranceOwner could be eliminated entirely if there
  // was a fast version of getCardPlayer().
  // I mean, it could be eliminated now, but getCardPlayer is expensive, and
  // checking for who is Mons Insurance is called often even when the card
  // is out of play.
    const game = this.game;
    if (game.monsInsuranceOwner !== undefined && game.monsInsuranceOwner !== this.id) {
      const monsInsuranceOwner = game.getPlayerById(game.monsInsuranceOwner);
      // TODO(kberg): replace with "getCorporationOrThrow"?
      const monsInsurance = <MonsInsurance> monsInsuranceOwner.getCorporation(CardName.MONS_INSURANCE);
      monsInsurance?.payDebt(monsInsuranceOwner, this);
    }
  }

  /**
   * In the solo game, Mons Insurance is only held by the sole player, who will
   * have to pay the penalty for hurting the neutral player.
   *
   * `this` is the potentialInsurer: the solo player in the game. It's not
   * clear yet whether the player has Mons Insurance, but if they do, they will
   * pay. Unlike `resolveInsurance`, there is no claimant Player so the money
   * disappears.
   */
  public resolveInsuranceInSoloGame() {
    const monsInsurance = <MonsInsurance> this.getCorporation(CardName.MONS_INSURANCE);
    monsInsurance?.payDebt(this, undefined);
  }

  public getColoniesCount() {
    if (!this.game.gameOptions.coloniesExtension) return 0;

    let coloniesCount = 0;

    this.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.filter((owner) => owner === this.id).length;
    });

    return coloniesCount;
  }

  /*
   * When playing Pharmacy Union, if the card is discarded, then it sits in the event pile.
   * That's why it's included below. The FAQ describes how this applies to things like the
   * Legend Milestone, Media Archives, and NOT Media Group.
   */
  public getPlayedEventsCount(): number {
    let count = this.playedCards.filter((card) => card.cardType === CardType.EVENT).length;
    if (this.getCorporation(CardName.PHARMACY_UNION)?.isDisabled) count++;

    return count;
  }

  public getRequirementsBonus(parameter: GlobalParameter): number {
    let requirementsBonus = 0;
    for (const playedCard of this.tableau) {
      if (playedCard.getRequirementBonus !== undefined) requirementsBonus += playedCard.getRequirementBonus(this, parameter);
    }

    // PoliticalAgendas Scientists P2 hook
    if (PartyHooks.shouldApplyPolicy(this, PartyName.SCIENTISTS, 'sp02')) {
      requirementsBonus += 2;
    }

    return requirementsBonus;
  }

  public removeResourceFrom(card: ICard, count: number = 1, options?: {removingPlayer? : Player, log?: boolean}): void {
    const removingPlayer = options?.removingPlayer;
    if (card.resourceCount) {
      const amountRemoved = Math.min(card.resourceCount, count);
      if (amountRemoved === 0) return;
      card.resourceCount -= amountRemoved;

      if (removingPlayer !== undefined && removingPlayer !== this) this.resolveInsurance();

      if (options?.log ?? true === true) {
        this.game.log('${0} removed ${1} resource(s) from ${2}\'s ${3}', (b) =>
          b.player(options?.removingPlayer ?? this)
            .number(amountRemoved)
            .player(this)
            .card(card));
      }

      // Lawsuit hook
      if (removingPlayer !== undefined && removingPlayer !== this && this.removingPlayers.includes(removingPlayer.id) === false) {
        this.removingPlayers.push(removingPlayer.id);
      }
    }
  }

  public addResourceTo(card: ICard, options: number | {qty?: number, log?: boolean, logZero?: boolean} = 1): void {
    const count = typeof(options) === 'number' ? options : (options.qty ?? 1);

    if (card.resourceCount !== undefined) {
      card.resourceCount += count;
    }

    if (typeof(options) !== 'number' && options.log === true) {
      if (options.logZero === true || count !== 0) {
        LogHelper.logAddResource(this, card, count);
      }
    }

    for (const playedCard of this.tableau) {
      playedCard.onResourceAdded?.(this, card, count);
    }
  }

  // Returns the set of played cards that have actual resources on them.
  // If `resource` is supplied, only cards that hold that type of resource are retured.
  public getCardsWithResources(resource?: CardResource): Array<ICard> {
    let result = this.tableau.filter((card) => card.resourceType !== undefined && card.resourceCount && card.resourceCount > 0);

    if (resource !== undefined) {
      result = result.filter((card) => card.resourceType === resource);
    }

    return result;
  }

  // Returns the set of played cards that can store resources on them.
  // If `resource` is supplied, only cards that hold that type of resource are retured.
  public getResourceCards(resource?: CardResource): Array<ICard> {
    let result = this.tableau.filter((card) => card.resourceType !== undefined);

    if (resource !== undefined) {
      result = result.filter((card) => card.resourceType === resource);
    }

    return result;
  }

  public getResourceCount(resource: CardResource): number {
    let count = 0;
    this.getCardsWithResources(resource).forEach((card) => {
      count += card.resourceCount;
    });
    return count;
  }

  public getCardsByCardType(cardType: CardType) {
    return this.playedCards.filter((card) => card.cardType === cardType);
  }

  public deferInputCb(result: PlayerInput | undefined): void {
    this.defer(result, Priority.DEFAULT);
  }

  public checkInputLength(input: InputResponse, length: number, firstOptionLength?: number) {
    if (input.length !== length) {
      throw new Error('Incorrect options provided');
    }
    if (firstOptionLength !== undefined && input[0].length !== firstOptionLength) {
      throw new Error('Incorrect options provided (nested)');
    }
  }

  public runInput(input: InputResponse, pi: PlayerInput): void {
    this.deferInputCb(pi.process(input, this));
  }

  public getAvailableBlueActionCount(): number {
    return this.getPlayableActionCards().length;
  }

  public getPlayableActionCards(): Array<ICard & IActionCard> {
    const result: Array<ICard & IActionCard> = [];
    for (const playedCard of this.tableau) {
      if (isIActionCard(playedCard) && !this.actionsThisGeneration.has(playedCard.name) && playedCard.canAct(this)) {
        result.push(playedCard);
      }
    }
    return result;
  }

  public runProductionPhase(): void {
    this.actionsThisGeneration.clear();
    this.removingPlayers = [];

    this.turmoilPolicyActionUsed = false;
    this.politicalAgendasActionUsedCount = 0;
    this.megaCredits += this.production.megacredits + this.terraformRating;
    this.heat += this.energy;
    this.heat += this.production.heat;
    this.energy = this.production.energy;
    this.titanium += this.production.titanium;
    this.steel += this.production.steel;
    this.plants += this.production.plants;

    this.corporations.forEach((card) => card.onProductionPhase?.(this));
  }

  private doneWorldGovernmentTerraforming(): void {
    this.game.deferredActions.runAll(() => this.game.doneWorldGovernmentTerraforming());
  }

  public worldGovernmentTerraforming(): void {
    const action = new OrOptions();
    action.title = 'Select action for World Government Terraforming';
    action.buttonLabel = 'Confirm';
    const game = this.game;
    if (game.getTemperature() < constants.MAX_TEMPERATURE) {
      action.options.push(
        new SelectOption('Increase temperature', 'Increase', () => {
          game.increaseTemperature(this, 1);
          game.log('${0} acted as World Government and increased temperature', (b) => b.player(this));
          return undefined;
        }),
      );
    }
    if (game.getOxygenLevel() < constants.MAX_OXYGEN_LEVEL) {
      action.options.push(
        new SelectOption('Increase oxygen', 'Increase', () => {
          game.increaseOxygenLevel(this, 1);
          game.log('${0} acted as World Government and increased oxygen level', (b) => b.player(this));
          return undefined;
        }),
      );
    }
    if (game.canAddOcean()) {
      action.options.push(
        new SelectSpace(
          'Add an ocean',
          game.board.getAvailableSpacesForOcean(this), (space) => {
            game.addOceanTile(this, space.id, SpaceType.OCEAN);
            game.log('${0} acted as World Government and placed an ocean', (b) => b.player(this));
            return undefined;
          },
        ),
      );
    }
    if (game.getVenusScaleLevel() < constants.MAX_VENUS_SCALE && game.gameOptions.venusNextExtension) {
      action.options.push(
        new SelectOption('Increase Venus scale', 'Increase', () => {
          game.increaseVenusScaleLevel(this, 1);
          game.log('${0} acted as World Government and increased Venus scale', (b) => b.player(this));
          return undefined;
        }),
      );
    }

    MoonExpansion.ifMoon(game, (moonData) => {
      if (moonData.colonyRate < constants.MAXIMUM_HABITAT_RATE) {
        action.options.push(
          new SelectOption('Increase the Moon habitat rate', 'Increase', () => {
            MoonExpansion.raiseHabitatRate(this, 1);
            return undefined;
          }),
        );
      }

      if (moonData.miningRate < constants.MAXIMUM_MINING_RATE) {
        action.options.push(
          new SelectOption('Increase the Moon mining rate', 'Increase', () => {
            MoonExpansion.raiseMiningRate(this, 1);
            return undefined;
          }),
        );
      }

      if (moonData.logisticRate < constants.MAXIMUM_LOGISTICS_RATE) {
        action.options.push(
          new SelectOption('Increase the Moon logistics rate', 'Increase', () => {
            MoonExpansion.raiseLogisticRate(this, 1);
            return undefined;
          }),
        );
      }
    });

    this.setWaitingFor(action, () => {
      this.doneWorldGovernmentTerraforming();
    });
  }

  public dealForDraft(quantity: number, cards: Array<IProjectCard>): void {
    for (let i = 0; i < quantity; i++) {
      cards.push(this.game.projectDeck.draw(this.game, 'bottom'));
    }
  }

  /*
   * @param initialDraft when true, this is part of the first generation draft.
   * @param playerName  The player _this_ player passes remaining cards to.
   * @param passedCards The cards received from the draw, or from the prior player. If empty, it's the first
   *   step in the draft, and cards have to be dealt.
   */
  public runDraftPhase(initialDraft: boolean, playerName: string, passedCards?: Array<IProjectCard>): void {
    let cardsToKeep = 1;

    let cards: Array<IProjectCard> = [];
    if (passedCards === undefined) {
      if (!initialDraft) {
        let cardsToDraw = 4;
        if (LunaProjectOffice.isActive(this)) {
          cardsToDraw = 5;
          cardsToKeep = 2;
        }

        this.dealForDraft(cardsToDraw, cards);
      } else {
        this.dealForDraft(5, cards);
      }
    } else {
      cards = passedCards;
    }

    const message = cardsToKeep === 1 ?
      'Select a card to keep and pass the rest to ${0}' :
      'Select two cards to keep and pass the rest to ${0}';

    this.setWaitingFor(
      new SelectCard({
        message: message,
        data: [{
          type: LogMessageDataType.RAW_STRING,
          value: playerName,
        }],
      },
      'Keep',
      cards,
      (selected) => {
        selected.forEach((card) => {
          this.draftedCards.push(card);
          cards = cards.filter((c) => c !== card);
        });
        this.game.playerIsFinishedWithDraftingPhase(initialDraft, this, cards);
        return undefined;
      }, {min: cardsToKeep, max: cardsToKeep, played: false}),
    );
  }

  /*
   * @param playerName  The player _this_ player passes remaining cards to.
   * @param passedCards The cards received from the draw, or from the prior player.
   */
  public runDraftCorporationPhase(playerName: string, passedCards: Array<ICorporationCard>): void {
    let cards: Array<ICorporationCard> = passedCards;

    const message = 'Select a corporation to keep and pass the rest to ${0}';

    this.setWaitingFor(
      new SelectCard({
        message: message,
        data: [{
          type: LogMessageDataType.RAW_STRING,
          value: playerName,
        }],
      },
      'Keep',
      cards,
      (foundCards: Array<ICorporationCard>) => {
        foundCards.forEach((card) => {
          this.draftedCorporations.push(card);
          this.game.log('${0} kept ${1}', (b) => b.player(this).card(card));
          cards = cards.filter((c) => c !== card);
        });
        this.game.playerIsFinishedWithDraftingCorporationPhase(this, cards);
        return undefined;
      }, {min: 1, max: 1, played: false}),
    );
  }

  /**
   * @return {number} the number of avaialble megacredits. Which is just a shorthand for megacredits,
   * plus any units of heat available thanks to Helion (and Stormcraft, by proxy).
   */
  public spendableMegacredits(): number {
    let total = this.megaCredits;
    if (this.canUseHeatAsMegaCredits) total += this.availableHeat();
    if (this.canUseTitaniumAsMegacredits) total += this.titanium * (this.titaniumValue - 1);
    return total;
  }

  public runResearchPhase(draftVariant: boolean): void {
    let dealtCards: Array<IProjectCard> = [];
    if (!draftVariant) {
      this.dealForDraft(LunaProjectOffice.isActive(this) ? 5 : 4, dealtCards);
    } else {
      dealtCards = this.draftedCards;
      this.draftedCards = [];
    }

    const action = DrawCards.choose(this, dealtCards, {paying: true});
    this.setWaitingFor(action, () => this.game.playerIsFinishedWithResearchPhase(this));
  }

  public getCardCost(card: IProjectCard): number {
    let cost = card.cost;
    cost -= this.colonies.cardDiscount;

    this.tableau.forEach((playedCard) => {
      cost -= playedCard.getCardDiscount?.(this, card) ?? 0;
    });

    // Playwrights hook
    this.removedFromPlayCards.forEach((removedFromPlayCard) => {
      if (removedFromPlayCard.getCardDiscount !== undefined) {
        cost -= removedFromPlayCard.getCardDiscount(this, card);
      }
    });

    // PoliticalAgendas Unity P4 hook
    if (card.tags.includes(Tag.SPACE) && PartyHooks.shouldApplyPolicy(this, PartyName.UNITY, 'up04')) {
      cost -= 2;
    }

    return Math.max(cost, 0);
  }

  private playPreludeCard(): PlayerInput {
    return new SelectCard(
      'Select prelude card to play',
      'Play',
      this.getPlayablePreludeCards(),
      ([card]) => {
        return this.playCard(card);
      },
    );
  }

  private paymentOptionsForCard(card: IProjectCard): Payment.Options {
    return {
      steel: this.lastCardPlayed === CardName.LAST_RESORT_INGENUITY || card.tags.includes(Tag.BUILDING),
      titanium: this.lastCardPlayed === CardName.LAST_RESORT_INGENUITY || card.tags.includes(Tag.SPACE),
      seeds: card.tags.includes(Tag.PLANT) || card.name === CardName.GREENERY_STANDARD_PROJECT,
      floaters: card.tags.includes(Tag.VENUS),
      microbes: card.tags.includes(Tag.PLANT),
      science: card.tags.includes(Tag.MOON),
      // TODO(kberg): add this.corporation.name === CardName.AURORAI
      data: card.cardType === CardType.STANDARD_PROJECT,
    };
  }

  public payMegacreditsDeferred(cost: number, title: string, afterPay?: () => void) {
    this.game.defer(new SelectPaymentDeferred(this, cost, {title, afterPay}));
  }

  public checkPaymentAndPlayCard(selectedCard: IProjectCard, payment: Payment, cardAction: CardAction = 'add') {
    const cardCost = this.getCardCost(selectedCard);

    const reserved = MoonExpansion.adjustedReserveCosts(this, selectedCard);

    if (!this.canSpend(payment, reserved)) {
      throw new Error('You do not have that many resources to spend');
    }

    if (payment.floaters > 0) {
      if (selectedCard.name === CardName.STRATOSPHERIC_BIRDS && payment.floaters === this.getSpendableFloaters()) {
        const cardsWithFloater = this.getCardsWithResources(CardResource.FLOATER);
        if (cardsWithFloater.length === 1) {
          throw new Error('Cannot spend all floaters to play Stratospheric Birds');
        }
      }
    }

    const totalToPay = this.payingAmount(payment, this.paymentOptionsForCard(selectedCard));

    if (totalToPay < cardCost) {
      throw new Error('Did not spend enough to pay for card');
    }
    return this.playCard(selectedCard, payment, cardAction);
  }

  public getSpendableMicrobes(): number {
    const psychrophiles = this.playedCards.find((card) => card.name === CardName.PSYCHROPHILES);
    return psychrophiles?.resourceCount ?? 0;
  }

  public getSpendableFloaters(): number {
    const dirigibles = this.playedCards.find((card) => card.name === CardName.DIRIGIBLES);
    return dirigibles?.resourceCount ?? 0;
  }

  public getSpendableScienceResources(): number {
    const lunaArchives = this.playedCards.find((card) => card.name === CardName.LUNA_ARCHIVES);
    return lunaArchives?.resourceCount ?? 0;
  }

  public getSpendableSeedResources(): number {
    return this.getCorporation(CardName.SOYLENT_SEEDLING_SYSTEMS)?.resourceCount ?? 0;
  }

  public getSpendableData(): number {
    return this.getCorporation(CardName.AURORAI)?.resourceCount ?? 0;
  }

  public pay(payment: Payment) {
    this.deductResource(Resources.STEEL, payment.steel);
    this.deductResource(Resources.TITANIUM, payment.titanium);
    this.deductResource(Resources.MEGACREDITS, payment.megaCredits);

    if (payment.heat > 0) {
      this.defer(this.spendHeat(payment.heat));
    }

    for (const playedCard of this.playedCards) {
      if (playedCard.name === CardName.PSYCHROPHILES) {
        this.removeResourceFrom(playedCard, payment.microbes);
      }

      if (playedCard.name === CardName.DIRIGIBLES) {
        this.removeResourceFrom(playedCard, payment.floaters);
      }

      if (playedCard.name === CardName.LUNA_ARCHIVES) {
        this.removeResourceFrom(playedCard, payment.science);
      }
    }

    if (payment.seeds > 0) {
      const soylent = this.getCorporation(CardName.SOYLENT_SEEDLING_SYSTEMS);
      if (soylent === undefined) throw new Error('Cannot pay with seeds without ' + CardName.SOYLENT_SEEDLING_SYSTEMS);
      this.removeResourceFrom(soylent, payment.seeds);
    }
    if (payment.data > 0) {
      const aurorai = this.getCorporation(CardName.AURORAI);
      if (aurorai === undefined) throw new Error('Cannot pay with data without ' + CardName.AURORAI);
      this.removeResourceFrom(aurorai, payment.data);
    }
  }

  public playCard(selectedCard: IProjectCard, payment?: Payment, cardAction: 'add' | 'discard' | 'nothing' = 'add'): undefined {
    if (payment !== undefined) {
      this.pay(payment);
    }

    ColoniesHandler.onCardPlayed(this.game, selectedCard);

    if (selectedCard.cardType !== CardType.PROXY) {
      this.lastCardPlayed = selectedCard.name;
      this.game.log('${0} played ${1}', (b) => b.player(this).card(selectedCard));
    }

    // Play the card
    const action = selectedCard.play(this);
    this.defer(action, Priority.DEFAULT);

    // This could probably include 'nothing' but for now this will work.
    if (cardAction !== 'discard') {
      // Remove card from hand
      const projectCardIndex = this.cardsInHand.findIndex((card) => card.name === selectedCard.name);
      const preludeCardIndex = this.preludeCardsInHand.findIndex((card) => card.name === selectedCard.name);
      if (projectCardIndex !== -1) {
        this.cardsInHand.splice(projectCardIndex, 1);
      } else if (preludeCardIndex !== -1) {
        this.preludeCardsInHand.splice(preludeCardIndex, 1);
      }

      // Remove card from Self Replicating Robots
      const card = this.playedCards.find((card) => card.name === CardName.SELF_REPLICATING_ROBOTS);
      if (card instanceof SelfReplicatingRobots) {
        for (const targetCard of card.targetCards) {
          if (targetCard.card.name === selectedCard.name) {
            const index = card.targetCards.indexOf(targetCard);
            card.targetCards.splice(index, 1);
          }
        }
      }
    }

    switch (cardAction) {
    case 'add':
      if (selectedCard.name !== CardName.LAW_SUIT) {
        this.playedCards.push(selectedCard);
      }
      break;
    // Card is already played. Discard it.
    case 'discard':
      this.discardPlayedCard(selectedCard);
      break;
    // Do nothing. Good for fake cards.
    case 'nothing':
      break;
    }

    // See DeclareCloneTag for why.
    if (!selectedCard.tags.includes(Tag.CLONE)) {
      this.onCardPlayed(selectedCard);
    }

    return undefined;
  }

  private triggerOtherCorpEffects(playedCorporationCard: ICorporationCard) {
    // trigger other corp's effects, e.g. SaturnSystems, PharmacyUnion, Splice
    for (const somePlayer of this.game.getPlayers()) {
      for (const corporation of somePlayer.corporations) {
        if (somePlayer === this && corporation.name === playedCorporationCard.name) continue;
        if (corporation.onCorpCardPlayed === undefined) continue;
        this.game.defer(new SimpleDeferredAction(this, () => corporation.onCorpCardPlayed?.(this, playedCorporationCard)));
      }
    }
  }

  /** @deprecated use card.play */
  public simplePlay(card: IProjectCard | ICorporationCard) {
    return card.play(this);
  }

  public onCardPlayed(card: IProjectCard) {
    if (card.cardType === CardType.PROXY) {
      return;
    }
    for (const playedCard of this.playedCards) {
      const actionFromPlayedCard = playedCard.onCardPlayed?.(this, card);
      if (actionFromPlayedCard !== undefined) {
        this.game.defer(new SimpleDeferredAction(
          this,
          () => actionFromPlayedCard,
        ));
      }
    }

    TurmoilHandler.applyOnCardPlayedEffect(this, card);

    for (const somePlayer of this.game.getPlayersInGenerationOrder()) {
      for (const corporationCard of somePlayer.corporations) {
        const actionFromPlayedCard = corporationCard.onCardPlayed?.(this, card);
        if (actionFromPlayedCard !== undefined) {
          this.game.defer(new SimpleDeferredAction(
            this,
            () => actionFromPlayedCard,
          ));
        }
      }
    }

    PathfindersExpansion.onCardPlayed(this, card);
  }

  private playActionCard(): PlayerInput {
    return new SelectCard<ICard & IActionCard>(
      'Perform an action from a played card',
      'Take action',
      this.getPlayableActionCards(),
      ([card]) => {
        this.game.log('${0} used ${1} action', (b) => b.player(this).card(card));
        const action = card.action(this);
        if (action !== undefined) {
          this.game.defer(new SimpleDeferredAction(
            this,
            () => action,
          ));
        }
        this.actionsThisGeneration.add(card.name);
        return undefined;
      }, {selectBlueCardAction: true},
    );
  }

  public playAdditionalCorporationCard(corporationCard: ICorporationCard): void {
    if (this.corporations.length === 0) {
      throw new Error('Cannot add additional corporation when it does not have a starting corporation.');
    }
    return this._playCorporationCard(corporationCard, true);
  }

  public playCorporationCard(corporationCard: ICorporationCard): void {
    if (this.corporations.length > 0) {
      throw new Error('Cannot add additional corporation without specifying it explicitly.');
    }
    return this._playCorporationCard(corporationCard, false);
  }

  private _playCorporationCard(corporationCard: ICorporationCard, additionalCorp = false): void {
    this.corporations.push(corporationCard);

    // There is a simpler way to deal with this block, but I'd rather not deal with the fallout of getting it wrong.
    if (additionalCorp) {
      this.megaCredits += corporationCard.startingMegaCredits;
      this.cardCost = Merger.setCardCost(this);
    } else {
      this.megaCredits = corporationCard.startingMegaCredits;
      if (corporationCard.cardCost !== undefined) {
        this.cardCost = corporationCard.cardCost;
      }
    }

    if (additionalCorp === false && corporationCard.name !== CardName.BEGINNER_CORPORATION) {
      const diff = this.cardsInHand.length * this.cardCost;
      this.deductResource(Resources.MEGACREDITS, diff);
    }
    this.simplePlay(corporationCard);
    if (corporationCard.initialAction !== undefined) this.pendingInitialActions.push(corporationCard);
    this.game.log('${0} played ${1}', (b) => b.player(this).card(corporationCard));
    if (additionalCorp === false) {
      this.game.log('${0} kept ${1} project cards', (b) => b.player(this).number(this.cardsInHand.length));
    }

    this.triggerOtherCorpEffects(corporationCard);
    ColoniesHandler.onCardPlayed(this.game, corporationCard);
    PathfindersExpansion.onCardPlayed(this, corporationCard);

    if (!additionalCorp) {
      this.game.playerIsFinishedWithResearchPhase(this);
    }
  }

  public drawCard(count?: number, options?: DrawCards.DrawOptions): undefined {
    return DrawCards.keepAll(this, count, options).execute();
  }

  public drawCardKeepSome(count: number, options: DrawCards.AllOptions): SelectCard<IProjectCard> {
    return DrawCards.keepSome(this, count, options).execute();
  }

  public discardPlayedCard(card: IProjectCard) {
    const cardIndex = this.playedCards.findIndex((c) => c.name === card.name);
    if (cardIndex === -1) {
      console.error(`Error: card ${card.name} not in ${this.id}'s hand`);
      return;
    }
    this.playedCards.splice(cardIndex, 1);
    this.game.projectDeck.discard(card);
    card.onDiscard?.(this);
    this.game.log('${0} discarded ${1}', (b) => b.player(this).card(card));
  }

  public availableHeat(): number {
    const floaters = this.getCorporation(CardName.STORMCRAFT_INCORPORATED)?.resourceCount ?? 0;
    return this.heat + (floaters * 2);
  }

  public spendHeat(amount: number, cb: () => (undefined | PlayerInput) = () => undefined) : PlayerInput | undefined {
    const stormcraft = <StormCraftIncorporated> this.getCorporation(CardName.STORMCRAFT_INCORPORATED);
    if (stormcraft?.resourceCount > 0) {
      return stormcraft.spendHeat(this, amount, cb);
    }
    this.deductResource(Resources.HEAT, amount);
    return cb();
  }

  private claimMilestone(milestone: IMilestone): SelectOption {
    return new SelectOption(milestone.name, 'Claim - ' + '('+ milestone.name + ')', () => {
      this.game.claimedMilestones.push({
        player: this,
        milestone: milestone,
      });
      this.game.defer(new SelectPaymentDeferred(this, MILESTONE_COST, {title: 'Select how to pay for milestone'}));
      this.game.log('${0} claimed ${1} milestone', (b) => b.player(this).milestone(milestone));
      return undefined;
    });
  }

  private fundAward(award: IAward): PlayerInput {
    return new SelectOption(award.name, 'Fund - ' + '(' + award.name + ')', () => {
      this.game.defer(new SelectPaymentDeferred(this, this.game.getAwardFundingCost(), {title: 'Select how to pay for award'}));
      this.game.fundAward(this, award);
      return undefined;
    });
  }

  private giveAwards(vpb: VictoryPointsBreakdown): void {
    this.game.fundedAwards.forEach((fundedAward) => {
      // Awards are disabled for 1 player games
      if (this.game.isSoloMode()) return;

      const players: Array<Player> = this.game.getPlayers().slice();
      players.sort(
        (p1, p2) => fundedAward.award.getScore(p2) - fundedAward.award.getScore(p1),
      );

      // We have one rank 1 player
      if (fundedAward.award.getScore(players[0]) > fundedAward.award.getScore(players[1])) {
        if (players[0].id === this.id) vpb.setVictoryPoints('awards', 5, '1st place for '+fundedAward.award.name+' award (funded by '+fundedAward.player.name+')');
        players.shift();

        if (players.length > 1) {
          // We have one rank 2 player
          if (fundedAward.award.getScore(players[0]) > fundedAward.award.getScore(players[1])) {
            if (players[0].id === this.id) vpb.setVictoryPoints('awards', 2, '2nd place for '+fundedAward.award.name+' award (funded by '+fundedAward.player.name+')');

          // We have at least two rank 2 players
          } else {
            const score = fundedAward.award.getScore(players[0]);
            while (players.length > 0 && fundedAward.award.getScore(players[0]) === score) {
              if (players[0].id === this.id) vpb.setVictoryPoints('awards', 2, '2nd place for '+fundedAward.award.name+' award (funded by '+fundedAward.player.name+')');
              players.shift();
            }
          }
        }

      // We have at least two rank 1 players
      } else {
        const score = fundedAward.award.getScore(players[0]);
        while (players.length > 0 && fundedAward.award.getScore(players[0]) === score) {
          if (players[0].id === this.id) vpb.setVictoryPoints('awards', 5, '1st place for '+fundedAward.award.name+' award (funded by '+fundedAward.player.name+')');
          players.shift();
        }
      }
    });
  }

  private endTurnOption(): PlayerInput {
    return new SelectOption('End Turn', 'End', () => {
      this.actionsTakenThisRound = 1; // Why is this statement necessary?
      this.game.log('${0} ended turn', (b) => b.player(this));
      return undefined;
    });
  }

  // Exposed for tests
  public pass(): void {
    this.game.playerHasPassed(this);
    this.lastCardPlayed = undefined;
  }

  private passOption(): PlayerInput {
    return new SelectOption('Pass for this generation', 'Pass', () => {
      this.pass();
      this.game.log('${0} passed', (b) => b.player(this));
      return undefined;
    });
  }

  public takeActionForFinalGreenery(): void {
    const resolveFinalGreeneryDeferredActions = () => {
      this.game.deferredActions.runAll(() => this.takeActionForFinalGreenery());
    };

    // Resolve any deferredAction before placing the next greenery
    // Otherwise if two tiles are placed next to Philares, only the last benefit is triggered
    // if Philares does not accept the first bonus before the second tile is down
    if (this.game.deferredActions.length > 0) {
      resolveFinalGreeneryDeferredActions();
      return;
    }

    if (this.game.canPlaceGreenery(this)) {
      const action = new OrOptions();
      action.title = 'Place any final greenery from plants';
      action.buttonLabel = 'Confirm';
      action.options.push(
        new SelectSpace(
          'Select space for greenery',
          this.game.board.getAvailableSpacesForGreenery(this), (space) => {
            // Do not raise oxygen or award TR for final greenery placements
            this.game.addGreenery(this, space.id, SpaceType.LAND, false);
            this.deductResource(Resources.PLANTS, this.plantsNeededForGreenery);

            this.takeActionForFinalGreenery();

            // Resolve Philares deferred actions
            if (this.game.deferredActions.length > 0) resolveFinalGreeneryDeferredActions();
            return undefined;
          },
        ),
      );
      action.options.push(
        new SelectOption('Don\'t place a greenery', 'Confirm', () => {
          this.game.playerIsDoneWithGame(this);
          return undefined;
        }),
      );
      this.setWaitingFor(action);
      return;
    }

    if (this.game.deferredActions.length > 0) {
      resolveFinalGreeneryDeferredActions();
    } else {
      this.game.playerIsDoneWithGame(this);
    }
  }

  private getPlayablePreludeCards(): Array<IProjectCard> {
    return this.preludeCardsInHand.filter((card) => card.canPlay === undefined || card.canPlay(this));
  }

  public getPlayableCards(): Array<IProjectCard> {
    const candidateCards: Array<IProjectCard> = [...this.cardsInHand];
    // Self Replicating robots check
    const card = this.playedCards.find((card) => card.name === CardName.SELF_REPLICATING_ROBOTS);
    if (card instanceof SelfReplicatingRobots) {
      for (const targetCard of card.targetCards) {
        candidateCards.push(targetCard.card);
      }
    }

    return candidateCards.filter((card) => this.canPlay(card));
  }

  // TODO(kberg): After migration, see if this can become private again.
  // Or perhaps moved into card?
  public canAffordCard(card: IProjectCard): boolean {
    const trSource: TRSource | DynamicTRSource | undefined = card.tr || (card.behavior !== undefined ? getBehaviorExecutor().toTRSource(card.behavior) : undefined);
    return this.canAfford(
      this.getCardCost(card),
      {
        ...this.paymentOptionsForCard(card),
        reserveUnits: MoonExpansion.adjustedReserveCosts(this, card),
        tr: trSource,
      });
  }

  public canPlay(card: IProjectCard): boolean {
    return this.canAffordCard(card) && this.simpleCanPlay(card);
  }

  // TODO(kberg): Replace all uses of canPlayIgnoringCost with simpleCanPlay.
  public canPlayIgnoringCost(card: IProjectCard) {
    return this.simpleCanPlay(card);
  }

  /**
   * Verify if requirements for the card can be met, ignoring the project cost.
   * Only made public for tests.
   */
  public simpleCanPlay(card: IProjectCard): boolean {
    if (card.requirements !== undefined && !card.requirements.satisfies(this)) {
      return false;
    }
    return card.canPlay(this);
  }

  private maxSpendable(reserveUnits: Units = Units.EMPTY): Payment {
    return {
      megaCredits: this.megaCredits - reserveUnits.megacredits,
      steel: this.steel - reserveUnits.steel,
      titanium: this.titanium - reserveUnits.titanium,
      heat: this.availableHeat() - reserveUnits.heat,
      floaters: this.getSpendableFloaters(),
      microbes: this.getSpendableMicrobes(),
      science: this.getSpendableScienceResources(),
      seeds: this.getSpendableSeedResources(),
      data: this.getSpendableData(),
    };
  }

  public canSpend(payment: Payment, reserveUnits?: Units): boolean {
    const maxPayable = this.maxSpendable(reserveUnits);

    return PAYMENT_KEYS.every((key) =>
      0 <= payment[key] && payment[key] <= maxPayable[key]);
  }

  /**
   * Returns the value of the suppled payment given the payment options.
   *
   * For example, if the payment is 3MC and 2 steel, given that steel by default is
   * worth 2M€, this will return 7.
   *
   * @param {Payment} payment the resources being paid.
   * @param {Payment.Options} options any configuration defining the accepted forma of payment.
   * @return {number} a number representing the value of payment in M€.
   */
  public payingAmount(payment: Payment, options?: Partial<Payment.Options>): number {
    const multiplier: {[key in PaymentKey]: number} = {
      megaCredits: 1,
      steel: this.getSteelValue(),
      titanium: this.getTitaniumValue(),
      heat: 1,
      microbes: DEFAULT_MICROBES_VALUE,
      floaters: DEFAULT_FLOATERS_VALUE,
      science: 1,
      seeds: constants.SEED_VALUE,
      data: constants.DATA_VALUE,
    };

    const usable: {[key in PaymentKey]: boolean} = {
      megaCredits: true,
      steel: options?.steel ?? false,
      titanium: options?.titanium ?? false,
      heat: this.canUseHeatAsMegaCredits,
      microbes: options?.microbes ?? false,
      floaters: options?.floaters ?? false,
      science: options?.science ?? false,
      seeds: options?.seeds ?? false,
      data: options?.data ?? false,
    };

    // HOOK: Luna Trade Federation
    if (usable.titanium === false && payment.titanium > 0 && this.isCorporation(CardName.LUNA_TRADE_FEDERATION)) {
      usable.titanium = true;
      multiplier.titanium -= 1;
    }

    let totalToPay = 0;
    for (const key of PAYMENT_KEYS) {
      if (usable[key]) totalToPay += payment[key] * multiplier[key];
    }

    return totalToPay;
  }

  /**
   * Returns `true` if the player can afford to pay `cost` mc (possibly replaceable with steel, titanium etc.)
   * and additionally pay the reserveUnits (no replaces here)
   */
  public canAfford(cost: number, options?: CanAffordOptions) {
    const reserveUnits = options?.reserveUnits ?? Units.EMPTY;
    if (!this.hasUnits(reserveUnits)) {
      return false;
    }

    const maxPayable = this.maxSpendable(reserveUnits);
    const redsCost = TurmoilHandler.computeTerraformRatingBump(this, options?.tr) * REDS_RULING_POLICY_COST;
    if (redsCost > 0) {
      const usableForRedsCost = this.payingAmount(maxPayable, {});
      if (usableForRedsCost < redsCost) {
        return false;
      }
    }

    const usable = this.payingAmount(maxPayable, options);

    return cost + redsCost <= usable;
  }

  private getStandardProjects(): Array<IStandardProjectCard> {
    const gameOptions = this.game.gameOptions;
    return new GameCards(gameOptions)
      .getStandardProjects()
      .filter((card) => {
        switch (card.name) {
        // sell patents is not displayed as a card
        case CardName.SELL_PATENTS_STANDARD_PROJECT:
          return false;
        // For buffer gas, show ONLY IF in solo AND 63TR mode
        case CardName.BUFFER_GAS_STANDARD_PROJECT:
          return this.game.isSoloMode() && gameOptions.soloTR;
        case CardName.AIR_SCRAPPING_STANDARD_PROJECT:
          return gameOptions.altVenusBoard === false;
        case CardName.AIR_SCRAPPING_STANDARD_PROJECT_VARIANT:
          return gameOptions.altVenusBoard === true;
        case CardName.MOON_HABITAT_STANDARD_PROJECT_V2:
        case CardName.MOON_MINE_STANDARD_PROJECT_V2:
        case CardName.MOON_ROAD_STANDARD_PROJECT_V2:
          return gameOptions.moonStandardProjectVariant === true;
        default:
          return true;
        }
      })
      .sort((a, b) => a.cost - b.cost);
  }

  // Public for testing.
  public getStandardProjectOption(): SelectCard<IStandardProjectCard> {
    const standardProjects: Array<IStandardProjectCard> = this.getStandardProjects();

    return new SelectCard(
      'Standard projects',
      'Confirm',
      standardProjects,
      (card) => card[0].action(this),
      {enabled: standardProjects.map((card) => card.canAct(this))},
    );
  }

  /**
   * Set up a player taking their next action.
   *
   * This method indicates the avalilable actions by setting the `waitingFor` attribute of this player.
   *
   * @param {boolean} saveBeforeTakingAction when true, the game state is saved. Default is `true`. This
   * should only be false in testing and when this method is called during game deserialization. In other
   * words, don't set this value unless you know what you're doing.
   */
  // @ts-ignore saveBeforeTakingAction is unused at the moment.
  public takeAction(saveBeforeTakingAction: boolean = true): void {
    const game = this.game;

    if (game.deferredActions.length > 0) {
      game.deferredActions.runAll(() => this.takeAction());
      return;
    }

    const allOtherPlayersHavePassed = this.allOtherPlayersHavePassed();

    if (this.actionsTakenThisRound === 0 || game.gameOptions.undoOption) game.save();
    // if (saveBeforeTakingAction) game.save();

    // Prelude cards have to be played first
    if (this.preludeCardsInHand.length > 0) {
      game.phase = Phase.PRELUDES;

      // If no playable prelude card in hand, end player turn
      if (this.getPlayablePreludeCards().length === 0) {
        this.preludeCardsInHand = [];
        game.playerIsFinishedTakingActions();
        return;
      }

      this.setWaitingFor(this.playPreludeCard(), () => {
        if (this.preludeCardsInHand.length === 1) {
          this.takeAction();
        } else {
          game.playerIsFinishedTakingActions();
        }
      });
      return;
    } else {
      game.phase = Phase.ACTION;
    }

    if (game.hasPassedThisActionPhase(this) || (allOtherPlayersHavePassed === false && this.actionsTakenThisRound >= 2)) {
      this.actionsTakenThisRound = 0;
      game.playerIsFinishedTakingActions();
      return;
    }

    // Terraforming Mars FAQ says:
    //   If for any reason you are not able to perform your mandatory first action (e.g. if
    //   all 3 Awards are claimed before starting your turn as Vitor), you can skip this and
    //   proceed with other actions instead.
    // This code just uses "must skip" instead of "can skip".
    const vitor = this.getCorporation(CardName.VITOR);
    if (vitor !== undefined && this.game.allAwardsFunded()) {
      this.pendingInitialActions = this.pendingInitialActions.filter((card) => card !== vitor);
    }


    if (this.pendingInitialActions.length > 0) {
      const orOptions = new OrOptions();

      this.pendingInitialActions.forEach((corp) => {
        const option = new SelectOption(
          {
            message: 'Take first action of ${0} corporation',
            data: [{
              type: LogMessageDataType.RAW_STRING,
              value: corp.name,
            }],
          },
          corp.initialActionText, () => {
            game.defer(new SimpleDeferredAction(this, () => {
              if (corp.initialAction) {
                return corp.initialAction(this);
              } else {
                return undefined;
              }
            }));

            this.pendingInitialActions.splice(this.pendingInitialActions.indexOf(corp), 1);
            return undefined;
          });
        orOptions.options.push(option);
      });

      orOptions.options.push(this.passOption());

      this.setWaitingFor(orOptions, () => {
        this.actionsTakenThisRound++;
        this.actionsTakenThisGame++;
        // TODO(kberg): implement this?
        // this.timer.rebateTime(constants.BONUS_SECONDS_PER_ACTION);
        this.takeAction();
      });
      return;
    }

    this.setWaitingFor(this.getActions(), () => {
      this.incrementActionsTaken();
      this.takeAction();
    });
  }

  private incrementActionsTaken(): void {
    this.actionsTakenThisRound++;
    this.actionsTakenThisGame++;
  }

  // Return possible mid-game actions like play a card and fund an award, but not play prelude card.
  public getActions() {
    const action = new OrOptions();
    action.title = this.actionsTakenThisRound === 0 ?
      'Take your first action' : 'Take your next action';
    action.buttonLabel = 'Take action';

    if (this.canAfford(MILESTONE_COST) && !this.game.allMilestonesClaimed()) {
      const remainingMilestones = new OrOptions();
      remainingMilestones.title = 'Claim a milestone';
      remainingMilestones.options = this.game.milestones
        .filter(
          (milestone: IMilestone) =>
            !this.game.milestoneClaimed(milestone) &&
            milestone.canClaim(this))
        .map(
          (milestone: IMilestone) =>
            this.claimMilestone(milestone));
      if (remainingMilestones.options.length >= 1) action.options.push(remainingMilestones);
    }

    // Convert Plants
    const convertPlants = new ConvertPlants();
    if (convertPlants.canAct(this)) {
      action.options.push(convertPlants.action(this));
    }

    // Convert Heat
    const convertHeat = new ConvertHeat();
    if (convertHeat.canAct(this)) {
      action.options.push(new SelectOption(`Convert ${constants.HEAT_FOR_TEMPERATURE} heat into temperature`, 'Convert heat', () => {
        return convertHeat.action(this);
      }));
    }

    TurmoilHandler.addPlayerAction(this, action.options);

    if (this.getPlayableActionCards().length > 0) {
      action.options.push(
        this.playActionCard(),
      );
    }

    const playableCards = this.getPlayableCards();
    if (playableCards.length !== 0) {
      action.options.push(
        new SelectProjectCardToPlay(this, playableCards));
    }

    const coloniesTradeAction = this.colonies.coloniesTradeAction();
    if (coloniesTradeAction !== undefined) {
      action.options.push(coloniesTradeAction);
    }

    // If you can pay to add a delegate to a party.
    Turmoil.ifTurmoil(this.game, (turmoil) => {
      let sendDelegate;
      if (turmoil.lobby.has(this.id)) {
        sendDelegate = new SendDelegateToArea(this, 'Send a delegate in an area (from lobby)');
      } else if (this.isCorporation(CardName.INCITE) && this.canAfford(3) && turmoil.hasDelegatesInReserve(this.id)) {
        sendDelegate = new SendDelegateToArea(this, 'Send a delegate in an area (3 M€)', {cost: 3});
      } else if (this.canAfford(5) && turmoil.hasDelegatesInReserve(this.id)) {
        sendDelegate = new SendDelegateToArea(this, 'Send a delegate in an area (5 M€)', {cost: 5});
      }
      if (sendDelegate) {
        const input = sendDelegate.execute();
        if (input !== undefined) {
          action.options.push(input);
        }
      }
    });

    if (this.game.getPlayers().length > 1 &&
      this.actionsTakenThisRound > 0 &&
      !this.game.gameOptions.fastModeOption &&
      this.allOtherPlayersHavePassed() === false) {
      action.options.push(
        this.endTurnOption(),
      );
    }

    const fundingCost = this.game.getAwardFundingCost();
    if (this.canAfford(fundingCost) && !this.game.allAwardsFunded()) {
      const remainingAwards = new OrOptions();
      remainingAwards.title = {
        data: [{
          type: LogMessageDataType.RAW_STRING,
          value: String(fundingCost),
        }],
        message: 'Fund an award (${0} M€)',
      };
      remainingAwards.buttonLabel = 'Confirm';
      remainingAwards.options = this.game.awards
        .filter((award: IAward) => this.game.hasBeenFunded(award) === false)
        .map((award: IAward) => this.fundAward(award));
      action.options.push(remainingAwards);
    }

    action.options.push(this.getStandardProjectOption());

    action.options.push(this.passOption());

    // Sell patents
    const sellPatents = new SellPatentsStandardProject();
    if (sellPatents.canAct(this)) {
      action.options.push(sellPatents.action(this));
    }

    // Propose undo action only if you have done one action this turn
    if (this.actionsTakenThisRound > 0 && this.game.gameOptions.undoOption) {
      action.options.push(new UndoActionOption());
    }

    return action;
  }

  private allOtherPlayersHavePassed(): boolean {
    const game = this.game;
    if (game.isSoloMode()) return true;
    const players = game.getPlayers();
    const passedPlayers = game.getPassedPlayers();
    return passedPlayers.length === players.length - 1 && passedPlayers.includes(this.color) === false;
  }

  public process(input: InputResponse): void {
    if (this.waitingFor === undefined || this.waitingForCb === undefined) {
      throw new Error('Not waiting for anything');
    }
    const waitingFor = this.waitingFor;
    const waitingForCb = this.waitingForCb;
    this.waitingFor = undefined;
    this.waitingForCb = undefined;
    try {
      this.timer.stop();
      this.runInput(input, waitingFor);
      waitingForCb();
    } catch (err) {
      this.setWaitingFor(waitingFor, waitingForCb);
      throw err;
    }
  }

  public getWaitingFor(): PlayerInput | undefined {
    return this.waitingFor;
  }
  public setWaitingFor(input: PlayerInput, cb: () => void = () => {}): void {
    this.timer.start();
    this.waitingFor = input;
    this.waitingForCb = cb;
  }

  public serialize(): SerializedPlayer {
    const result: SerializedPlayer = {
      id: this.id,
      corporations: this.corporations.map((corporation) => {
        return {
          name: corporation.name,
          resourceCount: corporation.resourceCount,
          allTags: corporation instanceof Aridor ? Array.from(corporation.allTags) : [],
          isDisabled: corporation instanceof PharmacyUnion && corporation.isDisabled,
        };
      }),
      // Used only during set-up
      pickedCorporationCard: this.pickedCorporationCard?.name,
      // Terraforming Rating
      terraformRating: this.terraformRating,
      hasIncreasedTerraformRatingThisGeneration: this.hasIncreasedTerraformRatingThisGeneration,
      terraformRatingAtGenerationStart: this.terraformRatingAtGenerationStart,
      // Resources
      megaCredits: this.megaCredits,
      megaCreditProduction: this.production.megacredits,
      steel: this.steel,
      steelProduction: this.production.steel,
      titanium: this.titanium,
      titaniumProduction: this.production.titanium,
      plants: this.plants,
      plantProduction: this.production.plants,
      energy: this.energy,
      energyProduction: this.production.energy,
      heat: this.heat,
      heatProduction: this.production.heat,
      // Resource values
      titaniumValue: this.titaniumValue,
      steelValue: this.steelValue,
      // Helion
      canUseHeatAsMegaCredits: this.canUseHeatAsMegaCredits,
      canUseTitaniumAsMegacredits: this.canUseTitaniumAsMegacredits,
      // This generation / this round
      actionsTakenThisRound: this.actionsTakenThisRound,
      actionsThisGeneration: Array.from(this.actionsThisGeneration),
      pendingInitialActions: this.pendingInitialActions.map((c) => c.name),
      corporationInitialActionDone: undefined,
      // Cards
      dealtCorporationCards: this.dealtCorporationCards.map((c) => c.name),
      dealtProjectCards: this.dealtProjectCards.map((c) => c.name),
      dealtPreludeCards: this.dealtPreludeCards.map((c) => c.name),
      cardsInHand: this.cardsInHand.map((c) => c.name),
      preludeCardsInHand: this.preludeCardsInHand.map((c) => c.name),
      playedCards: this.playedCards.map(serializeProjectCard),
      draftedCards: this.draftedCards.map((c) => c.name),
      cardCost: this.cardCost,
      needsToDraft: this.needsToDraft,
      cardDiscount: this.colonies.cardDiscount,
      // Colonies
      // TODO(kberg): consider a ColoniesSerializer or something.
      fleetSize: this.colonies.getFleetSize(),
      tradesThisTurn: this.colonies.tradesThisGeneration,
      colonyTradeOffset: this.colonies.tradeOffset,
      colonyTradeDiscount: this.colonies.tradeDiscount,
      colonyVictoryPoints: this.colonies.victoryPoints,
      // Turmoil
      turmoilPolicyActionUsed: this.turmoilPolicyActionUsed,
      politicalAgendasActionUsedCount: this.politicalAgendasActionUsedCount,
      hasTurmoilScienceTagBonus: this.hasTurmoilScienceTagBonus,
      oceanBonus: this.oceanBonus,
      // Custom cards
      // Leavitt Station.
      scienceTagCount: this.scienceTagCount,
      // Ecoline
      plantsNeededForGreenery: this.plantsNeededForGreenery,
      // Lawsuit
      removingPlayers: this.removingPlayers,
      // Playwrights
      removedFromPlayCards: this.removedFromPlayCards.map((c) => c.name),
      name: this.name,
      color: this.color,
      beginner: this.beginner,
      handicap: this.handicap,
      timer: this.timer.serialize(),
      // Stats
      actionsTakenThisGame: this.actionsTakenThisGame,
      victoryPointsByGeneration: this.victoryPointsByGeneration,
      totalDelegatesPlaced: this.totalDelegatesPlaced,
    };

    if (this.lastCardPlayed !== undefined) {
      result.lastCardPlayed = this.lastCardPlayed;
    }
    return result;
  }

  public static deserialize(d: SerializedPlayer): Player {
    const player = new Player(d.name, d.color, d.beginner, Number(d.handicap), d.id);
    const cardFinder = new CardFinder();

    player.actionsTakenThisGame = d.actionsTakenThisGame;
    player.actionsTakenThisRound = d.actionsTakenThisRound;
    player.canUseHeatAsMegaCredits = d.canUseHeatAsMegaCredits;
    // TODO(kberg): remove ?? false by 2022-12-01
    player.canUseTitaniumAsMegacredits = d.canUseTitaniumAsMegacredits ?? false;
    player.cardCost = d.cardCost;
    player.colonies.cardDiscount = d.cardDiscount;
    player.colonies.tradeDiscount = d.colonyTradeDiscount;
    player.colonies.tradeOffset = d.colonyTradeOffset;
    player.colonies.victoryPoints = d.colonyVictoryPoints;
    player.victoryPointsByGeneration = d.victoryPointsByGeneration;
    player.energy = d.energy;
    player.colonies.setFleetSize(d.fleetSize);
    player.hasIncreasedTerraformRatingThisGeneration = d.hasIncreasedTerraformRatingThisGeneration;
    player.hasTurmoilScienceTagBonus = d.hasTurmoilScienceTagBonus;
    player.heat = d.heat;
    player.megaCredits = d.megaCredits;
    player.needsToDraft = d.needsToDraft;
    player.oceanBonus = d.oceanBonus;
    player.plants = d.plants;
    player.plantsNeededForGreenery = d.plantsNeededForGreenery;
    player.production.override(Units.of({
      energy: d.energyProduction,
      heat: d.heatProduction,
      megacredits: d.megaCreditProduction,
      plants: d.plantProduction,
      steel: d.steelProduction,
      titanium: d.titaniumProduction,
    }));
    player.removingPlayers = d.removingPlayers;
    player.scienceTagCount = d.scienceTagCount;
    player.steel = d.steel;
    player.steelValue = d.steelValue;
    player.terraformRating = d.terraformRating;
    player.terraformRatingAtGenerationStart = d.terraformRatingAtGenerationStart;
    player.titanium = d.titanium;
    player.titaniumValue = d.titaniumValue;
    player.totalDelegatesPlaced = d.totalDelegatesPlaced;
    player.colonies.tradesThisGeneration = d.tradesThisTurn;
    player.turmoilPolicyActionUsed = d.turmoilPolicyActionUsed;
    player.politicalAgendasActionUsedCount = d.politicalAgendasActionUsedCount;

    player.lastCardPlayed = d.lastCardPlayed;

    // Rebuild removed from play cards (Playwrights)
    player.removedFromPlayCards = cardFinder.cardsFromJSON(d.removedFromPlayCards);

    player.actionsThisGeneration = new Set<CardName>(d.actionsThisGeneration);

    if (d.pickedCorporationCard !== undefined) {
      player.pickedCorporationCard = cardFinder.getCorporationCardByName(d.pickedCorporationCard);
    }

    // Rebuild corporation cards
    let corporations = d.corporations;
    if (corporations === undefined && d.corporationCard !== undefined) corporations = [d.corporationCard];

    // This shouldn't happen
    if (corporations !== undefined) {
      for (const corporation of corporations) {
        const card = cardFinder.getCorporationCardByName(corporation.name);
        if (card === undefined) {
          continue;
        }
        if (corporation.resourceCount !== undefined) {
          card.resourceCount = corporation.resourceCount;
        }
        if (card instanceof Aridor) {
          if (corporation.allTags !== undefined) {
            card.allTags = new Set(corporation.allTags);
          } else {
            console.warn('did not find allTags for ARIDOR');
          }
        }
        if (card instanceof PharmacyUnion) {
          card.isDisabled = Boolean(corporation.isDisabled);
        }
        player.corporations.push(card);
      }
    }

    player.pendingInitialActions = cardFinder.corporationCardsFromJSON(d.pendingInitialActions ?? []);
    if (d.corporationInitialActionDone !== undefined) {
      player.pendingInitialActions = [player.corporations[0]];
    }

    player.dealtCorporationCards = cardFinder.corporationCardsFromJSON(d.dealtCorporationCards);
    player.dealtPreludeCards = cardFinder.cardsFromJSON(d.dealtPreludeCards);
    player.dealtProjectCards = cardFinder.cardsFromJSON(d.dealtProjectCards);
    player.cardsInHand = cardFinder.cardsFromJSON(d.cardsInHand);
    player.preludeCardsInHand = cardFinder.cardsFromJSON(d.preludeCardsInHand);
    player.playedCards = d.playedCards.map((element: SerializedCard) => deserializeProjectCard(element, cardFinder));
    player.draftedCards = cardFinder.cardsFromJSON(d.draftedCards);

    player.timer = Timer.deserialize(d.timer);

    return player;
  }

  /* Shorthand for deferring things */
  public defer(input: PlayerInput | undefined, priority: Priority = Priority.DEFAULT): void {
    if (input === undefined) return;
    const action = new SimpleDeferredAction(this, () => input, priority);
    this.game.defer(action);
  }
}

export interface CanAffordOptions extends Partial<Payment.Options> {
  reserveUnits?: Units,
  tr?: TRSource | DynamicTRSource,
}
