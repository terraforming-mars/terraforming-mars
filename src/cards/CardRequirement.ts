import {RequirementType} from '../common/cards/RequirementType';
import {Tags} from '../common/cards/Tags';
import {ICardRequirement, IPartyCardRequirement, IProductionCardRequirement, ITagCardRequirement} from '../common/cards/ICardRequirement';
import {PartyName} from '../common/turmoil/PartyName';
import {Resources} from '../common/Resources';
import {Player} from '../Player';
import {CardResource} from '../common/CardResource';
import {TileType} from '../common/TileType';
import {GlobalParameter} from '../common/GlobalParameter';
import {MoonExpansion} from '../moon/MoonExpansion';
import {Turmoil} from '../turmoil/Turmoil';
import {Options} from './CardRequirements';

export class CardRequirement implements ICardRequirement {
  public readonly isMax: boolean = false;
  public readonly isAny: boolean = false;
  public readonly text: string | undefined = undefined;

  constructor(public readonly type: RequirementType, public amount: number = 1, options?: Options) {
    this.isMax = options?.max ?? false;
    this.isAny = options?.all ?? false;
    this.text = options?.text;
  }

  protected satisfiesInequality(calculated: number) : boolean {
    if (this.isMax) {
      return calculated <= this.amount;
    }
    return calculated >= this.amount;
  }

  public satisfies(player: Player): boolean {
    switch (this.type) {
    case RequirementType.CHAIRMAN:
      return Turmoil.getTurmoil(player.game).chairman === player.id;

    case RequirementType.CITIES:
      return this.satisfiesInequality(player.game.getCitiesCount(this.isAny ? undefined : player));

    case RequirementType.COLONIES:
      const coloniesCount = player.game.colonies.map((colony) => colony.colonies.filter((owner) => owner === player.id).length)
        .reduce((sum, colonyCount) => sum + colonyCount);
      return this.satisfiesInequality(coloniesCount);

    case RequirementType.FLOATERS:
      return this.satisfiesInequality(player.getResourceCount(CardResource.FLOATER));

    case RequirementType.GREENERIES:
      return this.satisfiesInequality(player.game.getGreeneriesCount(this.isAny ? undefined : player));

    case RequirementType.PARTY_LEADERS:
      const turmoil = Turmoil.getTurmoil(player.game);
      const parties = turmoil.parties.filter((party) => party.partyLeader === player.id).length;
      return this.satisfiesInequality(parties);

    case RequirementType.OCEANS:
      return this.checkGlobalRequirement(player, GlobalParameter.OCEANS, this.amount, this.isMax);

    case RequirementType.OXYGEN:
      return this.checkGlobalRequirement(player, GlobalParameter.OXYGEN, this.amount, this.isMax);

    case RequirementType.TEMPERATURE:
      return this.checkGlobalRequirement(player, GlobalParameter.TEMPERATURE, this.amount, this.isMax);

    case RequirementType.VENUS:
      return this.checkGlobalRequirement(player, GlobalParameter.VENUS, this.amount, this.isMax);

    case RequirementType.TR:
      return this.satisfiesInequality(player.getTerraformRating());

    case RequirementType.REMOVED_PLANTS:
      return player.game.someoneHasRemovedOtherPlayersPlants;

    case RequirementType.RESOURCE_TYPES:
      const standardResources = [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT]
        .filter((res) => player.getResource(res) > 0).length;
      const nonStandardResources = new Set(player.getCardsWithResources().map((card) => card.resourceType)).size;
      return this.satisfiesInequality(standardResources + nonStandardResources);

    case RequirementType.COLONY_RATE:
      return this.checkGlobalRequirement(player, GlobalParameter.MOON_COLONY_RATE, this.amount, this.isMax);

    case RequirementType.MINING_RATE:
      return this.checkGlobalRequirement(player, GlobalParameter.MOON_MINING_RATE, this.amount, this.isMax);

    case RequirementType.LOGISTIC_RATE:
      return this.checkGlobalRequirement(player, GlobalParameter.MOON_LOGISTICS_RATE, this.amount, this.isMax);

    case RequirementType.COLONY_TILES:
      return this.satisfiesInequality(
        MoonExpansion.spaces(player.game, TileType.MOON_COLONY, {surfaceOnly: true, ownedBy: this.isAny ? undefined : player}).length);

    case RequirementType.MINING_TILES:
      return this.satisfiesInequality(
        MoonExpansion.spaces(player.game, TileType.MOON_MINE, {surfaceOnly: true, ownedBy: this.isAny ? undefined : player}).length);

    case RequirementType.ROAD_TILES:
      return this.satisfiesInequality(
        MoonExpansion.spaces(player.game, TileType.MOON_ROAD, {surfaceOnly: true, ownedBy: this.isAny ? undefined : player}).length);

    case RequirementType.TAG:
    case RequirementType.PARTY:
    case RequirementType.PRODUCTION:
      throw new Error(`Use subclass satisfies() for requirement type ${this.type}`);
    }
  }

