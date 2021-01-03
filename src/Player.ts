import * as constants from './constants';
import {AndOptions} from './inputs/AndOptions';
import {Aridor} from './cards/colonies/Aridor';
import {Board} from './boards/Board';
import {CardFinder} from './CardFinder';
import {CardModel} from './models/CardModel';
import {CardName} from './CardName';
import {CardType} from './cards/CardType';
import {ColonyModel} from './models/ColonyModel';
import {ColonyName} from './colonies/ColonyName';
import {Color} from './Color';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {Game} from './Game';
import {HowToPay} from './inputs/HowToPay';
import {IAward} from './awards/IAward';
import {ICard} from './cards/ICard';
import {Colony} from './colonies/Colony';
import {ISerializable} from './ISerializable';
import {IMilestone} from './milestones/IMilestone';
import {IProjectCard} from './cards/IProjectCard';
import {ISpace} from './boards/ISpace';
import {ITagCount} from './ITagCount';
import {LogMessageDataType} from './LogMessageDataType';
import {MAX_FLEET_SIZE, REDS_RULING_POLICY_COST} from './constants';
import {MiningCard} from './cards/base/MiningCard';
import {OrOptions} from './inputs/OrOptions';
import {PartyHooks} from './turmoil/parties/PartyHooks';
import {PartyName} from './turmoil/parties/PartyName';
import {PharmacyUnion} from './cards/promo/PharmacyUnion';
import {Phase} from './Phase';
import {PlayerInput} from './PlayerInput';
import {ResourceType} from './ResourceType';
import {Resources} from './Resources';
import {SelectAmount} from './inputs/SelectAmount';
import {SelectCard} from './inputs/SelectCard';
import {SellPatents} from './cards/standardProjects/SellPatents';
import {SendDelegateToArea} from './deferredActions/SendDelegateToArea';
import {DeferredAction} from './deferredActions/DeferredAction';
import {SelectHowToPayDeferred} from './deferredActions/SelectHowToPayDeferred';
import {SelectColony} from './inputs/SelectColony';
import {SelectDelegate} from './inputs/SelectDelegate';
import {SelectHowToPay} from './inputs/SelectHowToPay';
import {SelectHowToPayForCard} from './inputs/SelectHowToPayForCard';
import {SelectOption} from './inputs/SelectOption';
import {SelectPlayer} from './inputs/SelectPlayer';
import {SelectSpace} from './inputs/SelectSpace';
import {SelfReplicatingRobots} from './cards/promo/SelfReplicatingRobots';
import {SerializedCard} from './SerializedCard';
import {SerializedPlayer} from './SerializedPlayer';
import {SpaceType} from './SpaceType';
import {StormCraftIncorporated} from './cards/colonies/StormCraftIncorporated';
import {Tags} from './cards/Tags';
import {TileType} from './TileType';
import {VictoryPointsBreakdown} from './VictoryPointsBreakdown';
import {IProductionUnits} from './inputs/IProductionUnits';
import {SelectProductionToLose} from './inputs/SelectProductionToLose';
import {IAresGlobalParametersResponse, ShiftAresGlobalParameters} from './inputs/ShiftAresGlobalParameters';
import {Timer} from './Timer';
import {GameLoader} from './database/GameLoader';
import {CardLoader} from './CardLoader';

export type PlayerId = string;

export class Player implements ISerializable<SerializedPlayer> {
  public readonly id: PlayerId;
  private usedUndo: boolean = false;
  private waitingFor?: PlayerInput;
  private waitingForCb?: () => void;

  // Corporate identity
  public corporationCard: CorporationCard | undefined = undefined;
  // Used only during set-up
  public pickedCorporationCard: CorporationCard | undefined = undefined;

  // Terraforming Rating
  private terraformRating: number = 20;
  public hasIncreasedTerraformRatingThisGeneration: boolean = false;
  public terraformRatingAtGenerationStart: number = 20;

  // Resources
  public megaCredits: number = 0;
  private megaCreditProduction: number = 0;
  public steel: number = 0;
  private steelProduction: number = 0;
  public titanium: number = 0;
  private titaniumProduction: number = 0;
  public plants: number = 0;
  private plantProduction: number = 0;
  public energy: number = 0;
  private energyProduction: number = 0;
  public heat: number = 0;
  private heatProduction: number = 0;

  // Resource values
  private titaniumValue: number = 3;
  private steelValue: number = 2;
  // Helion
  public canUseHeatAsMegaCredits: boolean = false;

  // This generation / this round
  public actionsTakenThisRound: number = 0;
  private actionsThisGeneration: Set<CardName> = new Set();
  public lastCardPlayed: IProjectCard | undefined;
  private corporationInitialActionDone: boolean = false;

  // Cards
  public dealtCorporationCards: Array<CorporationCard> = [];
  public dealtProjectCards: Array<IProjectCard> = [];
  public dealtPreludeCards: Array<IProjectCard> = [];
  public cardsInHand: Array<IProjectCard> = [];
  public preludeCardsInHand: Array<IProjectCard> = [];
  public playedCards: Array<IProjectCard> = [];
  public draftedCards: Array<IProjectCard> = [];
  public cardCost: number = constants.CARD_COST;
  public needsToDraft: boolean | undefined = undefined;
  public cardDiscount: number = 0;

  public timer: Timer = Timer.newInstance();

  // Colonies
  private fleetSize: number = 1;
  public tradesThisTurn: number = 0;
  public colonyTradeOffset: number = 0;
  public colonyTradeDiscount: number = 0;
  public colonyVictoryPoints: number = 0;

  // Turmoil
  public turmoilScientistsActionUsed: boolean = false;

  public victoryPointsBreakdown = new VictoryPointsBreakdown();
  public oceanBonus: number = constants.OCEAN_BONUS;

  // Custom cards
  // Leavitt Station.
  public scienceTagCount: number = 0;
  // Ecoline
  public plantsNeededForGreenery: number = 8;
  // Lawsuit
  public removingPlayers: Array<PlayerId> = [];
  // For Playwrights corp.
  // removedFromPlayCards is a bit of a misname: it's a temporary storage for
  // cards that provide 'next card' discounts. This will clear between turns.
  public removedFromPlayCards: Array<IProjectCard> = [];

