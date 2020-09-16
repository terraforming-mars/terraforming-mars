import { ELYSIUM_AWARDS, HELLAS_AWARDS, ORIGINAL_AWARDS, VENUS_AWARDS } from "./awards/Awards";
import { IAward } from "./awards/IAward";
import { IMilestone } from "./milestones/IMilestone";
import { ELYSIUM_MILESTONES, HELLAS_MILESTONES, ORIGINAL_MILESTONES, VENUS_MILESTONES } from "./milestones/Milestones";

const MA_ITEMS = [
    ...ORIGINAL_MILESTONES,
    ...ELYSIUM_MILESTONES,
    ...HELLAS_MILESTONES,
    ...VENUS_MILESTONES,

    ...ORIGINAL_AWARDS,
    ...ELYSIUM_AWARDS,
    ...HELLAS_AWARDS,
    ...VENUS_AWARDS
];

const SYNERGIES = [
    [1000,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,  1,0,0,1,0,0,0,1,1,9,2,0,0,0,0,0],
    [0,1000,3,0,0,0,0,0,0,0,0,0,4,0,0,0,  6,0,0,0,0,0,0,4,4,0,6,0,0,0,0,0],
    [0,0,1000,0,0,0,0,1,0,0,0,0,4,0,0,0,  6,0,0,0,0,0,0,4,5,2,9,0,0,0,0,0],
    [0,0,0,1000,0,0,0,0,4,0,0,0,0,0,0,0,  0,0,0,0,1,0,1,0,0,0,0,5,0,0,9,0],
    [0,0,0,0,1000,0,0,0,0,0,0,0,0,0,0,0,  0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1000,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1000,0,0,0,0,0,0,4,0,0,  0,0,2,1,1,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1000,2,0,2,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,1,1,0,4,0,0],
    [0,0,0,0,0,0,0,0,1000,0,1,1,0,0,1,0,  0,2,0,0,0,0,0,0,0,0,0,5,1,3,2,2],
    [0,0,0,0,0,0,0,0,0,1000,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1000,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,1000,0,0,0,0,  0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1000,0,0,0,  4,0,0,0,0,0,0,5,2,0,3,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,1000,0,0,  0,0,0,3,0,0,6,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1000,0,  0,0,0,0,0,2,0,0,0,0,0,1,3,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1000,  0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,5],

    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  1000,0,0,0,0,0,0,7,7,0,8,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,1000,0,0,0,0,0,0,0,0,0,2,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,1000,0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,1000,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,1000,0,7,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,1000,0,0,0,0,0,1,3,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,1000,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,1000,5,1,7,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,1000,1,8,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,1000,3,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,1000,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,1000,2,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,1000,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,0,1000,0,2],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,0,0,1000,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1000]
];

function shuffleArray(arr: Array<number>) {
    arr = arr.slice()
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr
}

function getNumbersRange(start: number, end: number): Array<number> {
    return Array.from(Array(end + 1 - start).keys()).map(n => n + start)
}

export function getRandomMilestonesAndAwards(withVenusian: boolean = true, requiredQty: number = 5) {
    const maxSynergyAllowed = 1;
    let maxSynergyDetected = 1000;
    let output: Array<number> = [];
    while(maxSynergyDetected > maxSynergyAllowed) {
        maxSynergyDetected = 0;
        let rows = shuffleArray(getNumbersRange(0, withVenusian ? 15: 14));
        let cols = shuffleArray(getNumbersRange(16, withVenusian ? 31: 30));

        output = [...rows.slice(0, requiredQty), ...cols.slice(0, requiredQty)].sort((a, b) => a - b);
        let bound = requiredQty * 2;
        for (let i=0; i<bound - 1; i++) {
            for (let j=i+1; j<bound; j++) {
                maxSynergyDetected = Math.max(
                    SYNERGIES[output[i]][output[j]],
                    maxSynergyDetected
                )
            }
        }
    }
    let finalItems = output.map(n => MA_ITEMS[n]);
    return {
        "milestones": finalItems.slice(0, requiredQty) as Array<IMilestone>,
        "awards": finalItems.slice(requiredQty) as Array<IAward>,
    }
}
