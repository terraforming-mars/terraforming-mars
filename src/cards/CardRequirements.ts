import {Resources} from '../Resources';
import {PartyName} from '../turmoil/parties/PartyName';
import {CardRequirement, PartyCardRequirement, ProductionCardRequirement, TagCardRequirement} from './CardRequirement';
import {RequirementType} from './RequirementType';
import {Tags} from './Tags';

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
}

class Builder {
  private reqs: Array<CardRequirement> = [];

  public build(): CardRequirements {
    return new CardRequirements(this.reqs);
  }

  public oceans(amount: number = -1): Builder {
    this.reqs.push(new CardRequirement(RequirementType.OCEANS, amount));
    return this;
  }

  public oxygen(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.OXYGEN, amount));
    return this;
  }

  public temperature(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.TEMPERATURE, amount));
    return this;
  }

  public venus(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.VENUS, amount));
    return this;
  }

  public tr(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.TR, amount));
    return this;
  }

  public chairman(): Builder {
    this.reqs.push(new CardRequirement(RequirementType.CHAIRMAN, -1));
    return this;
  }

  public resourceTypes(amount: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.RESOURCE_TYPES, amount));
    return this;
  }

  public greeneries(amount: number = -1): Builder {
    this.reqs.push(new CardRequirement(RequirementType.GREENERIES, amount));
    return this;
  }

  public cities(amount: number = -1): Builder {
    this.reqs.push(new CardRequirement(RequirementType.CITIES, amount));
    return this;
  }

  public colonies(amount: number = -1): Builder {
    this.reqs.push(new CardRequirement(RequirementType.COLONIES, amount));
    return this;
  }

  public floaters(amount: number = -1): Builder {
    this.reqs.push(new CardRequirement(RequirementType.FLOATERS, amount));
    return this;
  }

  public partyLeaders(amount: number = -1): Builder {
    this.reqs.push(new CardRequirement(RequirementType.PARTY_LEADERS, amount));
    return this;
  }

  public tag(tag: Tags, amount: number = -1): Builder {
    this.reqs.push(new TagCardRequirement(tag, amount));
    return this;
  }

  public production(resource: Resources, amount: number = -1): Builder {
    this.reqs.push(new ProductionCardRequirement(resource, amount));
    return this;
  }

  public party(party: PartyName): Builder {
    this.reqs.push(new PartyCardRequirement(party));
    return this;
  }

  public plantsRemoved(): Builder {
    this.reqs.push(new CardRequirement(RequirementType.REMOVED_PLANTS, -1));
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
