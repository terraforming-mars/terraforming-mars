import {PartyName} from '../../common/turmoil/PartyName';
import {Tag} from '../../common/cards/Tag';
import {Resource} from '../../common/Resource';

type TagRequirement = {tag: Tag, count?: number};
type GlobalRequirement = {oxygen: number} | {temperature: number};
type TileRequirement = {greeneries: number} | {cities: number, nextTo?: boolean, text?: string} | {oceans: number};
type ProductionRequirement = {production: Resource, count: number};
type VenusRequirement = {venus: number} | {floaters: number};
type ColoniesRequirement = {colonies: number};
type TurmoilRequirement = {party: PartyName} | {chairman: {}} | {partyLeader: number};
type MoonRequirement = {habitatTiles: number} | {miningTiles: number} | {roadTiles: number} | {habitatRate: number} | {miningRate: number} | {logisticRate: number};
type MiscRequirement = {plantsRemoved: boolean} | {resourceTypes: number} | {tr: number};
export type CardRequirementsDescriptor =
  (
    TagRequirement |
    GlobalRequirement |
    TileRequirement |
    ProductionRequirement |
    VenusRequirement |
    ColoniesRequirement |
    TurmoilRequirement |
    MoonRequirement |
    MiscRequirement) & {max?: boolean, all?: boolean}
