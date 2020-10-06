import { ELYSIUM_AWARDS, HELLAS_AWARDS, ORIGINAL_AWARDS, VENUS_AWARDS } from "./awards/Awards";
import { Banker } from "./awards/Banker";
import { Benefactor } from "./awards/Benefactor";
import { Celebrity } from "./awards/Celebrity";
import { Contractor } from "./awards/Contractor";
import { Cultivator } from "./awards/Cultivator";
import { DesertSettler } from "./awards/DesertSettler";
import { EstateDealer } from "./awards/EstateDealer";
import { Excentric } from "./awards/Excentric";
import { IAward } from "./awards/IAward";
import { Industrialist } from "./awards/Industrialist";
import { Landlord } from "./awards/Landlord";
import { Magnate } from "./awards/Magnate";
import { Miner } from "./awards/Miner";
import { Scientist } from "./awards/Scientist";
import { SpaceBaron } from "./awards/SpaceBaron";
import { Thermalist } from "./awards/Thermalist";
import { Venuphile } from "./awards/Venuphile";
import { Builder } from "./milestones/Builder";
import { Diversifier } from "./milestones/Diversifier";
import { Ecologist } from "./milestones/Ecologist";
import { Energizer } from "./milestones/Energizer";
import { Gardener } from "./milestones/Gardener";
import { Generalist } from "./milestones/Generalist";
import { Hoverlord } from "./milestones/Hoverlord";
import { IMilestone } from "./milestones/IMilestone";
import { Mayor } from "./milestones/Mayor";
import { ELYSIUM_MILESTONES, HELLAS_MILESTONES, ORIGINAL_MILESTONES, VENUS_MILESTONES } from "./milestones/Milestones";
import { Planner } from "./milestones/Planner";
import { PolarExplorer } from "./milestones/PolarExplorer";
import { RimSettler } from "./milestones/RimSettler";
import { Specialist } from "./milestones/Specialist";
import { Tactician } from "./milestones/Tactician";
import { Terraformer } from "./milestones/Terraformer";
import { Tycoon } from "./milestones/Tycoon";

// exported for testing.
export const MA_ITEMS = [
    ...ORIGINAL_MILESTONES,
    ...ELYSIUM_MILESTONES,
    ...HELLAS_MILESTONES,
    ...VENUS_MILESTONES,

    ...ORIGINAL_AWARDS,
    ...ELYSIUM_AWARDS,
    ...HELLAS_AWARDS,
    ...VENUS_AWARDS
];

export interface IDrawnMilestonesAndAwards {
    milestones: Array<IMilestone>,
    awards: Array<IAward>
};

