import {RequirementType} from '../../../common/cards/RequirementType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirement, YesAnd} from './CardRequirement';
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
import {CardRequirementDescriptor} from '../../../common/cards/CardRequirementDescriptor';
import {CorruptionRequirement} from './CorruptionRequirement';
import {SumTagsCardRequirement} from './SumTagsCardRequirement';
import {UniqueTagsCardRequirement} from './UniqueTagsCardRequirement';

export class CardRequirements {
  constructor(public requirements: Array<CardRequirement>) {}

  public satisfies(player: IPlayer): boolean | YesAnd {
    if (this.requirements.length === 0) {
      return true;
    }
    // Process tags separately, though max & any tag criteria will be processed later.
    // This pre-computation takes the wild tag into account.
    const tags: Array<Tag> = [];
    this.requirements.forEach((requirement) => {
      if ((requirement.type === RequirementType.TAG) &&
      requirement.all !== true && requirement.max !== true) {
        tags.push((requirement as TagCardRequirement).tag);
      }
    });
    if (tags.length > 1 && !player.tags.playerHas(tags)) {
      return false;
    }
    const thinkTankResources = player.playedCards.find((c) => c.name === CardName.THINK_TANK)?.resourceCount;
    let result: boolean | YesAnd = true;
    for (const requirement of this.requirements) {
      const satisfies = requirement.satisfies(player, thinkTankResources);
      if (satisfies === false) {
        return false;
      }
      if (typeof(satisfies) === 'object') {
        result = satisfies;
      }
    }
    return result;
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
      return new ColoniesRequirement({...descriptor, count: descriptor.colonies});
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
    // } else if (descriptor.excavation !== undefined) {
    //   return new ExcavationRequirement({...descriptor, count: descriptor.excavation});
    } else if (descriptor.corruption !== undefined) {
      return new CorruptionRequirement({...descriptor, count: descriptor.corruption});
    } else if (descriptor.sumTags !== undefined) {
      return new SumTagsCardRequirement(descriptor.sumTags, descriptor);
    } else if (descriptor.uniqueTags !== undefined) {
      return new UniqueTagsCardRequirement(descriptor);
    } else {
      throw new Error('Unknown requirement: ' + JSON.stringify(descriptor));
    }
  }
}
