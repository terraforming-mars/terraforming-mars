import {RequirementType} from './RequirementType';
import {Tags} from './Tags';
import {PartyName} from '../turmoil/parties/PartyName';
import {Resources} from '../Resources';
import {Player} from '../Player';
import {ResourceType} from '../ResourceType';
import {TileType} from '../TileType';
import {GlobalParameter} from '../GlobalParameter';
import {MoonExpansion} from '../moon/MoonExpansion';

const firstLetterUpperCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export class CardRequirement {
  constructor(private _type: RequirementType, protected _amount: number = 1, private _isMax: boolean = false, private _isAny: boolean = false) {}

  private amountToString(): string {
    if (this._type === RequirementType.OXYGEN || this._type === RequirementType.VENUS) {
      return `${this._amount}%`;
    } else if (this._type === RequirementType.TEMPERATURE) {
      return `${this._amount}°`;
    } else {
      return (this._amount !== 1 || this._isMax) ? this._amount.toString() : '';
    }
  }

  protected parseType(): string {
    const withPlural: Array<string> = [RequirementType.OCEANS, RequirementType.FLOATERS, RequirementType.GREENERIES, RequirementType.CITIES, RequirementType.COLONIES, RequirementType.RESOURCE_TYPES, RequirementType.PARTY_LEADERS];

    if (this._amount > 1 && withPlural.includes(this._type)) {
      return this.getTypePlural();
    }

    return this._type;
  }

  // TODO (chosta): add to a top level class - preferrably translatable
  public getTypePlural(): string {
    if (this._type === RequirementType.CITIES) {
      return 'Cities';
    } else if (this._type === RequirementType.COLONIES) {
      return 'Colonies';
    } else if (this._type === RequirementType.GREENERIES) {
      return 'Greeneries';
    } else {
      return `${this._type}s`;
    }
  }

  public getLabel(): string {
    let result: string = this._isMax ? 'max ' : '';
    const amount = this.amountToString();
    if (amount !== '') {
      result += amount;
      result += ' ';
    }
    result += this.parseType();

    return result;
  }

  public max(): CardRequirement {
    this._isMax = true;
    return this;
  }

  public any(): CardRequirement {
    this._isAny = true;
    return this;
  }

  public get isMax(): boolean {
    return this._isMax;
  }
  public get isAny(): boolean {
    return this._isAny;
  }
  public get type(): RequirementType {
    return this._type;
  }
  public get amount(): number {
    return this._amount;
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
      return player.game.turmoil?.chairman === player.id;

    case RequirementType.CITIES:
      if (this._isAny) {
        return this.satisfiesInequality(player.game.getCitiesInPlay());
      } else {
        return this.satisfiesInequality(player.getCitiesCount());
      }

    case RequirementType.COLONIES:
      const coloniesCount = player.game.colonies.map((colony) => colony.colonies.filter((owner) => owner === player.id).length)
        .reduce((sum, colonyCount) => sum + colonyCount);
      return this.satisfiesInequality(coloniesCount);

    case RequirementType.FLOATERS:
      return this.satisfiesInequality(player.getResourceCount(ResourceType.FLOATER));

    case RequirementType.GREENERIES:
      const greeneries = player.game.board.spaces.filter(
        (space) => space.tile !== undefined &&
            space.tile.tileType === TileType.GREENERY &&
            (space.player === player || this._isAny),
      ).length;
      return this.satisfiesInequality(greeneries);

    case RequirementType.PARTY_LEADERS:
      if (player.game.turmoil !== undefined) {
        const parties = player.game.turmoil.parties.filter((party) => party.partyLeader === player.id).length;
        return this.satisfiesInequality(parties);
      }
      return false;

    case RequirementType.OCEANS:
      return player.game.checkRequirements(player, GlobalParameter.OCEANS, this.amount, this.isMax);

    case RequirementType.OXYGEN:
      return player.game.checkRequirements(player, GlobalParameter.OXYGEN, this.amount, this.isMax);

    case RequirementType.TEMPERATURE:
      return player.game.checkRequirements(player, GlobalParameter.TEMPERATURE, this.amount, this.isMax);

    case RequirementType.VENUS:
      return player.game.checkRequirements(player, GlobalParameter.VENUS, this.amount, this.isMax);

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
      return this.satisfiesInequality(MoonExpansion.moonData(player.game).colonyRate);

    case RequirementType.MINING_RATE:
      return this.satisfiesInequality(MoonExpansion.moonData(player.game).miningRate);

    case RequirementType.LOGISTIC_RATE:
      return this.satisfiesInequality(MoonExpansion.moonData(player.game).logisticRate);

    case RequirementType.COLONY_TILES:
      return this.satisfiesInequality(
        MoonExpansion.tiles(player.game, TileType.MOON_COLONY, true, this._isAny ? undefined : player).length);

    case RequirementType.MINING_TILES:
      return this.satisfiesInequality(MoonExpansion.tiles(player.game, TileType.MOON_MINE, true, this._isAny ? undefined : player).length);

    case RequirementType.ROAD_TILES:
      return this.satisfiesInequality(MoonExpansion.tiles(player.game, TileType.MOON_ROAD, true, this._isAny ? undefined : player).length);

    case RequirementType.TAG:
    case RequirementType.PARTY:
    case RequirementType.PRODUCTION:
      throw `Use subclass satisfies() for requirement type ${this.type}`;
    }
  }
}

export class TagCardRequirement extends CardRequirement {
  constructor(public tag: Tags, amount: number = 1) {
    super(RequirementType.TAG, amount);
  }

  protected parseType(): string {
    return firstLetterUpperCase(this.tag);
  }
  public satisfies(player: Player): boolean {
    let tagCount = player.getTagCount(this.tag);
    // PoliticalAgendas Scientists P4 hook
    if (this.tag === Tags.SCIENCE && player.hasTurmoilScienceTagBonus) tagCount += 1;

    return this.satisfiesInequality(tagCount);
  }
}

export class ProductionCardRequirement extends CardRequirement {
  constructor(private resource: Resources, amount: number = 1) {
    super(RequirementType.RESOURCE_TYPES, amount);
  }

  protected parseType(): string {
    return `${firstLetterUpperCase(this.resource)} production`;
  }
  public satisfies(player: Player): boolean {
    return this.satisfiesInequality(player.getProduction(this.resource));
  }
}

export class PartyCardRequirement extends CardRequirement {
  constructor(private party: PartyName) {
    super(RequirementType.PARTY);
  }
  protected parseType(): string {
    return this.party.toLowerCase();
  }
  public satisfies(player: Player): boolean {
    if (player.game.turmoil !== undefined) {
      return player.game.turmoil.canPlay(player, this.party);
    }
    return false;
  }
}
