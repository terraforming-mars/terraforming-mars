import * as constants from '../common/constants';
import {PlayerId} from '../common/Types';
import {MILESTONE_COST, REDS_RULING_POLICY_COST} from '../common/constants';
import {CardFinder} from './CardFinder';
import {CardName} from '../common/cards/CardName';
import {CardType} from '../common/cards/CardType';
import {Color} from '../common/Color';
import {ICorporationCard} from './cards/corporation/ICorporationCard';
import {IGame} from './IGame';
import {Game} from './Game';
import {Payment, PaymentUnit, PAYMENT_UNITS, PaymentOptions, DEFAULT_PAYMENT_VALUES} from '../common/inputs/Payment';
import {IAward} from './awards/IAward';
import {ICard, isIActionCard, IActionCard, DynamicTRSource} from './cards/ICard';
import {TRSource} from '../common/cards/TRSource';
import {IMilestone} from './milestones/IMilestone';
import {IProjectCard} from './cards/IProjectCard';
import {OrOptions} from './inputs/OrOptions';
import {PartyHooks} from './turmoil/parties/PartyHooks';
import {PartyName} from '../common/turmoil/PartyName';
import {Phase} from '../common/Phase';
import {PlayerInput} from './PlayerInput';
import {Resource} from '../common/Resource';
import {CardResource} from '../common/CardResource';
import {SelectCard} from './inputs/SelectCard';
import {SellPatentsStandardProject} from './cards/base/standardProjects/SellPatentsStandardProject';
import {Priority, SimpleDeferredAction} from './deferredActions/DeferredAction';
import {SelectPaymentDeferred} from './deferredActions/SelectPaymentDeferred';
import {SelectProjectCardToPlay} from './inputs/SelectProjectCardToPlay';
import {SelectOption} from './inputs/SelectOption';
import {SelectSpace} from './inputs/SelectSpace';
import {RobotCard, SelfReplicatingRobots} from './cards/promo/SelfReplicatingRobots';
import {SerializedCard} from './SerializedCard';
import {SerializedPlayer} from './SerializedPlayer';
import {StormCraftIncorporated} from './cards/colonies/StormCraftIncorporated';
import {Tag} from '../common/cards/Tag';
import {Timer} from '../common/Timer';
import {TurmoilHandler} from './turmoil/TurmoilHandler';
import {GameCards} from './GameCards';
import {AllOptions, DrawCards, DrawOptions} from './deferredActions/DrawCards';
import {Units} from '../common/Units';
import {MoonExpansion} from './moon/MoonExpansion';
import {IStandardProjectCard} from './cards/IStandardProjectCard';
import {ConvertPlants} from './cards/base/standardActions/ConvertPlants';
import {ConvertHeat} from './cards/base/standardActions/ConvertHeat';
import {LunaProjectOffice} from './cards/moon/LunaProjectOffice';
import {GlobalParameter} from '../common/GlobalParameter';
import {LogHelper} from './LogHelper';
import {UndoActionOption} from './inputs/UndoActionOption';
import {Turmoil} from './turmoil/Turmoil';
import {PathfindersExpansion} from './pathfinders/PathfindersExpansion';
import {deserializeProjectCard, serializeProjectCard} from './cards/CardSerialization';
import {ColoniesHandler} from './colonies/ColoniesHandler';
import {MonsInsurance} from './cards/promo/MonsInsurance';
import {InputResponse} from '../common/inputs/InputResponse';
import {Tags} from './player/Tags';
import {Colonies} from './player/Colonies';
import {Production} from './player/Production';
import {Stock} from './player/Stock';
import {Merger} from './cards/promo/Merger';
import {getBehaviorExecutor} from './behavior/BehaviorExecutor';
import {CeoExtension} from './CeoExtension';
import {ICeoCard, isCeoCard} from './cards/ceos/ICeoCard';
import {newMessage} from './logs/MessageBuilder';
import {calculateVictoryPoints} from './game/calculateVictoryPoints';
import {IVictoryPointsBreakdown} from '..//common/game/IVictoryPointsBreakdown';
import {YesAnd} from './cards/requirements/CardRequirement';
import {PlayableCard} from './cards/IProjectCard';
import {Supercapacitors} from './cards/promo/Supercapacitors';
import {CanAffordOptions, CardAction, IPlayer, ResourceSource, isIPlayer} from './IPlayer';
import {IPreludeCard} from './cards/prelude/IPreludeCard';
import {inplaceRemove, sum} from '../common/utils/utils';
import {PreludesExpansion} from './preludes/PreludesExpansion';
import {ChooseCards} from './deferredActions/ChooseCards';

const THROW_WAITING_FOR = Boolean(process.env.THROW_WAITING_FOR);

export class Player implements IPlayer {
  public readonly id: PlayerId;
  protected waitingFor?: PlayerInput;
  protected waitingForCb?: () => void;
  public game: IGame;
  public tags: Tags;
  public colonies: Colonies;
  public readonly production: Production;
  public readonly stock: Stock;

  // Corporate identity
  public corporations: Array<ICorporationCard> = [];

  // Used only during set-up
  public pickedCorporationCard?: ICorporationCard;

  // Terraforming Rating
  private terraformRating: number = 20;
  public hasIncreasedTerraformRatingThisGeneration: boolean = false;
  public terraformRatingAtGenerationStart: number = 20;

  public get megaCredits(): number {
    return this.stock.megacredits;
  }

  public get steel(): number {
    return this.stock.steel;
  }

  public get titanium(): number {
    return this.stock.titanium;
  }

  public get plants(): number {
    return this.stock.plants;
  }

  public get energy(): number {
    return this.stock.energy;
  }
  public get heat(): number {
    return this.stock.heat;
  }

  public set megaCredits(megacredits: number) {
    this.stock.megacredits = megacredits;
  }

  public set steel(steel: number) {
    this.stock.steel = steel;
  }

  public set titanium(titanium: number) {
    this.stock.titanium = titanium;
  }

  public set plants(plants: number) {
    this.stock.plants = plants;
  }

  public set energy(energy: number) {
    this.stock.energy = energy;
  }

  public set heat(heat: number) {
    this.stock.heat = heat;
  }

