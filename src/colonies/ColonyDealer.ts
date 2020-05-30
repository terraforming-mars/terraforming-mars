import { IColony } from './Colony';
import { Europa } from './Europa';
import { Ganymede } from './Ganymede';
import { Titan } from './Titan';
import { Callisto } from './Callisto';
import { Triton } from './Triton';
import { Ceres } from './Ceres';
import { Luna } from './Luna';
import { Io } from './Io';
import { Miranda } from './Miranda';
import { Pluto } from './Pluto';
import { Enceladus } from './Enceladus';
import { ColonyName } from './ColonyName';

export interface IColonyFactory<T> {
    colonyName: ColonyName;
    factory: new () => T
}

// ALL COLONIES TILES is now a const not and attribute of Colony Dealer
export const ALL_COLONIES_TILES: Array<IColonyFactory<IColony>> = [
    { colonyName: ColonyName.CERES, factory: Ceres },
    { colonyName: ColonyName.ENCELADUS, factory: Enceladus },
    { colonyName: ColonyName.EUROPA, factory: Europa },
    { colonyName: ColonyName.GANYMEDE, factory: Ganymede },
    { colonyName: ColonyName.IO, factory: Io },
    { colonyName: ColonyName.LUNA, factory: Luna },
    { colonyName: ColonyName.MIRANDA, factory: Miranda },
    { colonyName: ColonyName.TITAN, factory: Titan },
    { colonyName: ColonyName.CALLISTO, factory: Callisto },
    { colonyName: ColonyName.PLUTO, factory: Pluto },
    { colonyName: ColonyName.TRITON, factory: Triton },
];

// Function to return a card object by its name
export function getColonyByName(colonyName: string): IColony | undefined {
    let colonyFactory = ALL_COLONIES_TILES.find((colonyFactory) => colonyFactory.colonyName === colonyName);
    if (colonyFactory !== undefined) {
        return new colonyFactory.factory();
    }
    return undefined;
}

export class ColonyDealer {
    public coloniesDeck: Array<IColony> = [];
    public discardedColonies: Array<IColony> = [];

    public shuffle(cards: Array<any>): Array<any> {
        const deck: Array<any> = [];
        const copy = cards.slice();
        while (copy.length) {
            deck.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
        }
        return deck;
    }
    public discard(card: IColony): void {
        this.discardedColonies.push(card);
    }
    public drawColonies(players: number): Array<IColony> {
        let count: number = players + 2;
        if (players === 1) {
            count = 4;
        } else if (players === 2) {
            count = 5;
        }
        let tempDeck = this.shuffle(ALL_COLONIES_TILES.map((cf) => new cf.factory()));
        for (let i = 0; i < count; i++) {
            this.coloniesDeck.push(tempDeck.pop());
        }    
        this.discardedColonies.push(...tempDeck);
        this.discardedColonies.sort((a,b) => (a.name > b.name) ? 1 : -1);
        this.coloniesDeck.sort((a,b) => (a.name > b.name) ? 1 : -1);

        return this.coloniesDeck;
    }

}    