  private checkGlobalRequirement(player: Player, parameter: GlobalParameter, level: number, max: boolean = false): boolean {
    let currentLevel: number;
    let playerRequirementsBonus: number = player.getRequirementsBonus(parameter);

    switch (parameter) {
    case GlobalParameter.OCEANS:
      currentLevel = player.game.board.getOceanCount({upgradedOceans: true, wetlands: true});
      break;
    case GlobalParameter.OXYGEN:
      currentLevel = player.game.getOxygenLevel();
      break;
    case GlobalParameter.TEMPERATURE:
      currentLevel = player.game.getTemperature();
      playerRequirementsBonus *= 2;
      break;

    case GlobalParameter.VENUS:
      currentLevel = player.game.getVenusScaleLevel();
      playerRequirementsBonus *= 2;
      break;

    case GlobalParameter.MOON_COLONY_RATE:
      currentLevel = MoonExpansion.moonData(player.game).colonyRate;
      break;
    case GlobalParameter.MOON_MINING_RATE:
      currentLevel = MoonExpansion.moonData(player.game).miningRate;
      break;
    case GlobalParameter.MOON_LOGISTICS_RATE:
      currentLevel = MoonExpansion.moonData(player.game).logisticRate;
      break;

    default:
      console.warn(`Unknown GlobalParameter provided: ${parameter}`);
      return false;
    }

    if (max) {
      return currentLevel <= level + playerRequirementsBonus;
    } else {
      return currentLevel >= level - playerRequirementsBonus;
    }
  }
}

export class TagCardRequirement extends CardRequirement implements ITagCardRequirement {
  constructor(public tag: Tags, amount: number, options?: Options) {
    super(RequirementType.TAG, amount, options);
  }

  public override satisfies(player: Player): boolean {
    const mode = this.isMax !== true ? 'default' : 'raw';
    let tagCount = player.getTagCount(this.tag, mode);

    if (this.isAny) {
      player.game.getPlayers().forEach((p) => {
        if (p.id !== player.id) {
          // Don't include opponents' wild tags because they are not performing the action.
          tagCount += p.getTagCount(this.tag, 'raw');
        }
      });
    }
    // PoliticalAgendas Scientists P4 hook
    if (this.tag === Tags.SCIENCE && player.hasTurmoilScienceTagBonus) tagCount += 1;

    return this.satisfiesInequality(tagCount);
  }
}

export class ProductionCardRequirement extends CardRequirement implements IProductionCardRequirement {
  constructor(public resource: Resources, amount: number, options?: Options) {
    super(RequirementType.PRODUCTION, amount, options);
  }
  public override satisfies(player: Player): boolean {
    return this.satisfiesInequality(player.getProduction(this.resource));
  }
}

export class PartyCardRequirement extends CardRequirement implements IPartyCardRequirement {
  constructor(public readonly party: PartyName) {
    super(RequirementType.PARTY);
  }
  public override satisfies(player: Player): boolean {
    return Turmoil.getTurmoil(player.game).canPlay(player, this.party);
  }
}