  // Resource values
  private titaniumValue: number = 3;
  private steelValue: number = 2;
  // Helion
  public canUseHeatAsMegaCredits: boolean = false;
  // Martian Lumber Corp
  public canUsePlantsAsMegacredits: boolean = false;
  // Luna Trade Federation
  public canUseTitaniumAsMegacredits: boolean = false;

  // This generation / this round
  public actionsTakenThisRound: number = 0;
  private actionsThisGeneration: Set<CardName> = new Set();
  public lastCardPlayed: CardName | undefined;
  public pendingInitialActions: Array<ICorporationCard> = [];

  // Cards
  public dealtCorporationCards: Array<ICorporationCard> = [];
  public dealtPreludeCards: Array<IProjectCard> = [];
  public dealtCeoCards: Array<ICeoCard> = [];
  public dealtProjectCards: Array<IProjectCard> = [];
  public cardsInHand: Array<IProjectCard> = [];
  public preludeCardsInHand: Array<IPreludeCard> = [];
  public ceoCardsInHand: Array<IProjectCard> = [];
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
  // Community Leavitt Station and Pathfinders Leavitt Station
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

  // The number of actions a player can take this round.
  // It's almost always 2, but certain cards can change this value (Mars Maths, Tool with the First Order)
  //
  // This value isn't serialized. Probably ought to be.
  public availableActionsThisRound = 2;

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
    this.stock = new Stock(this);
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

  public getCeo(ceoName: CardName): ICeoCard | undefined {
    const card = this.playedCards.find((c) => c.name === ceoName);
    return (card !== undefined && isCeoCard(card)) ? card : undefined;
  }

  public getCorporationOrThrow(corporationName: CardName): ICorporationCard {
    const corporation = this.getCorporation(corporationName);
    if (corporation === undefined) {
      throw new Error(`player ${this.name} does not have corporation ${corporationName}`);
    }
    return corporation;
  }

