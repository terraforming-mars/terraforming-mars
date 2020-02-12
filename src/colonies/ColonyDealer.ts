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

export const ALL_COLONIES_TILES: Array<IColony> = [
    new Ceres(),
    new Europa(),
    new Ganymede(),
    new Io(),
    new Luna(),
    new Miranda(),
    new Titan(),
    new Callisto(),
    new Triton()
]

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
        if (players === 1) count = 4;
        let i: number = 0;
        let tempDeck = this.shuffle(ALL_COLONIES_TILES);
        // TO BE REMOVED, USED FOR TESTING, ADD ALL COLONIES
        count = ALL_COLONIES_TILES.length;
        while (i < count) {
            this.coloniesDeck.push(tempDeck.pop());
            i++;
        }
        this.discardedColonies.push(...tempDeck);
        return this.coloniesDeck;
    }

}    