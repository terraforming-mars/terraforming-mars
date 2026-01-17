import {RequirementType} from '@/common/cards/RequirementType';
import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';
import {CardRequirement} from '@/server/cards/requirements/CardRequirement';
import {ChairmanRequirement} from '@/server/cards/requirements/ChairmanRequirement';
import {CitiesRequirement} from '@/server/cards/requirements/CitiesRequirement';
import {ColoniesRequirement} from '@/server/cards/requirements/ColoniesRequirement';
import {FloatersRequirement} from '@/server/cards/requirements/FloatersRequirement';
import {GreeneriesRequirement} from '@/server/cards/requirements/GreeneriesRequirement';
import {HabitatRateRequirement} from '@/server/cards/requirements/HabitatRateRequirement';
import {HabitatTilesRequirement} from '@/server/cards/requirements/HabitatTilesRequirement';
import {LogisticsRateRequirement} from '@/server/cards/requirements/LogisticsRateRequirement';
import {MiningRateRequirement} from '@/server/cards/requirements/MiningRateRequirement';
import {MiningTilesRequirement} from '@/server/cards/requirements/MiningTilesRequirement';
import {OceanRequirement} from '@/server/cards/requirements/OceanRequirement';
import {OxygenRequirement} from '@/server/cards/requirements/OxygenRequirement';
import {PartyLeadersRequirement} from '@/server/cards/requirements/PartyLeadersRequirement';
import {PartyRequirement} from '@/server/cards/requirements/PartyRequirement';
import {ProductionRequirement} from '@/server/cards/requirements/ProductionRequirement';
import {RemovedPlantsRequirement} from '@/server/cards/requirements/RemovedPlantsRequirement';
import {ResourceTypeRequirement} from '@/server/cards/requirements/ResourceTypeRequirement';
import {RoadTilesRequirement} from '@/server/cards/requirements/RoadTilesRequirement';
import {TRRequirement} from '@/server/cards/requirements/TRRequirement';
import {TagCardRequirement} from '@/server/cards/requirements/TagCardRequirement';
import {TemperatureRequirement} from '@/server/cards/requirements/TemperatureRequirement';
import {VenusRequirement} from '@/server/cards/requirements/VenusRequirement';
import {CardRequirementDescriptor} from '@/common/cards/CardRequirementDescriptor';
import {CorruptionRequirement} from '@/server/cards/requirements/CorruptionRequirement';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {UndergroundTokenRequirement} from '@/server/cards/requirements/UndergroundTokenRequirement';

export class CardRequirements {
  constructor(public requirements: Array<CardRequirement>) {}

  public satisfies(player: IPlayer, card: IProjectCard): boolean {
    if (this.requirements.length === 0) {
      return true;
    }
    // Process tags separately, though max & any tag criteria will be processed later.
    // This pre-computation takes the wild tag into account.
    const tags: Array<Tag> = [];
    for (const requirement of this.requirements) {
      if ((requirement.type === RequirementType.TAG) &&
        requirement.all !== true && requirement.max !== true) {
        tags.push((requirement as TagCardRequirement).tag);
      }
    }
    if (tags.length > 1 && !player.tags.playerHas(tags)) {
      return false;
    }
    for (const requirement of this.requirements) {
      const satisfies = requirement.satisfies(player, card);
      if (satisfies === false) {
        return false;
      }
    }
    return true;
  }

  public static compile(descriptors: Array<CardRequirementDescriptor> | undefined): CardRequirements {
    if (descriptors === undefined) {
      return new CardRequirements([]);
    }
    return new CardRequirements(descriptors.map((descriptor) => CardRequirements.compileOne(descriptor)));
  }

  private static compileOne(descriptor: CardRequirementDescriptor): CardRequirement {
    if (descriptor.tag !== undefined) {
      return new TagCardRequirement(descriptor.tag, descriptor);
    } else if (descriptor.oceans !== undefined) {
      return new OceanRequirement({...descriptor, count: descriptor.oceans});
    } else if (descriptor.oxygen !== undefined) {
      return new OxygenRequirement({...descriptor, count: descriptor.oxygen});
    } else if (descriptor.temperature !== undefined) {
      return new TemperatureRequirement({...descriptor, count: descriptor.temperature});
    } else if (descriptor.venus !== undefined) {
      return new VenusRequirement({...descriptor, count: descriptor.venus});
    } else if (descriptor.tr !== undefined) {
      return new TRRequirement({...descriptor, count: descriptor.tr});
    } else if (descriptor.chairman !== undefined) {
      return new ChairmanRequirement();
    } else if (descriptor.resourceTypes !== undefined) {
      return new ResourceTypeRequirement({...descriptor, count: descriptor.resourceTypes});
    } else if (descriptor.greeneries !== undefined) {
      return new GreeneriesRequirement({...descriptor, count: descriptor.greeneries});
    } else if (descriptor.cities !== undefined) {
      return new CitiesRequirement({...descriptor, count: descriptor.cities});
    } else if (descriptor.colonies !== undefined) {
      return new ColoniesRequirement({...descriptor, count: descriptor.colonies, all: descriptor.all});
    } else if (descriptor.floaters !== undefined) {
      return new FloatersRequirement({...descriptor, count: descriptor.floaters});
    } else if (descriptor.partyLeader !== undefined) {
      return new PartyLeadersRequirement(descriptor);
    } else if (descriptor.production !== undefined) {
      return new ProductionRequirement(descriptor.production, descriptor);
    } else if (descriptor.party !== undefined) {
      return new PartyRequirement(descriptor.party);
    } else if (descriptor.plantsRemoved !== undefined) {
      return new RemovedPlantsRequirement();
    } else if (descriptor.habitatRate !== undefined) {
      return new HabitatRateRequirement({...descriptor, count: descriptor.habitatRate});
    } else if (descriptor.miningRate !== undefined) {
      return new MiningRateRequirement({...descriptor, count: descriptor.miningRate});
    } else if (descriptor.logisticRate !== undefined) {
      return new LogisticsRateRequirement({...descriptor, count: descriptor.logisticRate});
    } else if (descriptor.habitatTiles !== undefined) {
      return new HabitatTilesRequirement({...descriptor, count: descriptor.habitatTiles});
    } else if (descriptor.miningTiles !== undefined) {
      return new MiningTilesRequirement({...descriptor, count: descriptor.miningTiles});
    } else if (descriptor.roadTiles !== undefined) {
      return new RoadTilesRequirement({...descriptor, count: descriptor.roadTiles});
    } else if (descriptor.corruption !== undefined) {
      return new CorruptionRequirement({...descriptor, count: descriptor.corruption});
    } else if (descriptor.undergroundTokens !== undefined) {
      return new UndergroundTokenRequirement({...descriptor, count: descriptor.undergroundTokens});
    } else {
      throw new Error('Unknown requirement: ' + JSON.stringify(descriptor));
    }
  }
}