  constructor(
    public name: string,
    public color: Color,
    public beginner: boolean,
    public handicap: number = 0,
    id: PlayerId) {
    this.id = id;
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

  public isCorporation(corporationName: CardName): boolean {
    return this.corporationCard !== undefined && this.corporationCard.name === corporationName;
  }

  public getTitaniumValue(game: Game): number {
    if (PartyHooks.shouldApplyPolicy(game, PartyName.UNITY)) return this.titaniumValue + 1;
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

  public decreaseTerraformRating() {
    this.terraformRating--;
  }

  public increaseTerraformRating(game: Game) {
    if (!game.gameOptions.turmoilExtension) {
      this.terraformRating++;
      this.hasIncreasedTerraformRatingThisGeneration = true;
      return;
    }

    // Turmoil Reds capacity
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && game.phase === Phase.ACTION) {
      if (this.canAfford(REDS_RULING_POLICY_COST)) {
        game.defer(new SelectHowToPayDeferred(this, REDS_RULING_POLICY_COST, false, false, 'Select how to pay for TR increase'));
      } else {
        // Cannot pay Reds, will not increase TR
        return;
      }

      this.terraformRating++;
      this.hasIncreasedTerraformRatingThisGeneration = true;
      return;
    }

    this.terraformRating++;
    this.hasIncreasedTerraformRatingThisGeneration = true;
  }

  public increaseTerraformRatingSteps(value: number, game: Game) {
    for (let i = 0; i < value; i++) {
      this.increaseTerraformRating(game);
    }
  }

  public decreaseTerraformRatingSteps(value: number) {
    this.terraformRating -= value;
  }

  public setTerraformRating(value: number) {
    return this.terraformRating = value;
  }

  public getProduction(resource: Resources): number {
    if (resource === Resources.MEGACREDITS) return this.megaCreditProduction;
    if (resource === Resources.STEEL) return this.steelProduction;
    if (resource === Resources.TITANIUM) return this.titaniumProduction;
    if (resource === Resources.PLANTS) return this.plantProduction;
    if (resource === Resources.ENERGY) return this.energyProduction;
    if (resource === Resources.HEAT) return this.heatProduction;
    throw new Error('Resource ' + resource + ' not found');
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

  private resolveMonsInsurance(game: Game) {
    if (game.monsInsuranceOwner !== undefined && game.monsInsuranceOwner !== this.id) {
      const monsInsuranceOwner: Player = game.getPlayerById(game.monsInsuranceOwner);
      const retribution: number = Math.min(monsInsuranceOwner.megaCredits, 3);
      this.megaCredits += retribution;
      monsInsuranceOwner.setResource(Resources.MEGACREDITS, -3);
      if (retribution > 0) {
        game.log('${0} received ${1} MC from ${2} owner (${3})', (b) =>
          b.player(this)
            .number(retribution)
            .cardName(CardName.MONS_INSURANCE)
            .player(monsInsuranceOwner));
      }
    }
  }

  public setResource(resource: Resources, amount : number = 1, game? : Game, fromPlayer? : Player, globalEvent? : boolean) {
    if (resource === Resources.MEGACREDITS) this.megaCredits = Math.max(0, this.megaCredits + amount);
    if (resource === Resources.STEEL) this.steel = Math.max(0, this.steel + amount);
    if (resource === Resources.TITANIUM) this.titanium = Math.max(0, this.titanium + amount);
    if (resource === Resources.PLANTS) this.plants = Math.max(0, this.plants + amount);
    if (resource === Resources.ENERGY) this.energy = Math.max(0, this.energy + amount);
    if (resource === Resources.HEAT) this.heat = Math.max(0, this.heat + amount);

    const modifier = amount > 0 ? 'increased' : 'decreased';

    if (game !== undefined && fromPlayer !== undefined && amount < 0) {
      if (fromPlayer !== this && this.removingPlayers.indexOf(fromPlayer.id) === -1) {
        this.removingPlayers.push(fromPlayer.id);
      }

      // Crash site cleanup hook
      if (fromPlayer !== this && resource === Resources.PLANTS && amount < 0) {
        game.someoneHasRemovedOtherPlayersPlants = true;
      }

      game.log('${0}\'s ${1} amount ${2} by ${3} by ${4}', (b) =>
        b.player(this)
          .string(resource)
          .string(modifier)
          .number(Math.abs(amount))
          .player(fromPlayer));
    }

    // Global event logging
    if (game !== undefined && globalEvent && amount !== 0) {
      game.log('${0}\'s ${1} amount ${2} by ${3} by Global Event', (b) =>
        b.player(this)
          .string(resource)
          .string(modifier)
          .number(Math.abs(amount)));
    }

    // Mons Insurance hook
    if (game !== undefined && amount < 0 && fromPlayer !== undefined && fromPlayer !== this) {
      this.resolveMonsInsurance(game);
    }
  }

  public addProduction(resource: Resources, amount : number = 1, game? : Game, fromPlayer? : Player, globalEvent? : boolean) {
    if (resource === Resources.MEGACREDITS) this.megaCreditProduction = Math.max(-5, this.megaCreditProduction + amount);
    if (resource === Resources.STEEL) this.steelProduction = Math.max(0, this.steelProduction + amount);
    if (resource === Resources.TITANIUM) this.titaniumProduction = Math.max(0, this.titaniumProduction + amount);
    if (resource === Resources.PLANTS) this.plantProduction = Math.max(0, this.plantProduction + amount);
    if (resource === Resources.ENERGY) this.energyProduction = Math.max(0, this.energyProduction + amount);
    if (resource === Resources.HEAT) this.heatProduction = Math.max(0, this.heatProduction + amount);

    const modifier = amount > 0 ? 'increased' : 'decreased';

    if (game !== undefined && fromPlayer !== undefined && amount < 0) {
      if (fromPlayer !== this && this.removingPlayers.indexOf(fromPlayer.id) === -1) {
        this.removingPlayers.push(fromPlayer.id);
      }
      game.log('${0}\'s ${1} production ${2} by ${3} by ${4}', (b) =>
        b.player(this)
          .string(resource)
          .string(modifier)
          .number(Math.abs(amount))
          .player(fromPlayer));
    }

    // Global event logging
    if (game !== undefined && globalEvent && amount !== 0) {
      game.log('${0}\'s ${1} production ${2} by ${3} by Global Event', (b) =>
        b.player(this)
          .string(resource)
          .string(modifier)
          .number(Math.abs(amount)));
    }

    // Manutech hook
    if (amount > 0 && this.corporationCard !== undefined && this.corporationCard.name === CardName.MANUTECH) {
      if (resource === Resources.MEGACREDITS) this.megaCredits += amount;
      if (resource === Resources.STEEL) this.steel += amount;
      if (resource === Resources.TITANIUM) this.titanium += amount;
      if (resource === Resources.PLANTS) this.plants += amount;
      if (resource === Resources.ENERGY) this.energy += amount;
      if (resource === Resources.HEAT) this.heat += amount;
    }

    // Mons Insurance hook
    if (game !== undefined && amount < 0 && fromPlayer !== undefined && fromPlayer !== this) {
      this.resolveMonsInsurance(game);
    }
  };

  public getActionsThisGeneration(): Set<CardName> {
    return this.actionsThisGeneration;
  }

  public setActionsThisGeneration(cardName: CardName): void {
    this.actionsThisGeneration.add(cardName);
    return;
  }

  public getVictoryPoints(game: Game): VictoryPointsBreakdown {
    // Reset victory points
    this.victoryPointsBreakdown = new VictoryPointsBreakdown();

    // Victory points from corporations
    if (this.corporationCard !== undefined && this.corporationCard.getVictoryPoints !== undefined) {
      this.victoryPointsBreakdown.setVictoryPoints('victoryPoints', this.corporationCard.getVictoryPoints(this, game), this.corporationCard.name);
    }

    // Victory points from cards
    for (const playedCard of this.playedCards) {
      if (playedCard.getVictoryPoints !== undefined) {
        this.victoryPointsBreakdown.setVictoryPoints('victoryPoints', playedCard.getVictoryPoints(this, game), playedCard.name);
      }
    }

    // Victory points from TR
    this.victoryPointsBreakdown.setVictoryPoints('terraformRating', this.terraformRating);

    // Victory points from awards
    this.giveAwards(game);

    // Victory points from milestones
    for (const milestone of game.claimedMilestones) {
      if (milestone.player !== undefined && milestone.player.id === this.id) {
        this.victoryPointsBreakdown.setVictoryPoints('milestones', 5, 'Claimed '+milestone.milestone.name+' milestone');
      }
    }

    // Victory points from board
    game.board.spaces.forEach((space) => {
      // Victory points for greenery tiles
      if (space.tile && space.tile.tileType === TileType.GREENERY && space.player !== undefined && space.player.id === this.id) {
        this.victoryPointsBreakdown.setVictoryPoints('greenery', 1);
      }

      // Victory points for greenery tiles adjacent to cities
      if (Board.isCitySpace(space) && space.player !== undefined && space.player.id === this.id) {
        const adjacent = game.board.getAdjacentSpaces(space);
        for (const adj of adjacent) {
          if (adj.tile && adj.tile.tileType === TileType.GREENERY) {
            this.victoryPointsBreakdown.setVictoryPoints('city', 1);
          }
        }
      }
    });

    // Turmoil Victory Points
    const includeTurmoilVP : boolean = game.gameIsOver() || game.phase === Phase.END;

    if (includeTurmoilVP && game.gameOptions.turmoilExtension && game.turmoil) {
      this.victoryPointsBreakdown.setVictoryPoints('victoryPoints', game.turmoil.getPlayerVictoryPoints(this), 'Turmoil Points');
    }

    // Titania Colony VP
    if (this.colonyVictoryPoints > 0) {
      this.victoryPointsBreakdown.setVictoryPoints('victoryPoints', this.colonyVictoryPoints, 'Colony VP');
    }

    this.victoryPointsBreakdown.updateTotal();
    return this.victoryPointsBreakdown;
  }

  public cardIsInEffect(cardName: CardName): boolean {
    return this.playedCards.find(
      (playedCard) => playedCard.name === cardName) !== undefined;
  }

  public hasProtectedHabitats(): boolean {
    return this.cardIsInEffect(CardName.PROTECTED_HABITATS);
  }

  public plantsAreProtected(): boolean {
    return this.hasProtectedHabitats() || this.cardIsInEffect(CardName.ASTEROID_DEFLECTION_SYSTEM);
  }

  // TODO(kberg): counting cities on the board is done in 3 different places, consolidate.
  // Search for uses of TileType.OCEAN_CITY for reference.
  public getCitiesCount(game: Game) {
    return game.getSpaceCount(TileType.CITY, this) +
        game.getSpaceCount(TileType.CAPITAL, this) +
        game.getSpaceCount(TileType.OCEAN_CITY, this);
  }

  public getNoTagsCount() {
    let noTagsCount: number = 0;

    if (this.corporationCard !== undefined && this.corporationCard.tags.filter((tag) => tag !== Tags.WILDCARD).length === 0) {
      noTagsCount++;
    }

    noTagsCount += this.playedCards.filter((card) => card.cardType !== CardType.EVENT && card.tags.filter((tag) => tag !== Tags.WILDCARD).length === 0).length;

    return noTagsCount;
  }

  public getColoniesCount(game: Game) {
    if (!game.gameOptions.coloniesExtension) return 0;

    let coloniesCount: number = 0;

    game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.filter((owner) => owner === this.id).length;
    });

    return coloniesCount;
  }

  public getResourcesOnCard(card: ICard): number | undefined {
    if (card.resourceCount !== undefined) {
      return card.resourceCount;
    } else return undefined;
  }

  public getResourcesOnCorporation():number {
    if (this.corporationCard !== undefined &&
      this.corporationCard.resourceCount !== undefined) {
      return this.corporationCard.resourceCount;
    } else return 0;
  }

  public getRequirementsBonus(game: Game, venusOnly?: boolean): number {
    let requirementsBonus: number = 0;
    if (
      this.corporationCard !== undefined &&
          this.corporationCard.getRequirementBonus !== undefined) {
      requirementsBonus += this.corporationCard.getRequirementBonus(this, game, venusOnly);
    }
    for (const playedCard of this.playedCards) {
      if (playedCard.getRequirementBonus !== undefined &&
          playedCard.getRequirementBonus(this, game)) {
        requirementsBonus += playedCard.getRequirementBonus(this, game);
      }
    }
    return requirementsBonus;
  }

  public removeResourceFrom(card: ICard, count: number = 1, game? : Game, removingPlayer? : Player, shouldLogAction: boolean = true): void {
    if (card.resourceCount) {
      card.resourceCount = Math.max(card.resourceCount - count, 0);
      // Mons Insurance hook
      if (game !== undefined && removingPlayer !== undefined) {
        if (removingPlayer !== this) this.resolveMonsInsurance(game);

        if (shouldLogAction) {
          game.log('${0} removed ${1} resource(s) from ${2}\'s ${3}', (b) =>
            b.player(removingPlayer)
              .number(count)
              .player(this)
              .card(card));
        }
      }
      // Lawsuit hook
      if (removingPlayer !== undefined && removingPlayer !== this && this.removingPlayers.indexOf(removingPlayer.id) === -1) {
        this.removingPlayers.push(removingPlayer.id);
      }
    }
  }
  public addResourceTo(card: ICard, count: number = 1): void {
    if (card.resourceCount !== undefined) {
      card.resourceCount += count;
    }

    // Topsoil contract hook
    if (card.resourceType === ResourceType.MICROBE && this.playedCards.map((card) => card.name).includes(CardName.TOPSOIL_CONTRACT)) {
      this.megaCredits += count;
    }

    // Meat industry hook
    if (card.resourceType === ResourceType.ANIMAL && this.playedCards.map((card) => card.name).includes(CardName.MEAT_INDUSTRY)) {
      this.megaCredits += count * 2;
    }
  }

