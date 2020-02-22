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

export const ALL_COLONIES_TILES: Array<IColony> = [
    new Ceres(),
    new Enceladus(),
    new Europa(),
    new Ganymede(),
    new Io(),
    new Luna(),
    new Miranda(),
    new Titan(),
    new Callisto(),
    new Pluto(),
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
        let gameColonies = ALL_COLONIES_TILES.slice();
        let tempDeck = this.shuffle(gameColonies);
        for (let i = 0; i < count; i++) {
            this.coloniesDeck.push(tempDeck.pop());
        }    
        this.discardedColonies.push(...tempDeck);
        this.discardedColonies.sort((a,b) => (a.name > b.name) ? 1 : -1);
        this.coloniesDeck.sort((a,b) => (a.name > b.name) ? 1 : -1);

        return this.coloniesDeck;
    }

}    