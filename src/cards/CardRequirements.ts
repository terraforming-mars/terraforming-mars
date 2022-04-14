import {Resources} from '../common/Resources';
import {PartyName} from '../common/turmoil/PartyName';
import {CardRequirement, PartyCardRequirement, ProductionCardRequirement, TagCardRequirement} from './CardRequirement';
import {RequirementType} from '../common/cards/RequirementType';
import {ICardRequirements} from '../common/cards/ICardRequirements';
import {Tags} from '../common/cards/Tags';
import {Player} from '../Player';
import {
  MAX_OCEAN_TILES,
  MAX_OXYGEN_LEVEL,
  MAX_TEMPERATURE, MAX_VENUS_SCALE,
  MIN_OXYGEN_LEVEL,
  MIN_TEMPERATURE,
  MIN_VENUS_SCALE,
} from '../common/constants';

export class CardRequirements implements ICardRequirements {
  constructor(public requirements: Array<CardRequirement>) {}

  public static builder(f: (builder: Builder) => void): CardRequirements {
    const builder = new Builder();
    f(builder);
    return builder.build();
  }
  public satisfies(player: Player): boolean {
    // Process tags separately, though max & any tag criteria will be processed later.
    // This pre-computation takes the wild tag into account.
    const tags: Array<Tags> = [];
    this.requirements.forEach((requirement) => {
      if ((requirement.type === RequirementType.TAG) &&
      requirement.isAny !== true && requirement.isMax !== true) {
        tags.push((requirement as TagCardRequirement).tag);
      }
    });
    if (tags.length > 1 && !player.checkMultipleTagPresence(tags)) {
      return false;
    }
    return this.requirements.every((requirement: CardRequirement) => requirement.satisfies(player));
  }
}

export type Options = {max?: boolean, all?: boolean, text?: string};

class Builder {
  private reqs: Array<CardRequirement> = [];

  public build(): CardRequirements {
    return new CardRequirements(this.reqs);
  }

  public oceans(amount: number = 1, options?: Options): Builder {
    const req = new CardRequirement(RequirementType.OCEANS, amount, options);
    if (req.amount <= 0 || req.amount > MAX_OCEAN_TILES) {
      throw new Error('Ocean tiles must be above 0 and below ' + MAX_OCEAN_TILES);
    }
    this.reqs.push(req);
    return this;
  }

  public oxygen(amount: number = 1, options?: Options): Builder {
    const req = new CardRequirement(RequirementType.OXYGEN, amount, options);
    if (req.amount < MIN_OXYGEN_LEVEL || req.amount > MAX_OXYGEN_LEVEL) {
      throw new Error('Oxygen must be above ' + MIN_OXYGEN_LEVEL + ' and below ' + MAX_OXYGEN_LEVEL);
    }
    this.reqs.push(req);
    return this;
  }

  public temperature(amount: number = 1, options?: Options): Builder {
    const req = new CardRequirement(RequirementType.TEMPERATURE, amount, options);
    if (req.amount < MIN_TEMPERATURE || req.amount > MAX_TEMPERATURE) {
      throw new Error('Temperature must be above ' + MIN_TEMPERATURE + ' and below ' + MAX_TEMPERATURE);
    }
    if (req.amount % 2 !== 0) {
      throw new Error('Temperature must be even');
    }
    this.reqs.push(req);
    return this;
  }

  public venus(amount: number = 1, options?: Options): Builder {
    const req =new CardRequirement(RequirementType.VENUS, amount, options);
    if (req.amount < MIN_VENUS_SCALE || req.amount > MAX_VENUS_SCALE) {
      throw new Error('Venus must be above ' + MIN_VENUS_SCALE + ' and below ' + MAX_VENUS_SCALE);
    }
    this.reqs.push(req);
    return this;
  }

  public tr(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.TR, amount, options));
    return this;
  }

  public chairman(): Builder {
    this.reqs.push(new CardRequirement(RequirementType.CHAIRMAN));
    return this;
  }

  public resourceTypes(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.RESOURCE_TYPES, amount, options));
    return this;
  }

  public greeneries(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.GREENERIES, amount, options));
    return this;
  }

  public cities(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.CITIES, amount, options));
    return this;
  }

  public colonies(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.COLONIES, amount, options));
    return this;
  }

  public floaters(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.FLOATERS, amount, options));
    return this;
  }

  public partyLeaders(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.PARTY_LEADERS, amount, options));
    return this;
  }

  public tag(tag: Tags, amount: number = 1, options?: Options): Builder {
    this.reqs.push(new TagCardRequirement(tag, amount, options));
    return this;
  }

  public production(resource: Resources, amount: number = 1, options?: Options): Builder {
    this.reqs.push(new ProductionCardRequirement(resource, amount, options));
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

  public colonyRate(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.COLONY_RATE, amount, options));
    return this;
  }

  public miningRate(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.MINING_RATE, amount, options));
    return this;
  }

  public logisticRate(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.LOGISTIC_RATE, amount, options));
    return this;
  }

  public colonyTiles(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.COLONY_TILES, amount, options));
    return this;
  }

  public miningTiles(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.MINING_TILES, amount, options));
    return this;
  }

  public roadTiles(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CardRequirement(RequirementType.ROAD_TILES, amount, options));
    return this;
  }
}