  public getCardsWithResources(resource?: ResourceType): Array<ICard> {
    let result: Array<ICard> = this.playedCards.filter((card) => card.resourceType !== undefined && card.resourceCount && card.resourceCount > 0);
    if (this.corporationCard !== undefined &&
          this.corporationCard.resourceType !== undefined &&
          this.corporationCard.resourceCount !== undefined &&
          this.corporationCard.resourceCount > 0) {
      result.push(this.corporationCard);
    }

    if (resource !== undefined) {
      result = result.filter((card) => card.resourceType === resource);
    }

    return result;
  }

  public getResourceCards(resource: ResourceType | undefined): Array<ICard> {
    let result: Array<ICard> = this.playedCards.filter((card) => card.resourceType !== undefined);

    if (this.corporationCard !== undefined && this.corporationCard.resourceType !== undefined) {
      result.push(this.corporationCard);
    }

    if (resource !== undefined) {
      result = result.filter((card) => card.resourceType === resource);
    }

    return result;
  }

  public getResourceCount(resource: ResourceType): number {
    let count: number = 0;
    this.getCardsWithResources(resource).forEach((card) => {
      count += this.getResourcesOnCard(card)!;
    });
    return count;
  }

  public getCardsByCardType(cardType: CardType) {
    return this.playedCards.filter((card) => card.cardType === cardType);
  }

  public getAllTags(): Array<ITagCount> {
    return [
      {tag: Tags.BUILDING, count: this.getTagCount(Tags.BUILDING, false, false)},
      {tag: Tags.CITY, count: this.getTagCount(Tags.CITY, false, false)},
      {tag: Tags.EARTH, count: this.getTagCount(Tags.EARTH, false, false)},
      {tag: Tags.ENERGY, count: this.getTagCount(Tags.ENERGY, false, false)},
      {tag: Tags.JOVIAN, count: this.getTagCount(Tags.JOVIAN, false, false)},
      {tag: Tags.MICROBE, count: this.getTagCount(Tags.MICROBE, false, false)},
      {tag: Tags.PLANT, count: this.getTagCount(Tags.PLANT, false, false)},
      {tag: Tags.SCIENCE, count: this.getTagCount(Tags.SCIENCE, false, false)},
      {tag: Tags.SPACE, count: this.getTagCount(Tags.SPACE, false, false)},
      {tag: Tags.VENUS, count: this.getTagCount(Tags.VENUS, false, false)},
      {tag: Tags.WILDCARD, count: this.getTagCount(Tags.WILDCARD, false, false)},
      {tag: Tags.ANIMAL, count: this.getTagCount(Tags.ANIMAL, false, false)},
      {tag: Tags.EVENT, count: this.playedCards.filter((card) => card.cardType === CardType.EVENT).length},
    ].filter((tag) => tag.count > 0);
  }

  public getTagCount(tag: Tags, includeEventsTags:boolean = false, includeWildcardTags:boolean = true): number {
    let tagCount = 0;

    this.playedCards.forEach((card: IProjectCard) => {
      if ( ! includeEventsTags && card.cardType === CardType.EVENT) return;
      tagCount += card.tags.filter((cardTag) => cardTag === tag).length;
    });

    if (this.corporationCard !== undefined && !this.corporationCard.isDisabled) {
      tagCount += this.corporationCard.tags.filter(
        (cardTag) => cardTag === tag,
      ).length;
    }

    // Leavitt Station hook
    if (tag === Tags.SCIENCE && this.scienceTagCount > 0) {
      tagCount += this.scienceTagCount;
    }

    if (tag === Tags.WILDCARD) {
      return tagCount;
    }
    if (includeWildcardTags) {
      return tagCount + this.getTagCount(Tags.WILDCARD);
    } else {
      return tagCount;
    }
  }

  public getMultipleTagCount(tags: Array<Tags>): number {
    let tagCount = 0;
    tags.forEach((tag) => {
      tagCount += this.getTagCount(tag, false, false);
    });
    return tagCount + this.getTagCount(Tags.WILDCARD);
  }

  public getDistinctTagCount(countWild: boolean, extraTag?: Tags): number {
    const allTags: Tags[] = [];
    let wildcardCount: number = 0;
    if (extraTag !== undefined) {
      allTags.push(extraTag);
    }
    const uniqueTags: Set<Tags> = new Set();
    if (this.corporationCard !== undefined && this.corporationCard.tags.length > 0 && !this.corporationCard.isDisabled) {
      this.corporationCard.tags.forEach((tag) => allTags.push(tag));
    }
    this.playedCards.forEach((card) => {
      if (card.cardType === CardType.EVENT) {
        return;
      }
      card.tags.forEach((tag) => {
        allTags.push(tag);
      });
    });
    for (const tags of allTags) {
      if (tags === Tags.WILDCARD) {
        wildcardCount++;
      } else {
        uniqueTags.add(tags);
      }
    }
    if (countWild) {
      return uniqueTags.size + wildcardCount;
    } else {
      return uniqueTags.size;
    }
  }

  public checkMultipleTagPresence(tags: Array<Tags>): boolean {
    let distinctCount = 0;
    tags.forEach((tag) => {
      if (this.getTagCount(tag, false, false) > 0) {
        distinctCount++;
      }
    });
    if (distinctCount + this.getTagCount(Tags.WILDCARD) >= tags.length) {
      return true;
    }
    return false;
  }

  public getCard(cards: Array<IProjectCard>, cardName: string): IProjectCard {
    const foundCard = cards.find((card) => card.name === cardName);
    if (foundCard === undefined) {
      throw new Error('Card not found');
    }
    return foundCard;
  }

  private runInputCb(game: Game, result: PlayerInput | undefined): void {
    if (result !== undefined) {
      game.defer(new DeferredAction(this, () => result));
    }
  }

  private checkInputLength(input: ReadonlyArray<ReadonlyArray<string>>, length: number, firstOptionLength?: number) {
    if (input.length !== length) {
      throw new Error('Incorrect options provided');
    }
    if (firstOptionLength !== undefined && input[0].length !== firstOptionLength) {
      throw new Error('Incorrect options provided (nested)');
    }
  }

  private parseHowToPayJSON(json: string): HowToPay {
    const defaults: HowToPay = {
      steel: 0,
      heat: 0,
      titanium: 0,
      megaCredits: 0,
      microbes: 0,
      floaters: 0,
      isResearchPhase: false,
    };
    try {
      const howToPay: HowToPay = JSON.parse(json);
      if (Object.keys(howToPay).every((key) => key in defaults) === false) {
        throw new Error('Input contains unauthorized keys');
      }
      return howToPay;
    } catch (err) {
      throw new Error('Unable to parse HowToPay input ' + err);
    }
  }

