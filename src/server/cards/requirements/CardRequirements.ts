import {Resource} from '../../../common/Resource';
import {PartyName} from '../../../common/turmoil/PartyName';
import {RequirementType} from '../../../common/cards/RequirementType';
import {ICardRequirements} from '../../../common/cards/ICardRequirements';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {CardRequirement, Options} from './CardRequirement';
import {ChairmanRequirement} from './ChairmanRequirement';
import {CitiesRequirement} from './CitiesRequirement';
import {ColoniesRequirement} from './ColoniesRequirement';
import {FloatersRequirement} from './FloatersRequirement';
import {GreeneriesRequirement} from './GreeneriesRequirement';
import {HabitatRateRequirement} from './HabitatRateRequirement';
import {HabitatTilesRequirement} from './HabitatTilesRequirement';
import {LogisticsRateRequirement} from './LogisticsRateRequirement';
import {MiningRateRequirement} from './MiningRateRequirement';
import {MiningTilesRequirement} from './MiningTilesRequirement';
import {OceanRequirement} from './OceanRequirement';
import {OxygenRequirement} from './OxygenRequirement';
import {PartyLeadersRequirement} from './PartyLeadersRequirement';
import {PartyRequirement} from './PartyRequirement';
import {ProductionRequirement} from './ProductionRequirement';
import {RemovedPlantsRequirement} from './RemovedPlantsRequirement';
import {ResourceTypeRequirement} from './ResourceTypeRequirement';
import {RoadTilesRequirement} from './RoadTilesRequirement';
import {TRRequirement} from './TRRequirement';
import {TagCardRequirement} from './TagCardRequirement';
import {TemperatureRequirement} from './TemperatureRequirement';
import {VenusRequirement} from './VenusRequirement';

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
    const tags: Array<Tag> = [];
    this.requirements.forEach((requirement) => {
      if ((requirement.type === RequirementType.TAG) &&
      requirement.isAny !== true && requirement.isMax !== true) {
        tags.push((requirement as TagCardRequirement).tag);
      }
    });
    if (tags.length > 1 && !player.tags.playerHas(tags)) {
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

  public oceans(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new OceanRequirement(amount, options));
    return this;
  }

  public oxygen(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new OxygenRequirement(amount, options));
    return this;
  }

  public temperature(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new TemperatureRequirement(amount, options));
    return this;
  }

  public venus(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new VenusRequirement(amount, options));
    return this;
  }

  public tr(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new TRRequirement(amount, options));
    return this;
  }

  public chairman(): Builder {
    this.reqs.push(new ChairmanRequirement());
    return this;
  }

  public resourceTypes(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new ResourceTypeRequirement(amount, options));
    return this;
  }

  public greeneries(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new GreeneriesRequirement(amount, options));
    return this;
  }

  public cities(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new CitiesRequirement(amount, options));
    return this;
  }

  public colonies(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new ColoniesRequirement(amount, options));
    return this;
  }

  public floaters(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new FloatersRequirement(amount, options));
    return this;
  }

  public partyLeaders(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new PartyLeadersRequirement(amount, options));
    return this;
  }

  public tag(tag: Tag, amount: number = 1, options?: Options): Builder {
    this.reqs.push(new TagCardRequirement(tag, amount, options));
    return this;
  }

  public production(resource: Resource, amount: number = 1, options?: Options): Builder {
    this.reqs.push(new ProductionRequirement(resource, amount, options));
    return this;
  }

  public party(party: PartyName): Builder {
    this.reqs.push(new PartyRequirement(party));
    return this;
  }

  public plantsRemoved(): Builder {
    this.reqs.push(new RemovedPlantsRequirement());
    return this;
  }

  public habitatRate(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new HabitatRateRequirement(amount, options));
    return this;
  }

  public miningRate(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new MiningRateRequirement(amount, options));
    return this;
  }

  public logisticRate(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new LogisticsRateRequirement(amount, options));
    return this;
  }

  public habitatTiles(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new HabitatTilesRequirement(amount, options));
    return this;
  }

  public miningTiles(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new MiningTilesRequirement(amount, options));
    return this;
  }

  public roadTiles(amount: number = 1, options?: Options): Builder {
    this.reqs.push(new RoadTilesRequirement(amount, options));
    return this;
  }
}
