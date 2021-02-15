import {Resources} from '../Resources';
import {PartyName} from '../turmoil/parties/PartyName';
import {CardRequirement, PartyCardRequirement, ProductionCardRequirement, TagCardRequirement} from './CardRequirement';
import {RequirementType} from './RequirementType';
import {Tags} from './Tags';
import {Player} from '../Player';
import {
  MAX_OCEAN_TILES,
  MAX_OXYGEN_LEVEL,
  MAX_TEMPERATURE, MAX_VENUS_SCALE,
  MIN_OXYGEN_LEVEL,
  MIN_TEMPERATURE,
  MIN_VENUS_SCALE,
} from '../constants';

export class CardRequirements {
  constructor(private requirements: Array<CardRequirement>) {}

  public static builder(f: (builder: Builder) => void): CardRequirements {
    const builder = new Builder();
    f(builder);
    return builder.build();
  }
  public getRequirementsText(): string {
    const reqTexts: Array<string> = this.requirements.map((req) => req.getLabel());
    if (this.hasAny()) {
      reqTexts.unshift('Any');
    }
    return reqTexts.join(' ');
  }
  public hasMax(): boolean {
    return this.requirements.some((req) => req.isMax);
  }
  public hasAny(): boolean {
    return this.requirements.some((req) => req.isAny);
  }
  public hasParty(): boolean {
    return this.requirements.some((req) => req instanceof PartyCardRequirement);
  }
  public hasPlantsRemoved(): boolean {
    return this.requirements.some((req) => req.type === RequirementType.REMOVED_PLANTS);
  }
  public satisfies(player: Player): boolean {
    const tags = this.requirements.filter((requirement) => requirement.type === RequirementType.TAG)
      .map((requirement) => (requirement as TagCardRequirement).tag);
    if (!player.checkMultipleTagPresence(tags)) {
      return false;
    }
    return this.requirements.every((requirement: CardRequirement) => requirement.satisfies(player));
  }
}

class Builder {
  private reqs: Array<CardRequirement> = [];

  public build(): CardRequirements {
    return new CardRequirements(this.reqs);
  }

  public oceans(amount: number): Builder {
    if (amount <= 0 || amount > MAX_OCEAN_TILES) {
      throw new Error('Ocean tiles must be above 0 and below ' + MAX_OCEAN_TILES);
    }
    this.reqs.push(new CardRequirement(RequirementType.OCEANS, amount));
    return this;
  }

  public oxygen(amount: number): Builder {
    if (amount < MIN_OXYGEN_LEVEL || amount > MAX_OXYGEN_LEVEL) {
      throw new Error('Oxygen must be above ' + MIN_OXYGEN_LEVEL + ' and below ' + MAX_OXYGEN_LEVEL);
    }
    this.reqs.push(new CardRequirement(RequirementType.OXYGEN, amount));
    return this;
  }

  public temperature(amount: number): Builder {
    if (amount < MIN_TEMPERATURE || amount > MAX_TEMPERATURE) {
      throw new Error('Temperature must be above ' + MIN_TEMPERATURE + ' and below ' + MAX_TEMPERATURE);
    }
    if (amount % 2 !== 0) {
      throw new Error('Temperature must be even');
    }
    this.reqs.push(new CardRequirement(RequirementType.TEMPERATURE, amount));
    return this;
  }

  public venus(amount: number): Builder {
    if (amount < MIN_VENUS_SCALE || amount > MAX_VENUS_SCALE) {
      throw new Error('Venus must be above ' + MIN_VENUS_SCALE + ' and below ' + MAX_VENUS_SCALE);
    }
    this.reqs.push(new CardRequirement(RequirementType.VENUS, amount));
    return this;
  }

  public tr(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.TR, amount));
    return this;
  }

  public chairman(): Builder {
    this.reqs.push(new CardRequirement(RequirementType.CHAIRMAN));
    return this;
  }

  public resourceTypes(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.RESOURCE_TYPES, amount));
    return this;
  }

  public greeneries(amount?: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.GREENERIES, amount));
    return this;
  }

  public cities(amount?: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.CITIES, amount));
    return this;
  }

  public colonies(amount?: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.COLONIES, amount));
    return this;
  }

  public floaters(amount?: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.FLOATERS, amount));
    return this;
  }

  public partyLeaders(amount?: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.PARTY_LEADERS, amount));
    return this;
  }

  public tag(tag: Tags, amount?: number): Builder {
    this.reqs.push(new TagCardRequirement(tag, amount));
    return this;
  }

  public production(resource: Resources, amount?: number): Builder {
    this.reqs.push(new ProductionCardRequirement(resource, amount));
    return this;
  }

  public party(party: PartyName): Builder {
    this.reqs.push(new PartyCardRequirement(party));
    return this;
  }

  public plantsRemoved(): Builder {
    this.reqs.push(new CardRequirement(RequirementType.REMOVED_PLANTS));
    return this;
  }

  public colonyRate(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.COLONY_RATE, amount));
    return this;
  }

  public miningRate(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.MINING_RATE, amount));
    return this;
  }

  public logisticRate(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.LOGISTIC_RATE, amount));
    return this;
  }

  public colonyTiles(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.COLONY_TILES, amount));
    return this;
  }

  public miningTiles(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.MINING_TILES, amount));
    return this;
  }

  public roadTiles(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.ROAD_TILES, amount));
    return this;
  }

  public max(): Builder {
    const req = this.reqs.pop();
    if (req === undefined) {
      throw new Error('Called max without a CardRequirement.');
    }
    this.reqs.push(req.max());
    return this;
  }

  public any(): Builder {
    const req = this.reqs.pop();
    if (req === undefined) {
      throw new Error('Called any without a CardRequirement.');
    }
    this.reqs.push(req.any());
    return this;
  }
}