  private runInput(game: Game, input: ReadonlyArray<ReadonlyArray<string>>, pi: PlayerInput): void {
    if (pi instanceof AndOptions) {
      this.checkInputLength(input, pi.options.length);
      for (let i = 0; i < input.length; i++) {
        this.runInput(game, [input[i]], pi.options[i]);
      }
      this.runInputCb(game, pi.cb());
    } else if (pi instanceof SelectAmount) {
      this.checkInputLength(input, 1, 1);
      const amount: number = parseInt(input[0][0]);
      if (isNaN(amount)) {
        throw new Error('Number not provided for amount');
      }
      if (amount > pi.max) {
        throw new Error('Amount provided too high (max ' + String(pi.max) + ')');
      }
      if (amount < pi.min) {
        throw new Error('Amount provided too low (min ' + String(pi.min) + ')');
      }
      this.runInputCb(game, pi.cb(amount));
    } else if (pi instanceof SelectOption) {
      this.runInputCb(game, pi.cb());
    } else if (pi instanceof SelectColony) {
      this.checkInputLength(input, 1, 1);
      const colony: ColonyName = (input[0][0]) as ColonyName;
      if (colony === undefined) {
        throw new Error('No colony selected');
      }
      this.runInputCb(game, pi.cb(colony));
    } else if (pi instanceof OrOptions) {
      // input length is variable, can't test it with checkInputLength
      if (input.length === 0 || input[0].length !== 1) {
        throw new Error('Incorrect options provided');
      }
      const optionIndex = parseInt(input[0][0]);
      const selectedOptionInput = input.slice(1);
      this.runInput(game, selectedOptionInput, pi.options[optionIndex]);
      this.runInputCb(game, pi.cb());
    } else if (pi instanceof SelectHowToPayForCard) {
      this.checkInputLength(input, 1, 2);
      const foundCard: IProjectCard = this.getCard(pi.cards, input[0][0]);
      const howToPay: HowToPay = this.parseHowToPayJSON(input[0][1]);
      this.runInputCb(game, pi.cb(foundCard, howToPay));
    } else if (pi instanceof SelectCard) {
      this.checkInputLength(input, 1);
      if (input[0].length < pi.minCardsToSelect) {
        throw new Error('Not enough cards selected');
      }
      if (input[0].length > pi.maxCardsToSelect) {
        throw new Error('Too many cards selected');
      }
      const mappedCards: Array<ICard> = [];
      for (const cardName of input[0]) {
        mappedCards.push(this.getCard(pi.cards, cardName));
      }
      this.runInputCb(game, pi.cb(mappedCards));
    } else if (pi instanceof SelectAmount) {
      this.checkInputLength(input, 1, 1);
      const amount = parseInt(input[0][0]);
      if (isNaN(amount)) {
        throw new Error('Amount is not a number');
      }
      this.runInputCb(game, pi.cb(amount));
    } else if (pi instanceof SelectSpace) {
      this.checkInputLength(input, 1, 1);
      const foundSpace = pi.availableSpaces.find(
        (space) => space.id === input[0][0],
      );
      if (foundSpace === undefined) {
        throw new Error('Space not available');
      }
      this.runInputCb(game, pi.cb(foundSpace));
    } else if (pi instanceof SelectPlayer) {
      this.checkInputLength(input, 1, 1);
      const foundPlayer = pi.players.find(
        (player) => player.color === input[0][0] || player.id === input[0][0],
      );
      if (foundPlayer === undefined) {
        throw new Error('Player not available');
      }
      this.runInputCb(game, pi.cb(foundPlayer));
    } else if (pi instanceof SelectDelegate) {
      this.checkInputLength(input, 1, 1);
      const foundPlayer = pi.players.find((player) =>
        player === input[0][0] ||
        (player instanceof Player && (player.id === input[0][0] || player.color === input[0][0])),
      );
      if (foundPlayer === undefined) {
        throw new Error('Player not available');
      }
      this.runInputCb(game, pi.cb(foundPlayer));
    } else if (pi instanceof SelectHowToPay) {
      this.checkInputLength(input, 1, 1);
      const howToPay: HowToPay = this.parseHowToPayJSON(input[0][0]);
      this.runInputCb(game, pi.cb(howToPay));
    } else if (pi instanceof SelectProductionToLose) {
      // TODO(kberg): I'm sure there's some input validation required.
      const units: IProductionUnits = JSON.parse(input[0][0]);
      pi.cb(units);
    } else if (pi instanceof ShiftAresGlobalParameters) {
      // TODO(kberg): I'm sure there's some input validation required.
      const response: IAresGlobalParametersResponse = JSON.parse(input[0][0]);
      pi.cb(response);
    } else {
      throw new Error('Unsupported waitingFor');
    }
  }

  private getPlayableActionCards(game: Game): Array<ICard> {
    const result: Array<ICard> = [];
    if (
      this.corporationCard !== undefined &&
          !this.actionsThisGeneration.has(this.corporationCard.name) &&
          this.corporationCard.action !== undefined &&
          this.corporationCard.canAct !== undefined &&
          this.corporationCard.canAct(this, game)) {
      result.push(this.corporationCard);
    }
    for (const playedCard of this.playedCards) {
      if (
        playedCard.action !== undefined &&
              playedCard.canAct !== undefined &&
              !this.actionsThisGeneration.has(playedCard.name) &&
              playedCard.canAct(this, game)) {
        result.push(playedCard);
      }
    }

    return result;
  }

  public runProductionPhase(): void {
    this.actionsThisGeneration.clear();
    this.removingPlayers = [];
    this.tradesThisTurn = 0;
    this.turmoilScientistsActionUsed = false;
    this.megaCredits += this.megaCreditProduction + this.terraformRating;
    this.heat += this.energy;
    this.heat += this.heatProduction;
    this.energy = this.energyProduction;
    this.titanium += this.titaniumProduction;
    this.steel += this.steelProduction;
    this.plants += this.plantProduction;

    if (this.corporationCard !== undefined && this.corporationCard.onProductionPhase !== undefined) {
      this.corporationCard.onProductionPhase(this);
    }
  }

  private doneWorldGovernmentTerraforming(game: Game): void {
    game.deferredActions.runAll(() => game.doneWorldGovernmentTerraforming());
  }