  public getTitaniumValue(): number {
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

  public increaseTerraformRating(steps: number = 1, opts: {log?: boolean} = {}) {
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
        player.playedCards.filter((card: IProjectCard) => card.type === CardType.CEO).forEach((ceo) => {
          ceo.onIncreaseTerraformRating?.(this, player, steps);
        });
      });
    };

    if (PartyHooks.shouldApplyPolicy(this, PartyName.REDS)) {
      if (!this.canAfford(REDS_RULING_POLICY_COST * steps)) {
        // Cannot pay Reds, will not increase TR
        return;
      }
      this.game.defer(
        new SelectPaymentDeferred(this, REDS_RULING_POLICY_COST * steps, {title: 'Select how to pay for TR increase'}),
        Priority.COST)
        .andThen(raiseRating);
    } else {
      raiseRating();
    }
  }

  public decreaseTerraformRating(steps: number = 1, opts: {log?: boolean} = {}) {
    this.terraformRating -= steps;
    if (opts.log === true) {
      this.game.log('${0} lost ${1} TR', (b) => b.player(this).number(steps));
    }
  }

  public setTerraformRating(value: number) {
    return this.terraformRating = value;
  }

  public logUnitDelta(
    resource: Resource,
    amount: number,
    unitType: 'production' | 'amount',
    from: ResourceSource | undefined,
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
      if (isIPlayer(from)) {
        b.player(from);
      } else if (typeof(from) === 'object') {
        b.cardName(from.name);
      } else if (typeof(from) === 'string') {
        b.globalEventName(from);
      }
    });
  }

  public getActionsThisGeneration(): Set<CardName> {
    return this.actionsThisGeneration;
  }

  public addActionThisGeneration(cardName: CardName): void {
    this.actionsThisGeneration.add(cardName);
    return;
  }

  public getVictoryPoints(): IVictoryPointsBreakdown {
    return calculateVictoryPoints(this);
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

  public canReduceAnyProduction(resource: Resource, minQuantity: number = 1): boolean {
    // in soloMode you don't have to decrease resources
    const game = this.game;
    if (game.isSoloMode()) return true;
    return game.getPlayers().some((p) => p.canHaveProductionReduced(resource, minQuantity, this));
  }

  public canHaveProductionReduced(resource: Resource, minQuantity: number, attacker: IPlayer) {
    if (resource === Resource.MEGACREDITS) {
      if ((this.production[resource] + 5) < minQuantity) return false;
    } else {
      if (this.production[resource] < minQuantity) return false;
    }

    if (resource === Resource.STEEL || resource === Resource.TITANIUM) {
      if (this.alloysAreProtected()) return false;
    }

    // The pathfindersExpansion test is just an optimization for non-Pathfinders games.
    if (this.game.gameOptions.pathfindersExpansion && this.productionIsProtected(attacker)) return false;
    return true;
  }

  public productionIsProtected(attacker: IPlayer): boolean {
    return attacker !== this && this.cardIsInEffect(CardName.PRIVATE_SECURITY);
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
      const monsInsurance = <MonsInsurance> monsInsuranceOwner.getCorporationOrThrow(CardName.MONS_INSURANCE);
      monsInsurance.payDebt(monsInsuranceOwner, this);
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
    let count = this.playedCards.filter((card) => card.type === CardType.EVENT).length;
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

  public removeResourceFrom(card: ICard, count: number = 1, options?: {removingPlayer? : IPlayer, log?: boolean}): void {
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

  public addResourceTo(card: ICard, options: number | {qty?: number, log: boolean, logZero?: boolean} = 1): void {
    const count = typeof(options) === 'number' ? options : (options.qty ?? 1);

    if (card.resourceCount !== undefined) {
      card.resourceCount += count;
    }

    if (typeof(options) !== 'number' && options.log === true) {
      if (options.logZero === true || count !== 0) {
        LogHelper.logAddResource(this, card, count);
      }
    }

    if (count > 0) {
      for (const playedCard of this.tableau) {
        playedCard.onResourceAdded?.(this, card, count);
      }
    }
  }

  public getCardsWithResources(resource?: CardResource): Array<ICard> {
    let result = this.tableau.filter((card) => card.resourceType !== undefined && card.resourceCount && card.resourceCount > 0);

    if (resource !== undefined) {
      result = result.filter((card) => card.resourceType === resource);
    }

    return result;
  }

  public getResourceCards(resource?: CardResource): Array<ICard> {
    let result = this.tableau.filter((card) => card.resourceType !== undefined);

    if (resource !== undefined) {
      result = result.filter((card) => card.resourceType === resource);
    }

    return result;
  }

  public getResourceCount(resource: CardResource): number {
    return sum(this.getCardsWithResources(resource).map((card) => card.resourceCount));
  }

  public deferInputCb(result: PlayerInput | undefined): void {
    this.defer(result, Priority.DEFAULT);
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
      if (isIActionCard(playedCard) && !this.actionsThisGeneration.has(playedCard.name) && !isCeoCard(playedCard) && playedCard.canAct(this)) {
        result.push(playedCard);
      }
    }
    return result;
  }

  public getUsableOPGCeoCards(): Array<ICeoCard> {
    const result: Array<ICeoCard> = [];
    for (const playedCard of this.tableau) {
      if (isCeoCard(playedCard) && playedCard.canAct(this) ) {
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

    if (this.cardIsInEffect(CardName.SUPERCAPACITORS)) {
      Supercapacitors.onProduction(this);
    } else {
      this.heat += this.energy;
      this.energy = 0;
      this.finishProductionPhase();
    }
  }

  public finishProductionPhase() {
    this.megaCredits += this.production.megacredits + this.terraformRating;
    this.steel += this.production.steel;
    this.titanium += this.production.titanium;
    this.plants += this.production.plants;
    this.energy += this.production.energy;
    this.heat += this.production.heat;

    this.corporations.forEach((card) => card.onProductionPhase?.(this));
    // Turn off CEO OPG actions that were activated this generation
    for (const card of this.playedCards) {
      if (isCeoCard(card)) {
        card.opgActionIsActive = false;
      }
    }
    const solBank = this.getCorporation(CardName.SOLBANK);
    if (solBank !== undefined && solBank.resourceCount > 0) {
      this.megaCredits += solBank.resourceCount;
      solBank.resourceCount = 0;
    }
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
        new SelectOption('Increase temperature', 'Increase').andThen(() => {
          game.increaseTemperature(this, 1);
          game.log('${0} acted as World Government and increased temperature', (b) => b.player(this));
          return undefined;
        }),
      );
    }
    if (game.getOxygenLevel() < constants.MAX_OXYGEN_LEVEL) {
      action.options.push(
        new SelectOption('Increase oxygen', 'Increase').andThen(() => {
          game.increaseOxygenLevel(this, 1);
          game.log('${0} acted as World Government and increased oxygen level', (b) => b.player(this));
          return undefined;
        }),
      );
    }
    if (game.canAddOcean()) {
      action.options.push(
        new SelectSpace('Add an ocean', game.board.getAvailableSpacesForOcean(this))
          .andThen((space) => {
            game.addOcean(this, space);
            game.log('${0} acted as World Government and placed an ocean', (b) => b.player(this));
            return undefined;
          }),
      );
    }
    if (game.getVenusScaleLevel() < constants.MAX_VENUS_SCALE && game.gameOptions.venusNextExtension) {
      action.options.push(
        new SelectOption('Increase Venus scale', 'Increase').andThen(() => {
          game.increaseVenusScaleLevel(this, 1);
          game.log('${0} acted as World Government and increased Venus scale', (b) => b.player(this));
          return undefined;
        }),
      );
    }

    MoonExpansion.ifMoon(game, (moonData) => {
      if (moonData.habitatRate < constants.MAXIMUM_HABITAT_RATE) {
        action.options.push(
          new SelectOption('Increase the Moon habitat rate', 'Increase').andThen(() => {
            MoonExpansion.raiseHabitatRate(this, 1);
            return undefined;
          }),
        );
      }

      if (moonData.miningRate < constants.MAXIMUM_MINING_RATE) {
        action.options.push(
          new SelectOption('Increase the Moon mining rate', 'Increase').andThen(() => {
            MoonExpansion.raiseMiningRate(this, 1);
            return undefined;
          }),
        );
      }

      if (moonData.logisticRate < constants.MAXIMUM_LOGISTICS_RATE) {
        action.options.push(
          new SelectOption('Increase the Moon logistics rate', 'Increase').andThen(() => {
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

  /**
   * Ask the player to draft from a set of cards.
   *
   * @param initialDraft when true, this is part of the first generation draft.
   * @param playerName  The player _this_ player passes remaining cards to.
   * @param passedCards The cards received from the draw, or from the prior player. If empty, it's the first
   *   step in the draft, and cards have to be dealt.
   */
  public askPlayerToDraft(initialDraft: boolean, playerName: string, passedCards?: Array<IProjectCard>): void {
    let cardsToDraw = 4;
    let cardsToKeep = 1;

    let cards: Array<IProjectCard> = [];
    if (passedCards === undefined) {
      if (initialDraft) {
        cardsToDraw = 5;
      } else {
        if (LunaProjectOffice.isActive(this)) {
          cardsToDraw = 5;
          cardsToKeep = 2;
        }
        if (this.isCorporation(CardName.MARS_MATHS)) {
          cardsToDraw = 5;
          cardsToKeep = 2;
        }
      }
      this.dealForDraft(cardsToDraw, cards);
    } else {
      cards = passedCards;
    }

    const messageTitle = cardsToKeep === 1 ?
      'Select a card to keep and pass the rest to ${0}' :
      'Select two cards to keep and pass the rest to ${0}';
    this.setWaitingFor(
      new SelectCard(
        newMessage(messageTitle, (b) => b.rawString(playerName)), // TODO(kberg): replace with player?`
        'Keep',
        cards,
        {min: cardsToKeep, max: cardsToKeep, played: false})
        .andThen((selected) => {
          selected.forEach((card) => {
            this.draftedCards.push(card);
            cards = cards.filter((c) => c !== card);
          });
          this.game.playerIsFinishedWithDraftingPhase(initialDraft, this, cards);
          return undefined;
        }),
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
    if (draftVariant) {
      dealtCards = this.draftedCards;
      this.draftedCards = [];
    } else {
      let cardsToDraw = 4;
      if (this.isCorporation(CardName.MARS_MATHS)) {
        cardsToDraw = 5;
      }
      if (LunaProjectOffice.isActive(this)) {
        cardsToDraw = 5;
      }
      this.dealForDraft(cardsToDraw, dealtCards);
    }

    let cardsToKeep = 4;
    if (LunaProjectOffice.isActive(this)) {
      // If Luna Project is active, they get to keep the 5 cards they drafted
      cardsToKeep = 5;
    }

    // TODO(kberg): Using .execute to rely on directly calling setWaitingFor is not great.
    const action = new ChooseCards(this, dealtCards, {paying: true, keepMax: cardsToKeep}).execute();
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

    // TODO(kberg): put this in a callback.
    if (card.tags.includes(Tag.SPACE) && PartyHooks.shouldApplyPolicy(this, PartyName.UNITY, 'up04')) {
      cost -= 2;
    }

    return Math.max(cost, 0);
  }

  private paymentOptionsForCard(card: IProjectCard): PaymentOptions {
    return {
      heat: this.canUseHeatAsMegaCredits,
      steel: this.lastCardPlayed === CardName.LAST_RESORT_INGENUITY || card.tags.includes(Tag.BUILDING),
      plants: card.tags.includes(Tag.BUILDING) && this.cardIsInEffect(CardName.MARTIAN_LUMBER_CORP),
      titanium: this.lastCardPlayed === CardName.LAST_RESORT_INGENUITY || card.tags.includes(Tag.SPACE),
      lunaTradeFederationTitanium: this.canUseTitaniumAsMegacredits,
      seeds: card.tags.includes(Tag.PLANT) || card.name === CardName.GREENERY_STANDARD_PROJECT,
      floaters: card.tags.includes(Tag.VENUS),
      microbes: card.tags.includes(Tag.PLANT),
      lunaArchivesScience: card.tags.includes(Tag.MOON),
      // TODO(kberg): add this.isCorporation(CardName.SPIRE)
      spireScience: card.type === CardType.STANDARD_PROJECT,
      // TODO(kberg): add this.isCorporation(CardName.AURORAI)
      auroraiData: card.type === CardType.STANDARD_PROJECT,
      graphene: card.tags.includes(Tag.CITY) || card.tags.includes(Tag.SPACE),
      kuiperAsteroids: card.name === CardName.AQUIFER_STANDARD_PROJECT || card.name === CardName.ASTEROID_STANDARD_PROJECT,
    };
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

    // TODO(kberg): Move this.paymentOptionsForCard to a parameter.
    const totalToPay = this.payingAmount(payment, this.paymentOptionsForCard(selectedCard));

    if (totalToPay < cardCost) {
      throw new Error('Did not spend enough to pay for card');
    }
    return this.playCard(selectedCard, payment, cardAction);
  }

  public resourcesOnCard(name: CardName): number {
    const card = this.tableau.find((card) => card.name === name);
    return card?.resourceCount ?? 0;
  }

  public getSpendableMicrobes(): number {
    return this.resourcesOnCard(CardName.PSYCHROPHILES);
  }

  public getSpendableFloaters(): number {
    return this.resourcesOnCard(CardName.DIRIGIBLES);
  }

  public getSpendableLunaArchiveScienceResources(): number {
    return this.resourcesOnCard(CardName.LUNA_ARCHIVES);
  }

  public getSpendableSeedResources(): number {
    return this.getCorporation(CardName.SOYLENT_SEEDLING_SYSTEMS)?.resourceCount ?? 0;
  }

  public getSpendableData(): number {
    return this.getCorporation(CardName.AURORAI)?.resourceCount ?? 0;
  }

  public getSpendableGraphene(): number {
    return this.resourcesOnCard(CardName.CARBON_NANOSYSTEMS);
  }

  public getSpendableKuiperAsteroids(): number {
    return this.resourcesOnCard(CardName.KUIPER_COOPERATIVE);
  }

  public getSpendableSpireScienceResources(): number {
    return this.getCorporation(CardName.SPIRE)?.resourceCount ?? 0;
  }

  public pay(payment: Payment) {
    const standardUnits = Units.of({
      megacredits: payment.megaCredits,
      steel: payment.steel,
      titanium: payment.titanium,
      plants: payment.plants,
    });

    this.stock.deductUnits(standardUnits);

    if (payment.heat > 0) {
      this.defer(this.spendHeat(payment.heat));
    }

    const removeResourcesOnCard = (name: CardName, count: number) => {
      if (count === 0) {
        return;
      }
      const card = this.tableau.find((card) => card.name === name);
      if (card === undefined) {
        throw new Error('Card ' + name + ' not found');
      }
      this.removeResourceFrom(card, count, {log: true});
    };

    removeResourcesOnCard(CardName.PSYCHROPHILES, payment.microbes);
    removeResourcesOnCard(CardName.DIRIGIBLES, payment.floaters);
    removeResourcesOnCard(CardName.LUNA_ARCHIVES, payment.lunaArchivesScience);
    removeResourcesOnCard(CardName.SPIRE, payment.spireScience);
    removeResourcesOnCard(CardName.CARBON_NANOSYSTEMS, payment.graphene);
    removeResourcesOnCard(CardName.SOYLENT_SEEDLING_SYSTEMS, payment.seeds);
    removeResourcesOnCard(CardName.AURORAI, payment.auroraiData);
    removeResourcesOnCard(CardName.KUIPER_COOPERATIVE, payment.kuiperAsteroids);

    if (payment.megaCredits > 0 || payment.steel > 0 || payment.titanium > 0) {
      PathfindersExpansion.addToSolBank(this);
    }
  }

  public playCard(selectedCard: IProjectCard, payment?: Payment, cardAction: CardAction = 'add'): undefined {
    if (payment !== undefined) {
      this.pay(payment);
    }

    ColoniesHandler.onCardPlayed(this.game, selectedCard);

    if (selectedCard.type !== CardType.PROXY) {
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
    // Do nothing, used for Double Down.
    case 'action-only':
      break;
    }

    // See DeclareCloneTag for why.
    if (!selectedCard.tags.includes(Tag.CLONE) && cardAction !== 'action-only') {
      this.onCardPlayed(selectedCard);
    }

    return undefined;
  }

  private triggerOtherCorpEffects(playedCorporationCard: ICorporationCard) {
    // trigger other corp's effects, e.g. SaturnSystems, PharmacyUnion, Splice
    for (const somePlayer of this.game.getPlayers()) {
      for (const corporation of somePlayer.corporations) {
        if (somePlayer === this && corporation.name === playedCorporationCard.name) {
          continue;
        }
        if (corporation.onCorpCardPlayed === undefined) {
          continue;
        }
        this.game.defer(
          new SimpleDeferredAction(
            this,
            () => corporation.onCorpCardPlayed?.(this, playedCorporationCard, somePlayer)));
      }
    }
  }

  public onCardPlayed(card: IProjectCard) {
    if (card.type === CardType.PROXY) {
      return;
    }
    for (const playedCard of this.playedCards) {
      /* A player responding to their own cards played. */
      const actionFromPlayedCard = playedCard.onCardPlayed?.(this, card);
      this.defer(actionFromPlayedCard);
    }

    TurmoilHandler.applyOnCardPlayedEffect(this, card);

    /* A player responding to any other player's card played, for corp effects. */
    for (const somePlayer of this.game.getPlayersInGenerationOrder()) {
      for (const corporationCard of somePlayer.corporations) {
        const actionFromPlayedCard = corporationCard.onCardPlayed?.(this, card);
        this.defer(actionFromPlayedCard);
      }
      for (const someCard of somePlayer.playedCards) {
        const actionFromPlayedCard = someCard.onCardPlayedFromAnyPlayer?.(somePlayer, this, card);
        this.defer(actionFromPlayedCard);
      }
    }

    PathfindersExpansion.onCardPlayed(this, card);
  }

  /* Visible for testing */
  public playActionCard(): PlayerInput {
    return new SelectCard<ICard & IActionCard>(
      'Perform an action from a played card',
      'Take action',
      this.getPlayableActionCards(),
      {selectBlueCardAction: true})
      .andThen(([card]) => {
        this.game.log('${0} used ${1} action', (b) => b.player(this).card(card));
        const action = card.action(this);
        this.defer(action);
        this.actionsThisGeneration.add(card.name);
        return undefined;
      });
  }

  private playCeoOPGAction(): PlayerInput {
    return new SelectCard<ICeoCard>(
      'Use CEO once per game action',
      'Take action',
      this.getUsableOPGCeoCards(),
      {selectBlueCardAction: true})
      .andThen(([card]) => {
        this.game.log('${0} used ${1} action', (b) => b.player(this).card(card));
        const action = card.action?.(this);
        this.defer(action);
        this.actionsThisGeneration.add(card.name);
        return undefined;
      });
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
      this.stock.deduct(Resource.MEGACREDITS, diff);
    }
    // Calculating this before playing the corporation card, which might change the player's hand size.
    const numberOfCardInHand = this.cardsInHand.length;
    corporationCard.play(this);
    if (corporationCard.initialAction !== undefined || corporationCard.firstAction !== undefined) {
      this.pendingInitialActions.push(corporationCard);
    }
    this.game.log('${0} played ${1}', (b) => b.player(this).card(corporationCard));
    if (additionalCorp === false) {
      this.game.log('${0} kept ${1} project cards', (b) => b.player(this).number(numberOfCardInHand));
    }

    this.triggerOtherCorpEffects(corporationCard);
    ColoniesHandler.onCardPlayed(this.game, corporationCard);
    PathfindersExpansion.onCardPlayed(this, corporationCard);

    if (!additionalCorp) {
      this.game.playerIsFinishedWithResearchPhase(this);
    }
  }

  public drawCard(count?: number, options?: DrawOptions): undefined {
    return DrawCards.keepAll(this, count, options).execute();
  }

  public drawCardKeepSome(count: number, options: AllOptions): void {
    this.game.defer(DrawCards.keepSome(this, count, options));
  }

  public discardPlayedCard(card: IProjectCard) {
    const found = inplaceRemove(this.playedCards, card);
    if (found === false) {
      console.error(`Error: card ${card.name} not in ${this.id}'s hand`);
      return;
    }
    this.game.projectDeck.discard(card);
    card.onDiscard?.(this);
    this.game.log('${0} discarded ${1}', (b) => b.player(this).card(card));
  }

  public discardCardFromHand(card: IProjectCard, options?: {log?: boolean}) {
    const found = inplaceRemove(this.cardsInHand, card);
    if (found === false) {
      console.error(`Error: card ${card.name} not in ${this.id}'s hand`);
      return;
    }
    this.game.projectDeck.discard(card);
    if (options?.log === true) {
      this.game.log('${0} discarded ${1}', (b) => b.player(this).card(card), {reservedFor: this});
    }
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
    this.stock.deduct(Resource.HEAT, amount);
    return cb();
  }

  private claimMilestone(milestone: IMilestone): SelectOption {
    return new SelectOption(milestone.name, 'Claim - ' + '('+ milestone.name + ')').andThen(() => {
      if (this.game.milestoneClaimed(milestone)) {
        throw new Error(milestone.name + ' is already claimed');
      }
      this.game.claimedMilestones.push({
        player: this,
        milestone: milestone,
      });
      // VanAllen CEO Hook for Milestones
      const vanAllen = this.game.getCardPlayerOrUndefined(CardName.VANALLEN);
      if (vanAllen !== undefined) {
        vanAllen.stock.add(Resource.MEGACREDITS, 3, {log: true, from: this});
      }
      if (!this.cardIsInEffect(CardName.VANALLEN)) {
        const cost = this.milestoneCost();
        this.game.defer(new SelectPaymentDeferred(this, cost, {title: 'Select how to pay for milestone'}));
      }
      this.game.log('${0} claimed ${1} milestone', (b) => b.player(this).milestone(milestone));
      return undefined;
    });
  }

  private milestoneCost() {
    return this.isCorporation(CardName.NIRGAL_ENTERPRISES) ? 0 : MILESTONE_COST;
  }

  private awardFundingCost() {
    return this.isCorporation(CardName.NIRGAL_ENTERPRISES) ? 0 : this.game.getAwardFundingCost();
  }

  private fundAward(award: IAward): PlayerInput {
    return new SelectOption(award.name, 'Fund - ' + '(' + award.name + ')').andThen(() => {
      this.game.defer(new SelectPaymentDeferred(this, this.awardFundingCost(), {title: 'Select how to pay for award'}));
      this.game.fundAward(this, award);
      return undefined;
    });
  }

  private endTurnOption(): PlayerInput {
    return new SelectOption('End Turn', 'End').andThen(() => {
      this.actionsTakenThisRound = this.availableActionsThisRound; // This allows for variable actions per turn, like Mars Maths
      this.game.log('${0} ended turn', (b) => b.player(this));
      return undefined;
    });
  }

  public pass(): void {
    this.game.playerHasPassed(this);
    this.lastCardPlayed = undefined;
    this.game.log('${0} passed', (b) => b.player(this));
  }

  private passOption(): PlayerInput {
    return new SelectOption('Pass for this generation', 'Pass').andThen(() => {
      this.pass();
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
          'Select space for greenery tile',
          this.game.board.getAvailableSpacesForGreenery(this))
          .andThen((space) => {
            // Do not raise oxygen or award TR for final greenery placements
            this.game.addGreenery(this, space, false);
            this.stock.deduct(Resource.PLANTS, this.plantsNeededForGreenery);

            this.takeActionForFinalGreenery();

            // Resolve Philares deferred actions
            if (this.game.deferredActions.length > 0) resolveFinalGreeneryDeferredActions();
            return undefined;
          }));
      action.options.push(
        new SelectOption('Don\'t place a greenery', 'Confirm').andThen(() => {
          this.game.playerIsDoneWithGame(this);
          return undefined;
        }),
      );
      this.setWaitingForSafely(action);
      return;
    }

    if (this.game.deferredActions.length > 0) {
      resolveFinalGreeneryDeferredActions();
    } else {
      this.game.playerIsDoneWithGame(this);
    }
  }

  private getPlayableCeoCards(): Array<IProjectCard> {
    return this.ceoCardsInHand.filter((card) => card.canPlay?.(this) === true);
  }

  public getPlayableCards(): Array<PlayableCard> {
    const candidateCards: Array<IProjectCard> = [...this.cardsInHand];
    // Self Replicating robots check
    const card = this.playedCards.find((card) => card.name === CardName.SELF_REPLICATING_ROBOTS);
    if (card instanceof SelfReplicatingRobots) {
      for (const targetCard of card.targetCards) {
        candidateCards.push(targetCard.card);
      }
    }

    const playableCards: Array<PlayableCard> = [];
    for (const card of candidateCards) {
      const canPlay = this.canPlay(card);
      if (canPlay !== false) {
        playableCards.push({
          card,
          details: canPlay,
        });
      }
    }
    return playableCards;
  }

  public affordOptionsForCard(card: IProjectCard): CanAffordOptions {
    const trSource: TRSource | DynamicTRSource | undefined = card.tr || (card.behavior !== undefined ? getBehaviorExecutor().toTRSource(card.behavior) : undefined);
    return {
      cost: this.getCardCost(card),
      ...this.paymentOptionsForCard(card),
      reserveUnits: MoonExpansion.adjustedReserveCosts(this, card),
      tr: trSource,
    };
  }

  public canPlay(card: IProjectCard): boolean | YesAnd {
    const options = this.affordOptionsForCard(card);
    if (!this.canAfford(options)) {
      return false;
    }
    return this.simpleCanPlay(card, options);
  }

  /**
   * Verify if requirements for the card can be met, ignoring the project cost.
   * Only made public for tests.
   */
  // TODO(kberg): use CanPlayResponse
  public simpleCanPlay(card: IProjectCard, canAffordOptions?: CanAffordOptions): boolean | YesAnd {
    return card.canPlay(this, canAffordOptions);
  }

  private maxSpendable(reserveUnits: Units = Units.EMPTY): Payment {
    return {
      megaCredits: this.megaCredits - reserveUnits.megacredits,
      steel: this.steel - reserveUnits.steel,
      titanium: this.titanium - reserveUnits.titanium,
      plants: this.plants - reserveUnits.plants,
      heat: this.availableHeat() - reserveUnits.heat,
      floaters: this.getSpendableFloaters(),
      microbes: this.getSpendableMicrobes(),
      lunaArchivesScience: this.getSpendableLunaArchiveScienceResources(),
      spireScience: this.getSpendableSpireScienceResources(),
      seeds: this.getSpendableSeedResources(),
      auroraiData: this.getSpendableData(),
      graphene: this.getSpendableGraphene(),
      kuiperAsteroids: this.getSpendableKuiperAsteroids(),
    };
  }

  public canSpend(payment: Payment, reserveUnits?: Units): boolean {
    const maxPayable = this.maxSpendable(reserveUnits);

    return PAYMENT_UNITS.every((key) =>
      0 <= payment[key] && payment[key] <= maxPayable[key]);
  }

  /**
   * Returns the value of the suppled payment given the payment options.
   *
   * For example, if the payment is 3M€ and 2 steel, given that steel by default is
   * worth 2M€, this will return 7.
   *
   * @param {Payment} payment the resources being paid.
   * @param {PaymentOptions} options any configuration defining the accepted form of payment.
   * @return {number} a number representing the value of payment in M€.
   */
  public payingAmount(payment: Payment, options?: Partial<PaymentOptions>): number {
    const multiplier = {
      ...DEFAULT_PAYMENT_VALUES,
      steel: this.getSteelValue(),
      titanium: this.getTitaniumValue(),
    };

    const usable: {[key in PaymentUnit]: boolean} = {
      megaCredits: true,
      steel: options?.steel ?? false,
      titanium: options?.titanium ?? false,
      heat: this.canUseHeatAsMegaCredits,
      plants: options?.plants ?? false,
      microbes: options?.microbes ?? false,
      floaters: options?.floaters ?? false,
      lunaArchivesScience: options?.lunaArchivesScience ?? false,
      spireScience: options?.spireScience ?? false,
      seeds: options?.seeds ?? false,
      auroraiData: options?.auroraiData ?? false,
      graphene: options?.graphene ?? false,
      kuiperAsteroids: options?.kuiperAsteroids ?? false,
    };

    // HOOK: Luna Trade Federation
    if (usable.titanium === false && payment.titanium > 0 && this.isCorporation(CardName.LUNA_TRADE_FEDERATION)) {
      usable.titanium = true;
      multiplier.titanium -= 1;
    }

    let totalToPay = 0;
    for (const key of PAYMENT_UNITS) {
      if (usable[key]) totalToPay += payment[key] * multiplier[key];
    }

    return totalToPay;
  }

  /**
   * Returns `true` if the player can afford to pay `options.cost` mc (possibly replaceable with steel, titanium etc.)
   * and additionally pay the reserveUnits (no replaces here)
   */
  public canAfford(o: number | CanAffordOptions): boolean {
    const options: CanAffordOptions = typeof(o) === 'number' ? {cost: o} : {...o};

    // TODO(kberg): These are set both here and in SelectPayment. Consolidate, perhaps.
    options.heat = this.canUseHeatAsMegaCredits;
    options.lunaTradeFederationTitanium = this.canUseTitaniumAsMegacredits;

    const reserveUnits = options.reserveUnits ?? Units.EMPTY;
    if (reserveUnits.heat > 0) {
      // Special-case heat
      const unitsWithoutHeat = {...reserveUnits, heat: 0};
      if (!this.stock.has(unitsWithoutHeat)) {
        return false;
      }
      if (this.availableHeat() < reserveUnits.heat) {
        return false;
      }
    } else {
      if (!this.stock.has(reserveUnits)) {
        return false;
      }
    }

    const maxPayable = this.maxSpendable(reserveUnits);
    const redsCost = TurmoilHandler.computeTerraformRatingBump(this, options.tr) * REDS_RULING_POLICY_COST;
    if (redsCost > 0) {
      const usableForRedsCost = this.payingAmount(maxPayable, {});
      if (usableForRedsCost < redsCost) {
        return false;
      }
    }

    const usable = this.payingAmount(maxPayable, options);

    return options.cost + redsCost <= usable;
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

  public getStandardProjectOption(): SelectCard<IStandardProjectCard> {
    const standardProjects: Array<IStandardProjectCard> = this.getStandardProjects();

    return new SelectCard(
      'Standard projects',
      'Confirm',
      standardProjects,
      {enabled: standardProjects.map((card) => card.canAct(this))})
      .andThen(([card]) => card.action(this));
  }

  private headStartIsInEffect() {
    if (this.game.phase === Phase.PRELUDES && this.cardIsInEffect(CardName.HEAD_START)) {
      if (this.actionsTakenThisRound < 2) {
        return true;
      }
    }
    return false;
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

    if (this.actionsTakenThisRound === 0 || game.gameOptions.undoOption) game.save();
    // if (saveBeforeTakingAction) game.save();

    const headStartIsInEffect = this.headStartIsInEffect();

    if (!headStartIsInEffect) {
      // Prelude cards have to be played first
      if (this.preludeCardsInHand.length > 0) {
        game.phase = Phase.PRELUDES;

        const selectPrelude = PreludesExpansion.playPrelude(this, this.preludeCardsInHand);

        this.setWaitingFor(selectPrelude, () => {
          if (this.preludeCardsInHand.length === 0 && !this.headStartIsInEffect()) {
            game.playerIsFinishedTakingActions();
            return;
          }

          this.takeAction();
        });
        return;
      }

      if (this.ceoCardsInHand.length > 0) {
        // The CEO phase occurs between the Prelude phase and before the Action phase.
        // All CEO cards are played before players take their first normal actions.
        game.phase = Phase.CEOS;
        const playableCeoCards = this.getPlayableCeoCards();
        for (let i = playableCeoCards.length - 1; i >= 0; i--) {
          // start from the end of the list and work backwards, we're removing items as we go.
          const card = this.ceoCardsInHand[i];
          this.playCard(card);
        }
        // Null out ceoCardsInHand, anything left was unplayable.
        this.ceoCardsInHand = [];
        this.takeAction(); // back to top
      } else {
        game.phase = Phase.ACTION;
      }

      if (game.hasPassedThisActionPhase(this) || (this.allOtherPlayersHavePassed() === false && this.actionsTakenThisRound >= this.availableActionsThisRound)) {
        this.actionsTakenThisRound = 0;
        this.availableActionsThisRound = 2;
        game.resettable = true;
        game.playerIsFinishedTakingActions();
        return;
      }
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
          newMessage('Take first action of ${0} corporation', (b) => b.card(corp)),
          corp.initialActionText)
          .andThen(() => {
            this.runInitialAction(corp);
            this.pendingInitialActions.splice(this.pendingInitialActions.indexOf(corp), 1);
            return undefined;
          });
        orOptions.options.push(option);
      });

      if (!headStartIsInEffect) {
        orOptions.options.push(this.passOption());
      }

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

  // TODO(kberg): perhaps move to Card
  public runInitialAction(corp: ICorporationCard) {
    this.game.defer(new SimpleDeferredAction(this, () => {
      if (corp.initialAction) {
        return corp.initialAction(this);
      } else if (corp.firstAction !== undefined) {
        getBehaviorExecutor().execute(corp.firstAction, this, corp);
      }
      return undefined;
    }));
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

    // VanAllen can claim milestones for free:
    if ((this.canAfford(this.milestoneCost()) || this.cardIsInEffect(CardName.VANALLEN)) && !this.game.allMilestonesClaimed() ) {
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
      action.options.push(new SelectOption('Convert 8 heat into temperature', 'Convert heat').andThen(() => {
        return convertHeat.action(this);
      }));
    }

    const turmoilInput = TurmoilHandler.partyAction(this);
    if (turmoilInput !== undefined) {
      action.options.push(turmoilInput);
    }

    if (this.getPlayableActionCards().length > 0) {
      action.options.push(this.playActionCard());
    }

    if (CeoExtension.ceoActionIsUsable(this)) {
      action.options.push(this.playCeoOPGAction());
    }

    const playableCards = this.getPlayableCards();
    if (playableCards.length !== 0) {
      action.options.push(new SelectProjectCardToPlay(this, playableCards));
    }

    const coloniesTradeAction = this.colonies.coloniesTradeAction();
    if (coloniesTradeAction !== undefined) {
      action.options.push(coloniesTradeAction);
    }

    // If you can pay to add a delegate to a party.
    Turmoil.ifTurmoil(this.game, (turmoil) => {
      const input = turmoil.getSendDelegateInput(this);
      if (input !== undefined) {
        action.options.push(input);
      }
    });

    if (this.game.getPlayers().length > 1 &&
      this.actionsTakenThisRound > 0 &&
      !this.game.gameOptions.fastModeOption &&
      this.allOtherPlayersHavePassed() === false) {
      action.options.push(this.endTurnOption());
    }

    const fundingCost = this.awardFundingCost();
    if (this.canAfford(fundingCost) && !this.game.allAwardsFunded()) {
      const remainingAwards = new OrOptions();
      remainingAwards.title = newMessage('Fund an award (${0} M€)', (b) => b.number(fundingCost)),
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
    if (this.waitingFor !== undefined) {
      const message = 'Overwriting a waitingFor: ' + this.waitingFor.type;
      if (THROW_WAITING_FOR) {
        throw new Error(message);
      } else {
        console.warn(message);
      }
    }
    this.timer.start();
    this.waitingFor = input;
    this.waitingForCb = cb;
    this.game.inputsThisRound++;
  }

  // This was only built for the Philares/Final Greenery case. Might not work elsewhere.
  public setWaitingForSafely(input: PlayerInput, cb: () => void = () => {}): void {
    if (this.waitingFor === undefined) {
      this.setWaitingFor(input, cb);
    } else {
      const oldcb = this.waitingForCb;
      this.waitingForCb =
        oldcb === undefined ?
          cb :
          () => {
            oldcb();
            this.setWaitingForSafely(input, cb);
          };
    }
  }

  public serialize(): SerializedPlayer {
    const result: SerializedPlayer = {
      id: this.id,
      corporations: this.corporations.map((corporation) => {
        const serialized = {
          name: corporation.name,
          resourceCount: corporation.resourceCount,
          isDisabled: false,
        };
        corporation.serialize?.(serialized);
        return serialized;
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
      // Martian Lumber Corp
      canUsePlantsAsMegaCredits: this.canUsePlantsAsMegacredits,
      // Luna Trade Federation
      canUseTitaniumAsMegacredits: this.canUseTitaniumAsMegacredits,
      // This generation / this round
      actionsTakenThisRound: this.actionsTakenThisRound,
      actionsThisGeneration: Array.from(this.actionsThisGeneration),
      pendingInitialActions: this.pendingInitialActions.map((c) => c.name),
      // Cards
      dealtCorporationCards: this.dealtCorporationCards.map((c) => c.name),
      dealtPreludeCards: this.dealtPreludeCards.map((c) => c.name),
      dealtCeoCards: this.dealtCeoCards.map((c) => c.name),
      dealtProjectCards: this.dealtProjectCards.map((c) => c.name),
      cardsInHand: this.cardsInHand.map((c) => c.name),
      preludeCardsInHand: this.preludeCardsInHand.map((c) => c.name),
      ceoCardsInHand: this.ceoCardsInHand.map((c) => c.name),
      playedCards: this.playedCards.map(serializeProjectCard),
      draftedCards: this.draftedCards.map((c) => c.name),
      cardCost: this.cardCost,
      needsToDraft: this.needsToDraft,
      cardDiscount: this.colonies.cardDiscount,
      // Colonies
      // TODO(kberg): consider a ColoniesSerializer or something.
      fleetSize: this.colonies.getFleetSize(),
      tradesThisGeneration: this.colonies.tradesThisGeneration,
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
    // TODO(kberg): Remove ?? false after 2023-11-01
    player.canUsePlantsAsMegacredits = d.canUsePlantsAsMegaCredits ?? false;
    player.canUseTitaniumAsMegacredits = d.canUseTitaniumAsMegacredits;
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
    player.colonies.tradesThisGeneration = d.tradesThisGeneration;
    player.turmoilPolicyActionUsed = d.turmoilPolicyActionUsed;
    player.politicalAgendasActionUsedCount = d.politicalAgendasActionUsedCount;

    player.lastCardPlayed = d.lastCardPlayed;

    // Rebuild removed from play cards (Playwrights, Odyssey)
    player.removedFromPlayCards = cardFinder.cardsFromJSON(d.removedFromPlayCards);

    player.actionsThisGeneration = new Set<CardName>(d.actionsThisGeneration);

    if (d.pickedCorporationCard !== undefined) {
      player.pickedCorporationCard = cardFinder.getCorporationCardByName(d.pickedCorporationCard);
    }

    // Rebuild corporation cards
    const corporations = d.corporations;

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
        card.deserialize?.(corporation);
        player.corporations.push(card);
      }
    }

    player.pendingInitialActions = cardFinder.corporationCardsFromJSON(d.pendingInitialActions ?? []);
    player.dealtCorporationCards = cardFinder.corporationCardsFromJSON(d.dealtCorporationCards);
    player.dealtPreludeCards = cardFinder.cardsFromJSON(d.dealtPreludeCards);
    player.dealtCeoCards = cardFinder.ceosFromJSON(d.dealtCeoCards);
    player.dealtProjectCards = cardFinder.cardsFromJSON(d.dealtProjectCards);
    player.cardsInHand = cardFinder.cardsFromJSON(d.cardsInHand);
    // I don't like "as IPreludeCard" but this is pretty safe.
    player.preludeCardsInHand = cardFinder.cardsFromJSON(d.preludeCardsInHand) as Array<IPreludeCard>;
    player.ceoCardsInHand = cardFinder.ceosFromJSON(d.ceoCardsInHand);
    player.playedCards = d.playedCards.map((element: SerializedCard) => deserializeProjectCard(element, cardFinder));
    player.draftedCards = cardFinder.cardsFromJSON(d.draftedCards);

    player.timer = Timer.deserialize(d.timer);

    return player;
  }

  /* Shorthand for deferring things */
  public defer(input: PlayerInput | undefined | void, priority: Priority = Priority.DEFAULT): void {
    if (input === undefined) {
      return;
    }
    const action = new SimpleDeferredAction(this, () => input, priority);
    this.game.defer(action);
  }
}
