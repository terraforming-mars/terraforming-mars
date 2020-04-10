import { GlobalEventName } from './GlobalEventName';
import { IGlobalEvent } from './IGlobalEvent';
import { GlobalDustStorm } from './GlobalDustStorm';

export interface IGlobalEventFactory<T> {
    globalEventName: GlobalEventName;
    factory: new () => T
}

// ALL GLOBAL EVENTS
export const ALL_GLOBAL_EVENTS: Array<IGlobalEventFactory<IGlobalEvent>> = [
    { globalEventName: GlobalEventName.GLOBAL_DUST_STORM , factory: GlobalDustStorm }
];

export class GlobalEventDealer {
    public globalEventsDeck: Array<IGlobalEvent> = this.shuffle(ALL_GLOBAL_EVENTS.map((cf) => new cf.factory()));
    public discardedGlobalEvents: Array<IGlobalEvent> = [];

    private shuffle(cards: Array<any>): Array<any> {
        const deck: Array<any> = [];
        const copy = cards.slice();
        while (copy.length) {
            deck.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
        }
        return deck;
    }

    public draw(): IGlobalEvent | undefined{
        const globalEvent = this.globalEventsDeck.pop();
        if (globalEvent) return globalEvent;
        return undefined;
    }

}    