  public worldGovernmentTerraforming(game: Game): void {
    const action: OrOptions = new OrOptions();
    action.title = 'Select action for World Government Terraforming';
    action.buttonLabel = 'Confirm';
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
    if (game.board.getOceansOnBoard() < constants.MAX_OCEAN_TILES) {
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

    this.setWaitingFor(action, () => {
      this.doneWorldGovernmentTerraforming(game);
    });
  }

  public dealCards(game: Game, quantity: number, cards: Array<IProjectCard>) {
    for (let i = 0; i < quantity; i++) {
      cards.push(game.dealer.dealCard(true));
    }
  }

  public runDraftPhase(initialDraft: boolean, game: Game, playerName: string, passedCards?: Array<IProjectCard>): void {
    let cards: Array<IProjectCard> = [];
    if (passedCards === undefined) {
      if (!initialDraft) {
        this.dealCards(game, 4, cards);
      } else {
        this.dealCards(game, 5, cards);
      }
    } else {
      cards = passedCards;
    }

    this.setWaitingFor(
      new SelectCard({
        message: 'Select a card to keep and pass the rest to ${0}',
        data: [{
          type: LogMessageDataType.RAW_STRING,
          value: playerName,
        }],
      },
      'Keep',
      cards,
      (foundCards: Array<IProjectCard>) => {
        this.draftedCards.push(foundCards[0]);
        cards = cards.filter((card) => card !== foundCards[0]);
        game.playerIsFinishedWithDraftingPhase(initialDraft, this, cards);
        return undefined;
      }, 1, 1,
      ), () => { },
    );
  }

  /**
   * @return {number} the number of avaialble megacredits. Which is just a shorthand for megacredits,
   * plus any units of heat available thanks to Helion.
   */
  public spendableMegacredits(): number {
    return (this.canUseHeatAsMegaCredits) ? (this.heat + this.megaCredits) : this.megaCredits;
  }

  public runResearchPhase(game: Game, draftVariant: boolean): void {
    let dealtCards: Array<IProjectCard> = [];
    if (!draftVariant) {
      this.dealCards(game, 4, dealtCards);
    } else {
      dealtCards = this.draftedCards;
      this.draftedCards = [];
    }

    let selectedCards: Array<IProjectCard> = [];

    const payForCards = () => {
      const purchasedCardsCost = this.cardCost * selectedCards.length;
      if (selectedCards.length > 0) {
        game.defer(new SelectHowToPayDeferred(this, purchasedCardsCost, false, false, 'Select how to pay ' + purchasedCardsCost + ' for purchasing ' + selectedCards.length + ' card(s)'));
      }
      dealtCards.forEach((card) => {
        if (selectedCards.find((c) => c.name === card.name)) {
          // Add selected cards to hand
          this.cardsInHand.push(card);
        } else {
          // Discard the cards which were not purchased
          game.dealer.discard(card);
        }
      });
      game.log('${0} bought ${1} card(s)', (b) => b.player(this).number(selectedCards.length));
      game.playerIsFinishedWithResearchPhase(this);
    };

    let maxPurchaseQty = 4;
    maxPurchaseQty = Math.min(maxPurchaseQty, Math.floor(this.spendableMegacredits() / this.cardCost));

    this.setWaitingFor(
      new SelectCard(
        'Select which cards to take into hand',
        'Buy',
        dealtCards,
        (foundCards: Array<IProjectCard>) => {
          selectedCards = foundCards;
          return undefined;
        }, maxPurchaseQty, 0,
      ), () => {
        payForCards();
      },
    );
  }

  public getSelfReplicatingRobotsCards(game: Game) : Array<CardModel> {
    const card = this.playedCards.find((card) => card.name === CardName.SELF_REPLICATING_ROBOTS);
    const cards : Array<CardModel> = [];
    if (card instanceof SelfReplicatingRobots) {
      if (card.targetCards.length > 0) {
        for (const targetCard of card.targetCards) {
          cards.push(
            {
              resources: targetCard.resourceCount,
              resourceType: undefined, // Card on SRR cannot gather its own resources (if any)
              name: targetCard.card.name,
              calculatedCost: this.getCardCost(game, targetCard.card),
              cardType: card.cardType,
              isDisabled: false,
            },
          );
        }
        return cards;
      }
    }
    return cards;
  }

  public getCardCost(game: Game, card: IProjectCard): number {
    let cost: number = card.cost;
    cost -= this.cardDiscount;

    this.playedCards.forEach((playedCard) => {
      if (playedCard.getCardDiscount !== undefined) {
        cost -= playedCard.getCardDiscount(this, game, card);
      }
    });

    // Check corporation too
    if (this.corporationCard !== undefined && this.corporationCard.getCardDiscount !== undefined) {
      cost -= this.corporationCard.getCardDiscount(this, game, card);
    }

    // Playwrights hook
    this.removedFromPlayCards.forEach((removedFromPlayCard) => {
      if (removedFromPlayCard.getCardDiscount !== undefined) {
        cost -= removedFromPlayCard.getCardDiscount(this, game, card);
      }
    });

    return Math.max(cost, 0);
  }

  private addPlayedCard(game: Game, card: IProjectCard): void {
    this.playedCards.push(card);
    game.log('${0} played ${1}', (b) => b.player(this).card(card));
    this.lastCardPlayed = card;

    // Playwrights hook for Conscription and Indentured Workers
    // Cards "removed from play" can still have an effect
    this.removedFromPlayCards = this.removedFromPlayCards.filter((card) => card.getCardDiscount === undefined);
  }

  private canUseSteel(card: ICard): boolean {
    return card.tags.indexOf(Tags.BUILDING) !== -1;
  }

  private canUseTitanium(card: ICard): boolean {
    return card.tags.indexOf(Tags.SPACE) !== -1;
  }

  private playPreludeCard(game: Game): PlayerInput {
    return new SelectCard(
      'Select prelude card to play',
      'Play',
      this.getPlayablePreludeCards(game),
      (foundCards: Array<IProjectCard>) => {
        return this.playCard(game, foundCards[0]);
      },
      1,
      1,
    );
  }

  public checkHowToPayAndPlayCard(selectedCard: IProjectCard, howToPay: HowToPay, game: Game) {
    const cardCost: number = this.getCardCost(game, selectedCard);
    let totalToPay: number = 0;

    const canUseSteel: boolean = this.canUseSteel(selectedCard);
    const canUseTitanium: boolean = this.canUseTitanium(selectedCard);

    if (canUseSteel && howToPay.steel > 0) {
      if (howToPay.steel > this.steel) {
        throw new Error('Do not have enough steel');
      }
      totalToPay += howToPay.steel * this.steelValue;
    }

    if (canUseTitanium && howToPay.titanium > 0) {
      if (howToPay.titanium > this.titanium) {
        throw new Error('Do not have enough titanium');
      }
      totalToPay += howToPay.titanium * this.getTitaniumValue(game);
    }

    if (this.canUseHeatAsMegaCredits && howToPay.heat !== undefined) {
      totalToPay += howToPay.heat;
    }

    if (howToPay.microbes !== undefined) {
      totalToPay += howToPay.microbes * 2;
    }

    if (howToPay.floaters !== undefined && howToPay.floaters > 0) {
      if (selectedCard.name === CardName.STRATOSPHERIC_BIRDS && howToPay.floaters === this.getFloatersCanSpend()) {
        const cardsWithFloater = this.getCardsWithResources(ResourceType.FLOATER);
        if (cardsWithFloater.length === 1) {
          throw new Error('Cannot spend all floaters to play Stratospheric Birds');
        }
      }
      totalToPay += howToPay.floaters * 3;
    }

    if (howToPay.megaCredits > this.megaCredits) {
      throw new Error('Do not have enough mega credits');
    }

    totalToPay += howToPay.megaCredits;

    if (totalToPay < cardCost) {
      throw new Error('Did not spend enough to pay for card');
    }
    return this.playCard(game, selectedCard, howToPay);
  }

  public playProjectCard(game: Game): PlayerInput {
    return new SelectHowToPayForCard(
      this.getPlayableCards(game),
      this.getMicrobesCanSpend(),
      this.getFloatersCanSpend(),
      this.canUseHeatAsMegaCredits,
      (selectedCard, howToPay) => this.checkHowToPayAndPlayCard(selectedCard, howToPay, game),
    );
  }

  public getMicrobesCanSpend(): number {
    for (const playedCard of this.playedCards) {
      if (playedCard.name === CardName.PSYCHROPHILES) {
        return this.getResourcesOnCard(playedCard)!;
      }
    }
    return 0;
  }

  public getFloatersCanSpend(): number {
    for (const playedCard of this.playedCards) {
      if (playedCard.name === CardName.DIRIGIBLES) {
        return this.getResourcesOnCard(playedCard)!;
      }
    }
    return 0;
  }

  public playCard(game: Game, selectedCard: IProjectCard, howToPay?: HowToPay): undefined {
    // Pay for card
    if (howToPay !== undefined) {
      this.steel -= howToPay.steel;
      this.titanium -= howToPay.titanium;
      this.megaCredits -= howToPay.megaCredits;
      this.heat -= howToPay.heat;
      for (const playedCard of this.playedCards) {
        if (playedCard.name === CardName.PSYCHROPHILES) {
          this.removeResourceFrom(playedCard, howToPay.microbes);
        }

        if (playedCard.name === CardName.DIRIGIBLES) {
          this.removeResourceFrom(playedCard, howToPay.floaters);
        }
      }
    }

    // Activate some colonies
    if (game.gameOptions.coloniesExtension && selectedCard.resourceType !== undefined) {
      game.colonies.forEach((colony) => {
        if (colony.resourceType !== undefined && colony.resourceType === selectedCard.resourceType) {
          colony.isActive = true;
        }
      });

      // Check for Venus colony
      if (selectedCard.tags.includes(Tags.VENUS)) {
        const venusColony = game.colonies.find((colony) => colony.name === ColonyName.VENUS);
        if (venusColony) venusColony.isActive = true;
      }
    }

    // Play the card
    const action = selectedCard.play(this, game);
    if (action !== undefined) {
      game.defer(new DeferredAction(
        this,
        () => action,
      ));
    }

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

    if (selectedCard.cardType !== CardType.PROXY) {
      this.addPlayedCard(game, selectedCard);
    }

    for (const playedCard of this.playedCards) {
      if (playedCard.onCardPlayed !== undefined) {
        const actionFromPlayedCard: OrOptions | void = playedCard.onCardPlayed(this, game, selectedCard);
        if (actionFromPlayedCard !== undefined) {
          game.defer(new DeferredAction(
            this,
            () => actionFromPlayedCard,
          ));
        }
      }
    }

    for (const somePlayer of game.getPlayers()) {
      if (somePlayer.corporationCard !== undefined && somePlayer.corporationCard.onCardPlayed !== undefined) {
        const actionFromPlayedCard: OrOptions | void = somePlayer.corporationCard.onCardPlayed(this, game, selectedCard);
        if (actionFromPlayedCard !== undefined) {
          game.defer(new DeferredAction(
            this,
            () => actionFromPlayedCard,
          ));
        }
      }
    }

    return undefined;
  }

  private playActionCard(game: Game): PlayerInput {
    return new SelectCard(
      'Perform an action from a played card',
      'Take action',
      this.getPlayableActionCards(game),
      (foundCards: Array<ICard>) => {
        const foundCard = foundCards[0];
        const action = foundCard.action!(this, game);
        if (action !== undefined) {
          game.defer(new DeferredAction(
            this,
            () => action,
          ));
        }
        this.actionsThisGeneration.add(foundCard.name);
        game.log('${0} used ${1} action', (b) => b.player(this).card(foundCard));
        return undefined;
      },
    );
  }

  private tradeWithColony(openColonies: Array<Colony>, game: Game): PlayerInput {
    const opts: Array<OrOptions | SelectColony> = [];
    let payWith: Resources | ResourceType | undefined = undefined;
    const coloniesModel: Array<ColonyModel> = game.getColoniesModel(openColonies);
    const titanFloatingLaunchPad = this.playedCards.find((card) => card.name === CardName.TITAN_FLOATER_LAUNCHPAD);

    const selectColony = new SelectColony('Select colony tile for trade', 'trade', coloniesModel, (colonyName: ColonyName) => {
      openColonies.forEach((colony) => {
        if (colony.name === colonyName) {
          game.log('${0} traded with ${1}', (b) => b.player(this).colony(colony));
          if (payWith === Resources.MEGACREDITS) {
            game.defer(new SelectHowToPayDeferred(
              this,
              9 - this.colonyTradeDiscount,
              false,
              false,
              'Select how to pay ' + (9 - this.colonyTradeDiscount) + ' for colony trade',
              () => {
                colony.trade(this, game);
              },
            ));
          } else if (payWith === Resources.ENERGY) {
            this.energy -= (3 - this.colonyTradeDiscount);
            colony.trade(this, game);
          } else if (payWith === Resources.TITANIUM) {
            this.titanium -= (3 - this.colonyTradeDiscount);
            colony.trade(this, game);
          } else if (payWith === ResourceType.FLOATER && titanFloatingLaunchPad !== undefined && titanFloatingLaunchPad.resourceCount) {
            titanFloatingLaunchPad.resourceCount--;
            this.actionsThisGeneration.add(titanFloatingLaunchPad.name);
            colony.trade(this, game);
          }
          return undefined;
        }
        return undefined;
      });
      return undefined;
    });

    const howToPayForTrade = new OrOptions();
    howToPayForTrade.title = 'Pay trade fee';
    howToPayForTrade.buttonLabel = 'Pay';

    const payWithMC = new SelectOption('Pay ' + (9 - this.colonyTradeDiscount) +' MC', '', () => {
      payWith = Resources.MEGACREDITS;
      return undefined;
    });
    const payWithEnergy = new SelectOption('Pay ' + (3 - this.colonyTradeDiscount) +' Energy', '', () => {
      payWith = Resources.ENERGY;
      return undefined;
    });
    const payWithTitanium = new SelectOption('Pay ' + (3 - this.colonyTradeDiscount) +' Titanium', '', () => {
      payWith = Resources.TITANIUM;
      return undefined;
    });

    if (titanFloatingLaunchPad !== undefined &&
      titanFloatingLaunchPad.resourceCount !== undefined &&
      titanFloatingLaunchPad.resourceCount > 0 &&
      !this.actionsThisGeneration.has(titanFloatingLaunchPad.name)) {
      howToPayForTrade.options.push(new SelectOption('Pay 1 Floater (use Titan Floating Launch-pad action)', '', () => {
        payWith = ResourceType.FLOATER;
        return undefined;
      }));
    }

    if (this.energy >= (3 - this.colonyTradeDiscount)) howToPayForTrade.options.push(payWithEnergy);
    if (this.titanium >= (3 - this.colonyTradeDiscount)) howToPayForTrade.options.push(payWithTitanium);
    if (this.canAfford((9 - this.colonyTradeDiscount))) howToPayForTrade.options.push(payWithMC);

    opts.push(howToPayForTrade);
    opts.push(selectColony);

    const trade = new AndOptions(
      () => {
        return undefined;
      },
      ...opts,
    );

    trade.title = 'Trade with a colony tile';
    trade.buttonLabel = 'Trade';

    return trade;
  }

  private convertPlantsIntoGreenery(game: Game): PlayerInput {
    return new SelectSpace(
      `Convert ${this.plantsNeededForGreenery} plants into greenery`,
      game.board.getAvailableSpacesForGreenery(this),
      (space: ISpace) => {
        game.addGreenery(this, space.id);
        this.plants -= this.plantsNeededForGreenery;
        game.log('${0} converted plants into a greenery', (b) => b.player(this));
        return undefined;
      },
    );
  }

  private turmoilKelvinistsAction(game: Game): PlayerInput {
    return new SelectOption(
      'Pay 10 MC to increase your heat and energy production 1 step (Turmoil Kelvinists)',
      'Pay',
      () => {
        game.defer(new SelectHowToPayDeferred(this, 10, false, false, 'Select how to pay for Turmoil Kelvinists action'));
        this.addProduction(Resources.ENERGY);
        this.addProduction(Resources.HEAT);
        game.log('${0} used Turmoil Kelvinists action', (b) => b.player(this));
        return undefined;
      },
    );
  }

  private turmoilScientistsAction(game: Game): PlayerInput {
    return new SelectOption(
      'Pay 10 MC to draw 3 cards (Turmoil Scientists)',
      'Pay',
      () => {
        game.defer(new SelectHowToPayDeferred(this, 10, false, false, 'Select how to pay for Turmoil Scientists draw'));
        this.turmoilScientistsActionUsed = true;
        this.cardsInHand.push(
          game.dealer.dealCard(),
          game.dealer.dealCard(),
          game.dealer.dealCard(),
        );
        game.log('${0} used Turmoil Scientists draw action', (b) => b.player(this));
        return undefined;
      },
    );
  }

  private convertHeatIntoTemperature(game: Game): PlayerInput {
    if (this.isCorporation(CardName.STORMCRAFT_INCORPORATED) && this.getResourcesOnCorporation() > 0 ) {
      return (this.corporationCard as StormCraftIncorporated).convertHeatIntoTemperature(
        game, this,
      );
    }
    return new SelectOption(`Convert ${constants.HEAT_FOR_TEMPERATURE} heat into temperature`, 'Convert heat', () => {
      game.increaseTemperature(this, 1);
      this.heat -= constants.HEAT_FOR_TEMPERATURE;
      game.log('${0} converted heat into temperature', (b) => b.player(this));
      return undefined;
    });
  }

  private claimMilestone(milestone: IMilestone, game: Game): SelectOption {
    return new SelectOption(milestone.name, 'Claim - ' + '('+ milestone.name + ')', () => {
      game.claimedMilestones.push({
        player: this,
        milestone: milestone,
      });
      game.defer(new SelectHowToPayDeferred(this, 8, false, false, 'Select how to pay for milestone'));
      game.log('${0} claimed ${1} milestone', (b) => b.player(this).milestone(milestone));
      return undefined;
    });
  }

  private fundAward(award: IAward, game: Game): PlayerInput {
    return new SelectOption(award.name, 'Fund - ' + '(' + award.name + ')', () => {
      game.defer(new SelectHowToPayDeferred(this, game.getAwardFundingCost(), false, false, 'Select how to pay for award'));
      game.fundAward(this, award);
      return undefined;
    });
  }

  private giveAwards(game: Game): void {
    game.fundedAwards.forEach((fundedAward) => {
      // Awards are disabled for 1 player games
      if (game.isSoloMode()) return;

      const players: Array<Player> = game.getPlayers().slice();
      players.sort(
        (p1, p2) => fundedAward.award.getScore(p2, game) - fundedAward.award.getScore(p1, game),
      );

      // We have one rank 1 player
      if (fundedAward.award.getScore(players[0], game) > fundedAward.award.getScore(players[1], game)) {
        if (players[0].id === this.id) this.victoryPointsBreakdown.setVictoryPoints('awards', 5, '1st place for '+fundedAward.award.name+' award (funded by '+fundedAward.player.name+')');
        players.shift();

        if (players.length > 1) {
          // We have one rank 2 player
          if (fundedAward.award.getScore(players[0], game) > fundedAward.award.getScore(players[1], game)) {
            if (players[0].id === this.id) this.victoryPointsBreakdown.setVictoryPoints('awards', 2, '2nd place for '+fundedAward.award.name+' award (funded by '+fundedAward.player.name+')');

          // We have at least two rank 2 players
          } else {
            const score = fundedAward.award.getScore(players[0], game);
            while (players.length > 0 && fundedAward.award.getScore(players[0], game) === score) {
              if (players[0].id === this.id) this.victoryPointsBreakdown.setVictoryPoints('awards', 2, '2nd place for '+fundedAward.award.name+' award (funded by '+fundedAward.player.name+')');
              players.shift();
            }
          }
        }

      // We have at least two rank 1 players
      } else {
        const score = fundedAward.award.getScore(players[0], game);
        while (players.length > 0 && fundedAward.award.getScore(players[0], game) === score) {
          if (players[0].id === this.id) this.victoryPointsBreakdown.setVictoryPoints('awards', 5, '1st place for '+fundedAward.award.name+' award (funded by '+fundedAward.player.name+')');
          players.shift();
        }
      }
    });
  }

  private endTurnOption(game: Game): PlayerInput {
    return new SelectOption('End Turn', 'End', () => {
      this.actionsTakenThisRound = 1;
      game.log('${0} ended turn', (b) => b.player(this));
      return undefined;
    });
  }

  public pass(game: Game) {
    game.playerHasPassed(this);
    this.lastCardPlayed = undefined;
  }

  private passOption(game: Game): PlayerInput {
    return new SelectOption('Pass for this generation', 'Pass', () => {
      this.pass(game);
      game.log('${0} passed', (b) => b.player(this));
      return undefined;
    });
  }

  // Propose a new action to undo last action
  private undoTurnOption(game: Game): PlayerInput {
    return new SelectOption('Undo last action', 'Undo', () => {
      GameLoader.getInstance().restoreGameAt(game.id, game.lastSaveId - 2, (game) => {
        if (game !== undefined) {
          this.usedUndo = true; // To prevent going back into takeAction()
        }
      });
      return undefined;
    });
  }

  public takeActionForFinalGreenery(game: Game): void {
    if (game.canPlaceGreenery(this)) {
      const action: OrOptions = new OrOptions();
      action.title = 'Place any final greenery from plants';
      action.buttonLabel = 'Confirm';
      action.options.push(
        new SelectSpace(
          'Select space for greenery',
          game.board.getAvailableSpacesForGreenery(this), (space) => {
            // Do not raise oxygen or award TR for final greenery placements
            game.addGreenery(this, space.id, SpaceType.LAND, false);
            this.plants -= this.plantsNeededForGreenery;
            this.takeActionForFinalGreenery(game);

            // Resolve Philares deferred actions
            if (game.deferredActions.length > 0) this.resolveFinalGreeneryDeferredActions(game);

            return undefined;
          },
        ),
      );
      action.options.push(
        new SelectOption('Don\'t place a greenery', 'Confirm', () => {
          game.playerIsDoneWithGame(this);
          return undefined;
        }),
      );
      this.setWaitingFor(action, () => {});
      return;
    }

    if (game.deferredActions.length > 0) {
      this.resolveFinalGreeneryDeferredActions(game);
    } else {
      game.playerIsDoneWithGame(this);
    }
  }

  private resolveFinalGreeneryDeferredActions(game: Game) {
    game.deferredActions.runAll(() => this.takeActionForFinalGreenery(game));
  }

  private getPlayablePreludeCards(game: Game): Array<IProjectCard> {
    return this.preludeCardsInHand.filter((card) => card.canPlay === undefined || card.canPlay(this, game));
  }

  public getPlayableCards(game: Game): Array<IProjectCard> {
    const candidateCards: Array<IProjectCard> = [...this.cardsInHand];
    // Self Replicating robots check
    const card = this.playedCards.find((card) => card.name === CardName.SELF_REPLICATING_ROBOTS);
    if (card instanceof SelfReplicatingRobots) {
      for (const targetCard of card.targetCards) {
        candidateCards.push(targetCard.card);
      }
    }

    const playableCards = candidateCards.filter((card) => {
      const canUseSteel = card.tags.indexOf(Tags.BUILDING) !== -1;
      const canUseTitanium = card.tags.indexOf(Tags.SPACE) !== -1;
      let maxPay = 0;
      if (canUseSteel) {
        maxPay += this.steel * this.steelValue;
      }
      if (canUseTitanium) {
        maxPay += this.titanium * this.getTitaniumValue(game);
      }

      const psychrophiles = this.playedCards.find(
        (playedCard) => playedCard.name === CardName.PSYCHROPHILES);

      if (psychrophiles !== undefined &&
          psychrophiles.resourceCount &&
          card.tags.indexOf(Tags.PLANT) !== -1) {
        maxPay += psychrophiles.resourceCount * 2;
      }

      const dirigibles = this.playedCards.find(
        (playedCard) => playedCard.name === CardName.DIRIGIBLES);

      if (dirigibles !== undefined &&
          dirigibles.resourceCount &&
          card.tags.indexOf(Tags.VENUS) !== -1) {
        maxPay += dirigibles.resourceCount * 3;
      }

      maxPay += this.spendableMegacredits();
      return maxPay >= this.getCardCost(game, card) &&
                  (card.canPlay === undefined || card.canPlay(this, game));
    });
    return playableCards;
  }

  public canAfford(cost: number, game?: Game, canUseSteel: boolean = false, canUseTitanium: boolean = false, canUseFloaters: boolean = false, canUseMicrobes : boolean = false): boolean {
    let extraResource: number = 0;
    if (canUseFloaters !== undefined && canUseFloaters) {
      extraResource += this.getFloatersCanSpend() * 3;
    }

    if (canUseMicrobes !== undefined && canUseMicrobes) {
      extraResource += this.getMicrobesCanSpend() * 2;
    }

    if (game !== undefined && canUseTitanium) {
      return this.spendableMegacredits() +
      (canUseSteel ? this.steel * this.steelValue : 0) +
      (canUseTitanium ? this.titanium * this.getTitaniumValue(game) : 0) +
      extraResource >= cost;
    }

    return this.spendableMegacredits() + (canUseSteel ? this.steel * this.steelValue : 0) + extraResource >= cost;
  }

  private addStandardProjects(game: Game, options: Array<PlayerInput>) {
    const standardProjects = this.getAvailableStandardProjects(game);
    if (standardProjects.cards.length >= 1) {
      options.push(standardProjects);
    }

    const sellPatents = new SellPatents();
    if (sellPatents.canAct(this)) {
      options.push(sellPatents.action(this, game));
    }
  }

  public takeAction(game: Game): void {
    if (this.usedUndo) {
      this.usedUndo = false;
      return;
    }

    if (game.deferredActions.length > 0) {
      game.deferredActions.runAll(() => this.takeAction(game));
      return;
    }

    const players = game.getPlayers();
    const allOtherPlayersHavePassed = this.allOtherPlayersHavePassed(game);

    if (this.actionsTakenThisRound === 0 || game.gameOptions.undoOption) {
      game.save();
    }

    // Prelude cards have to be played first
    if (this.preludeCardsInHand.length > 0) {
      game.phase = Phase.PRELUDES;

      // If no playable prelude card in hand, end player turn
      if (this.getPlayablePreludeCards(game).length === 0) {
        this.preludeCardsInHand = [];
        game.playerIsFinishedTakingActions();
        return;
      }

      this.setWaitingFor(this.playPreludeCard(game), () => {
        if (this.preludeCardsInHand.length === 1) {
          this.takeAction(game);
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

    const corporationCard = this.corporationCard;
    if (corporationCard !== undefined &&
          corporationCard.initialAction !== undefined &&
          corporationCard.initialActionText !== undefined &&
          this.corporationInitialActionDone === false
    ) {
      const initialActionOption = new SelectOption(
        {
          message: 'Take first action of ${0} corporation',
          data: [{
            type: LogMessageDataType.RAW_STRING,
            value: corporationCard.name,
          }],
        },
        corporationCard.initialActionText, () => {
          game.defer(new DeferredAction(this, () => {
            if (corporationCard.initialAction) {
              return corporationCard.initialAction(this, game);
            } else {
              return undefined;
            }
          }));
          this.corporationInitialActionDone = true;
          return undefined;
        },
      );
      const initialActionOrPass = new OrOptions(
        initialActionOption,
        this.passOption(game),
      );
      this.setWaitingFor(initialActionOrPass, () => {
        this.actionsTakenThisRound++;
        this.takeAction(game);
      });
      return;
    }

    const action: OrOptions = new OrOptions();
    action.title = 'Take action for action phase, select one ' +
                      'available action.';
    action.buttonLabel = 'Take action';

    if (this.getPlayableCards(game).length > 0) {
      action.options.push(
        this.playProjectCard(game),
      );
    }

    if (this.getPlayableActionCards(game).length > 0) {
      action.options.push(
        this.playActionCard(game),
      );
    }

    if (game.gameOptions.coloniesExtension) {
      const openColonies = game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);
      if (openColonies.length > 0 &&
        this.fleetSize > this.tradesThisTurn &&
        (this.canAfford(9 - this.colonyTradeDiscount) ||
          this.energy >= (3 - this.colonyTradeDiscount) ||
          this.titanium >= (3 - this.colonyTradeDiscount))
      ) {
        action.options.push(
          this.tradeWithColony(openColonies, game),
        );
      }
    }

    const hasEnoughPlants = this.plants >= this.plantsNeededForGreenery;
    const canPlaceGreenery = game.board.getAvailableSpacesForGreenery(this).length > 0;
    const oxygenIsMaxed = game.getOxygenLevel() === constants.MAX_OXYGEN_LEVEL;

    const redsAreRuling = PartyHooks.shouldApplyPolicy(game, PartyName.REDS);
    const canAffordReds = !redsAreRuling || (redsAreRuling && this.canAfford(REDS_RULING_POLICY_COST));

    if (hasEnoughPlants && canPlaceGreenery && (oxygenIsMaxed || (!oxygenIsMaxed && canAffordReds))) {
      action.options.push(
        this.convertPlantsIntoGreenery(game),
      );
    }

    const hasEnoughHeat = this.heat >= constants.HEAT_FOR_TEMPERATURE ||
      (this.isCorporation(CardName.STORMCRAFT_INCORPORATED) &&
        this.getResourcesOnCorporation() * 2 + this.heat >= constants.HEAT_FOR_TEMPERATURE);

    const temperatureIsMaxed = game.getTemperature() === constants.MAX_TEMPERATURE;

    const canAffordRedsForHeatConversion =
      !redsAreRuling || (!this.isCorporation(CardName.HELION) && this.canAfford(REDS_RULING_POLICY_COST)) || this.canAfford(REDS_RULING_POLICY_COST + 8);

    if (hasEnoughHeat && !temperatureIsMaxed && canAffordRedsForHeatConversion) {
      action.options.push(
        this.convertHeatIntoTemperature(game),
      );
    }

    // Turmoil Scientists capacity
    if (this.canAfford(10) &&
      PartyHooks.shouldApplyPolicy(game, PartyName.SCIENTISTS) &&
      !this.turmoilScientistsActionUsed) {
      action.options.push(this.turmoilScientistsAction(game));
    }

    // Turmoil Kelvinists capacity
    if (this.canAfford(10) && PartyHooks.shouldApplyPolicy(game, PartyName.KELVINISTS)) {
      action.options.push(this.turmoilKelvinistsAction(game));
    }

    if (this.canAfford(8) && !game.allMilestonesClaimed()) {
      const remainingMilestones = new OrOptions();
      remainingMilestones.title = 'Claim a milestone';
      remainingMilestones.options = game.milestones
        .filter(
          (milestone: IMilestone) =>
            !game.milestoneClaimed(milestone) &&
                      milestone.canClaim(this, game))
        .map(
          (milestone: IMilestone) =>
            this.claimMilestone(milestone, game));

      if (remainingMilestones.options.length >= 1) action.options.push(remainingMilestones);
    }

    // If you can pay to send some in the Ara
    if (game.gameOptions.turmoilExtension) {
      let sendDelegate;
      if (game.turmoil?.lobby.has(this.id)) {
        sendDelegate = new SendDelegateToArea(this, game, 'Send a delegate in an area (from lobby)');
      } else if (this.isCorporation(CardName.INCITE) && this.canAfford(3) && game.turmoil!.getDelegates(this.id) > 0) {
        sendDelegate = new SendDelegateToArea(this, game, 'Send a delegate in an area (3 MC)', 1, undefined, 3, false);
      } else if (this.canAfford(5) && game.turmoil!.getDelegates(this.id) > 0) {
        sendDelegate = new SendDelegateToArea(this, game, 'Send a delegate in an area (5 MC)', 1, undefined, 5, false);
      }
      if (sendDelegate) {
        const input = sendDelegate.execute();
        if (input !== undefined) {
          action.options.push(input);
        }
      }
    }

    action.options.sort((a, b) => {
      if (a.title > b.title) {
        return 1;
      } else if (a.title < b.title) {
        return -1;
      }
      return 0;
    });

    if (players.length > 1 && this.actionsTakenThisRound > 0 && !game.gameOptions.fastModeOption && allOtherPlayersHavePassed === false) {
      action.options.push(
        this.endTurnOption(game),
      );
    }

    if (
      this.canAfford(game.getAwardFundingCost()) &&
          !game.allAwardsFunded()) {
      const remainingAwards = new OrOptions();
      remainingAwards.title = 'Fund an award';
      remainingAwards.buttonLabel = 'Confirm';
      remainingAwards.options = game.awards
        .filter((award: IAward) => game.hasBeenFunded(award) === false)
        .map((award: IAward) => this.fundAward(award, game));
      action.options.push(remainingAwards);
    }

    this.addStandardProjects(game, action.options);

    action.options.push(
      this.passOption(game),
    );

    // Propose undo action only if you have done one action this turn
    if (this.actionsTakenThisRound > 0 && game.gameOptions.undoOption) {
      action.options.push(this.undoTurnOption(game));
    }

    this.setWaitingFor(action, () => {
      this.actionsTakenThisRound++;
      this.takeAction(game);
    });
  }

  public allOtherPlayersHavePassed(game: Game): boolean {
    if (game.isSoloMode()) return true;
    const players = game.getPlayers();
    const passedPlayers = game.getPassedPlayers();
    return passedPlayers.length === players.length - 1 && passedPlayers.includes(this.color) === false;
  }

  public process(game: Game, input: Array<Array<string>>): void {
    if (this.waitingFor === undefined || this.waitingForCb === undefined) {
      throw new Error('Not waiting for anything');
    }
    const waitingFor = this.waitingFor;
    const waitingForCb = this.waitingForCb;
    this.waitingFor = undefined;
    this.waitingForCb = undefined;
    try {
      this.timer.stop();
      this.runInput(game, input, waitingFor);
      waitingForCb();
    } catch (err) {
      this.setWaitingFor(waitingFor, waitingForCb);
      throw err;
    }
  }

  public getWaitingFor(): PlayerInput | undefined {
    return this.waitingFor;
  }

  public setWaitingFor(input: PlayerInput, cb: () => void): void {
    this.timer.start();
    this.waitingFor = input;
    this.waitingForCb = cb;
  }

  private serializePlayedCards(): Array<SerializedCard> {
    return this.playedCards.map((c) => {
      const result: SerializedCard = {
        name: c.name,
        resourceCount: c.resourceCount,
      };
      if (c instanceof SelfReplicatingRobots) {
        result.targetCards = c.targetCards;
      }
      return result;
    });
  }

  public serialize(): SerializedPlayer {
    const result: SerializedPlayer = {
      id: this.id,
      corporationCard: this.corporationCard === undefined ? undefined : {
        name: this.corporationCard.name,
        resourceCount: this.corporationCard.resourceCount,
        allTags: this.corporationCard instanceof Aridor ? Array.from(this.corporationCard.allTags) : [],
        isDisabled: this.corporationCard instanceof PharmacyUnion && this.corporationCard.isDisabled,
      },
      // Used only during set-up
      pickedCorporationCard: this.pickedCorporationCard?.name,
      // Terraforming Rating
      terraformRating: this.terraformRating,
      hasIncreasedTerraformRatingThisGeneration: this.hasIncreasedTerraformRatingThisGeneration,
      terraformRatingAtGenerationStart: this.terraformRatingAtGenerationStart,
      // Resources
      megaCredits: this.megaCredits,
      megaCreditProduction: this.megaCreditProduction,
      steel: this.steel,
      steelProduction: this.steelProduction,
      titanium: this.titanium,
      titaniumProduction: this.titaniumProduction,
      plants: this.plants,
      plantProduction: this.plantProduction,
      energy: this.energy,
      energyProduction: this.energyProduction,
      heat: this.heat,
      heatProduction: this.heatProduction,
      // Resource values
      titaniumValue: this.titaniumValue,
      steelValue: this.steelValue,
      // Helion
      canUseHeatAsMegaCredits: this.canUseHeatAsMegaCredits,
      // This generation / this round
      actionsTakenThisRound: this.actionsTakenThisRound,
      actionsThisGeneration: Array.from(this.actionsThisGeneration),
      corporationInitialActionDone: this.corporationInitialActionDone,
      // Cards
      dealtCorporationCards: this.dealtCorporationCards.map((c) => c.name),
      dealtProjectCards: this.dealtProjectCards.map((c) => c.name),
      dealtPreludeCards: this.dealtPreludeCards.map((c) => c.name),
      cardsInHand: this.cardsInHand.map((c) => c.name),
      preludeCardsInHand: this.preludeCardsInHand.map((c) => c.name),
      playedCards: this.serializePlayedCards(),
      draftedCards: this.draftedCards.map((c) => c.name),
      cardCost: this.cardCost,
      needsToDraft: this.needsToDraft,
      cardDiscount: this.cardDiscount,
      // Colonies
      fleetSize: this.fleetSize,
      tradesThisTurn: this.tradesThisTurn,
      colonyTradeOffset: this.colonyTradeOffset,
      colonyTradeDiscount: this.colonyTradeDiscount,
      colonyVictoryPoints: this.colonyVictoryPoints,
      // Turmoil
      turmoilScientistsActionUsed: this.turmoilScientistsActionUsed,
      victoryPointsBreakdown: this.victoryPointsBreakdown,
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
      // Used when undoing action
      usedUndo: this.usedUndo,
    };
    if (this.lastCardPlayed !== undefined) {
      result.lastCardPlayed = this.lastCardPlayed.name;
    }
    return result;
  }

  // Only use useObjectAssign in tests.
  // TODO(kberg): Remove useObjectAssign by 2020-02-01
  public static deserialize(d: SerializedPlayer, useObjectAssign = false): Player {
    const player = new Player(d.name, d.color, d.beginner, d.handicap, d.id);
    const cardFinder = new CardFinder();

    if (useObjectAssign) {
      Object.assign(player, d);
    } else {
      player.actionsTakenThisRound = d.actionsTakenThisRound;
      player.canUseHeatAsMegaCredits = d.canUseHeatAsMegaCredits;
      player.cardCost = d.cardCost;
      player.cardDiscount = d.cardDiscount;
      player.colonyTradeDiscount = d.colonyTradeDiscount;
      player.colonyTradeOffset = d.colonyTradeOffset;
      player.colonyVictoryPoints = d.colonyVictoryPoints;
      player.corporationInitialActionDone = d.corporationInitialActionDone;
      player.energy = d.energy;
      player.energyProduction = d.energyProduction;
      player.fleetSize = d.fleetSize;
      player.hasIncreasedTerraformRatingThisGeneration = d.hasIncreasedTerraformRatingThisGeneration;
      player.heat = d.heat;
      player.heatProduction = d.heatProduction;
      player.megaCreditProduction = d.megaCreditProduction;
      player.megaCredits = d.megaCredits;
      player.needsToDraft = d.needsToDraft;
      player.oceanBonus = d.oceanBonus;
      player.plantProduction = d.plantProduction;
      player.plants = d.plants;
      player.plantsNeededForGreenery = d.plantsNeededForGreenery;
      player.removingPlayers = d.removingPlayers;
      player.scienceTagCount = d.scienceTagCount;
      player.steel = d.steel;
      player.steelProduction = d.steelProduction;
      player.steelValue = d.steelValue;
      player.terraformRating = d.terraformRating;
      player.terraformRatingAtGenerationStart = d.terraformRatingAtGenerationStart;
      player.titanium = d.titanium;
      player.titaniumProduction = d.titaniumProduction;
      player.titaniumValue = d.titaniumValue;
      player.tradesThisTurn = d.tradesThisTurn;
      player.turmoilScientistsActionUsed = d.turmoilScientistsActionUsed;
      player.victoryPointsBreakdown = d.victoryPointsBreakdown;
    }

    player.lastCardPlayed = d.lastCardPlayed !== undefined ?
      cardFinder.getProjectCardByName(d.lastCardPlayed) :
      undefined;

    // Rebuild removed from play cards (Playwrights)
    player.removedFromPlayCards = cardFinder.cardsFromJSON(d.removedFromPlayCards);

    player.actionsThisGeneration = new Set<CardName>(d.actionsThisGeneration);

    if (d.pickedCorporationCard !== undefined) {
      player.pickedCorporationCard = cardFinder.getCorporationCardByName(d.pickedCorporationCard);
    }

    // Rebuild corporation card
    if (d.corporationCard !== undefined) {
      player.corporationCard = cardFinder.getCorporationCardByName(d.corporationCard.name);
      if (player.corporationCard !== undefined) {
        if (d.corporationCard.resourceCount !== undefined) {
          player.corporationCard.resourceCount = d.corporationCard.resourceCount;
        }
      }
      if (player.corporationCard instanceof Aridor) {
        if (d.corporationCard.allTags !== undefined) {
          player.corporationCard.allTags = new Set(d.corporationCard.allTags);
        } else {
          console.warn('did not find allTags for ARIDOR');
        }
      }
      if (player.corporationCard instanceof PharmacyUnion) {
        if (d.corporationCard.isDisabled === true) {
          player.corporationCard.tags = [];
          player.corporationCard.isDisabled = true;
        }
      }
    } else {
      player.corporationCard = undefined;
    }

    // Rebuild dealt corporation array
    player.dealtCorporationCards = cardFinder.corporationCardsFromJSON(d.dealtCorporationCards);

    // Rebuild dealt prelude array
    player.dealtPreludeCards = cardFinder.cardsFromJSON(d.dealtPreludeCards);

    // Rebuild dealt cards array
    player.dealtProjectCards = cardFinder.cardsFromJSON(d.dealtProjectCards);

    // Rebuild each cards in hand
    player.cardsInHand = cardFinder.cardsFromJSON(d.cardsInHand);

    // Rebuild each prelude in hand
    player.preludeCardsInHand = cardFinder.cardsFromJSON(d.preludeCardsInHand);

    // Rebuild each played card
    player.playedCards = d.playedCards.map((element: SerializedCard) => {
      const card = cardFinder.getProjectCardByName(element.name)!;
      if (element.resourceCount !== undefined) {
        card.resourceCount = element.resourceCount;
      }
      if (card instanceof SelfReplicatingRobots && element.targetCards !== undefined) {
        card.targetCards = [];
        element.targetCards.forEach((targetCard) => {
          const foundTargetCard = cardFinder.getProjectCardByName(targetCard.card.name);
          if (foundTargetCard !== undefined) {
            card.targetCards.push({
              card: foundTargetCard,
              resourceCount: targetCard.resourceCount,
            });
          } else {
            console.warn('did not find card for SelfReplicatingRobots', targetCard);
          }
        });
      }
      if (card instanceof MiningCard && element.bonusResource !== undefined) {
        card.bonusResource = element.bonusResource;
      }
      return card;
    });

    // Rebuild each drafted cards
    player.draftedCards = cardFinder.cardsFromJSON(d.draftedCards);

    player.timer = Timer.deserialize(d.timer);

    return player;
  }

  public getFleetSize(): number {
    return this.fleetSize;
  }

  public increaseFleetSize(): void {
    if (this.fleetSize < MAX_FLEET_SIZE) this.fleetSize++;
  }

  public decreaseFleetSize(): void {
    if (this.fleetSize > 0) this.fleetSize--;
  }

  public canPlayColonyPlacementCard(game: Game): boolean {
    let colonyTilesAlreadyBuiltOn: number = 0;

    game.colonies.forEach((colony) => {
      if (colony.colonies.includes(this.id)) colonyTilesAlreadyBuiltOn++;
    });

    return colonyTilesAlreadyBuiltOn < game.colonies.length;
  }

  public getAvailableStandardProjects(game: Game) {
    return new SelectCard(
      'Standard projects',
      'Confirm',
      new CardLoader(game.gameOptions)
        .getStandardProjects().sort((a, b) => a.cost - b.cost)
        .filter((card) => card.canAct(this, game))
        .filter((card) => card.name !== CardName.STANDARD_SELL_PATENTS),
      (card) => card[0].action(this, game),
    );
  }
}