export function buildSynergies(): Array<Array<number>> {
    const array: Array<Array<number>> = new Array(MA_ITEMS.length);
    for (let idx = 0; idx < MA_ITEMS.length; idx++) {
        array[idx] = new Array(MA_ITEMS.length).fill(0)
        array[idx][idx] = 1000;
    }

    // Higher synergies represent similar milestones or awards. For instance, Terraformer rewards for high TR
    // and the Benefactor award is given to the player with the highets TR. Their synergy weight is 9, very high.
    function bind(first: { new(): IMilestone | IAward }, second: { new(): IMilestone | IAward }, weight: number) {
        const row = MA_ITEMS.findIndex(ma => new first().name === ma.name);
        const col = MA_ITEMS.findIndex(ma => new second().name === ma.name);
        array[row][col] = weight;
        array[col][row] = weight;
    }
    bind(Terraformer, Benefactor, 9);
    bind(Gardener, Cultivator, 9);
    bind(Builder, Contractor, 9);
    bind(EstateDealer, Cultivator, 8);
    bind(Landlord, Cultivator, 8);
    bind(Landlord, DesertSettler, 7);
    bind(Landlord, EstateDealer, 7);
    bind(DesertSettler, Cultivator, 7);
    bind(Miner, Industrialist, 7);
    bind(Energizer, Industrialist, 6);
    bind(Gardener, Landlord, 6);
    bind(Mayor, Landlord, 6);
    bind(Mayor, Cultivator, 6);
    bind(Gardener, EstateDealer, 5);
    bind(Builder, Magnate, 5);
    bind(Tycoon, Magnate, 5);
    bind(PolarExplorer, DesertSettler, 5);
    bind(Hoverlord, Excentric, 5);
    bind(Hoverlord, Venuphile, 5);
    bind(DesertSettler, EstateDealer, 5);
    bind(Builder, Tycoon, 4);
    bind(Specialist, Energizer, 4);
    bind(Mayor, PolarExplorer, 4);
    bind(Mayor, DesertSettler, 4);
    bind(Mayor, EstateDealer, 4);
    bind(Gardener, PolarExplorer, 4);
    bind(Gardener, DesertSettler, 4);
    bind(Ecologist, Excentric, 4);
    bind(PolarExplorer, Landlord, 4);
    bind(Mayor, Gardener, 3);
    bind(Tycoon, Excentric, 3);
    bind(PolarExplorer, Cultivator, 3);
    bind(Energizer, Thermalist, 3);
    bind(RimSettler, SpaceBaron, 3);
    bind(Celebrity, SpaceBaron, 3);
    bind(Benefactor, Cultivator, 3);
    bind(Gardener, Benefactor, 2);
    bind(Specialist, Banker, 2);
    bind(Ecologist, Tycoon, 2);
    bind(Ecologist, Diversifier, 2);
    bind(Tycoon, Scientist, 2);
    bind(Tycoon, Contractor, 2);
    bind(Tycoon, Venuphile, 2);
    bind(PolarExplorer, EstateDealer, 2);
    bind(RimSettler, Celebrity, 2);
    bind(Scientist, Magnate, 2);
    bind(Magnate, SpaceBaron, 2);
    bind(Excentric, Venuphile, 2);
    bind(Terraformer, Cultivator, 2);
    bind(Terraformer, Gardener, 2);
    bind(Builder, Miner, 1);
    bind(Builder, Industrialist, 1);
    bind(Planner, Scientist, 1);
    bind(Generalist, Miner, 1);
    bind(Specialist, Thermalist, 1);
    bind(Specialist, Miner, 1);
    bind(Specialist, Industrialist, 1);
    bind(Ecologist, Cultivator, 1);
    bind(Ecologist, Magnate, 1);
    bind(Tycoon, Diversifier, 1);
    bind(Tycoon, Tactician, 1);
    bind(Tycoon, RimSettler, 1);
    bind(Tycoon, SpaceBaron, 1);
    bind(Diversifier, Magnate, 1);
    bind(Tactician, Scientist, 1);
    bind(Tactician, Magnate, 1);
    bind(RimSettler, Magnate, 1);
    bind(Banker, Benefactor, 1);
    bind(Celebrity, Magnate, 1);
    bind(DesertSettler, Benefactor, 1);
    bind(EstateDealer, Benefactor, 1);
    bind(Terraformer, Landlord, 1);
    bind(Terraformer, Thermalist, 1);
    bind(Terraformer, DesertSettler, 1);
    bind(Terraformer, EstateDealer, 1);
    bind(Gardener, Ecologist, 1);
    return array;
}

const SYNERGIES = buildSynergies();

function shuffleArray(arr: Array<number>) {
    arr = arr.slice()
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

// Returns an array from [start... end]
// eg (4, 11) returns [4, 5, 6, 7, 8, 9, 10, 11]
function getNumbersRange(start: number, end: number): Array<number> {
    return Array.from(Array(end + 1 - start).keys()).map(n => n + start)
}

// Selects |count| milestones and |count| awards from all available awards and milestones (optionally including
// Venusian.) It does this by way of a weighting algorithm, avoiding high-synergy combinations (such as Gardener
// and Cultivator, both of which are about placing forest tiles.)
//
export function getRandomMilestonesAndAwards(withVenusian: boolean = true, count: number): IDrawnMilestonesAndAwards {
    const maxSynergyAllowed = 1;
    let maxSynergyDetected = 1000;
    let candidateIdxs: Array<number> = [];
    while(maxSynergyDetected > maxSynergyAllowed) {
        // selects indexes of |count| random milestones and |count| random awards.
        // For example, if count is 3, output looks like this [m1, m2, m3, a1, a2, a3]
        // where the first three entries are milestone indexes, and the next three are
        // award indexes.
        const rows = shuffleArray(getNumbersRange(0, withVenusian ? 15: 14));
        const cols = shuffleArray(getNumbersRange(16, withVenusian ? 31: 30));
        candidateIdxs = [...rows.slice(0, count), ...cols.slice(0, count)];

        // Search through all pairs of [m1, m2, m3, a1, a2, a3], reading the synergy of
        // each. In this way the maximum synergy is computed between the n*(n-1) pairs.
        maxSynergyDetected = computeSynergy(candidateIdxs);

        // After this, the while loop kicks in again. maxSynergyAllowed is 1. So, if any pairs of
        // [m1, m2, m3, a1, a2, a3] have synergy > 1, the option is rejected and the loop restarts.
    }
    const finalItems = candidateIdxs.map(n => MA_ITEMS[n]);
    return {
        milestones: finalItems.slice(0, count) as Array<IMilestone>,
        awards: finalItems.slice(count) as Array<IAward>,
    }
}

// Visible for testing.
export function computeSynergy(indexes: Array<number>) : number {
    let max = 0;
    for (let i = 0; i<indexes.length - 1; i++) {
        for (let j = i + 1; j<indexes.length; j++) {
            const synergy = SYNERGIES[indexes[i]][indexes[j]];
            max = Math.max(synergy, max);
        }
    }
    return max;
}
