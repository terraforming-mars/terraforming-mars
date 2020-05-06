import { PartyName } from "./parties/PartyName";
import { IParty } from "./parties/IParty";
import { MarsFirst } from "./parties/MarsFirst";
import { Scientists } from "./parties/Scientists";
import { Unity } from "./parties/Unity";
import { Kelvinists } from "./parties/Kelvinists";
import { Reds } from "./parties/Reds";
import { Greens } from "./parties/Greens";
import { Player } from "../Player";
import { Game } from "../Game";
import { GlobalEventDealer, getGlobalEventByName } from "./globalEvents/GlobalEventDealer";
import { IGlobalEvent } from "./globalEvents/IGlobalEvent";
import { ILoadable } from "../ILoadable";
import { SerializedTurmoil } from "./SerializedTurmoil";
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from '../LogMessageData';
import { LogMessageDataType } from '../LogMessageDataType';
import { Resources } from "../Resources";

export interface IPartyFactory<T> {
    partyName: PartyName;
    factory: new () => T
}

export const ALL_PARTIES: Array<IPartyFactory<IParty>> = [
    { partyName: PartyName.MARS, factory: MarsFirst },
    { partyName: PartyName.SCIENTISTS, factory: Scientists },
    { partyName: PartyName.UNITY, factory: Unity },
    { partyName: PartyName.KELVINISTS, factory: Kelvinists },
    { partyName: PartyName.REDS, factory: Reds },
    { partyName: PartyName.GREENS, factory: Greens }
];

export class Turmoil implements ILoadable<SerializedTurmoil, Turmoil> {
    public chairman: undefined | Player | "NEUTRAL" = undefined;
    public rulingParty: undefined | IParty = undefined;
    public dominantParty: undefined | IParty = undefined;
    public lobby: Set<string> = new Set<string>();
    public delegate_reserve: Array<Player | "NEUTRAL"> = new Array<Player | "NEUTRAL">();
    public parties: Array<IParty> = [];
    public playersInfluenceBonus: Map<string, number> = new Map<string, number>();
    public globalEventDealer: GlobalEventDealer;
    public distantGlobalEvent: IGlobalEvent | undefined;
    public commingGlobalEvent: IGlobalEvent | undefined;
    public currentGlobalEvent: IGlobalEvent | undefined;

    constructor(game: Game) {
        // Init parties
        this.parties = ALL_PARTIES.map((cf) => new cf.factory());

        game.getPlayers().forEach(player => {
            // Begin with one delegate in the lobby
            this.lobby.add(player.id);
            // Begin with six delegates in the delegate reserve
            for (let i = 0; i < 6; i++) {
                this.delegate_reserve.push(player);   
            }
        });

        // The game begin with Neutral chairman
        this.chairman = "NEUTRAL";

        // First ruling party should be green
        this.rulingParty = this.getPartyByName(PartyName.GREENS);

        // Begin with 13 neutral delegates in the reserve
        for (let i = 0; i < 13; i++) {
            this.delegate_reserve.push("NEUTRAL");   
        }

        // Init the global event dealer
        this.globalEventDealer = new GlobalEventDealer();
        this.globalEventDealer.initGlobalEvents(game);
        this.initGlobalEvent(game);
    }

    public initGlobalEvent(game: Game) {
        // Draw the first global event to setup the game
        this.commingGlobalEvent = this.globalEventDealer.draw();
        if (this.commingGlobalEvent !== undefined) {
            this.sendDelegateToParty("NEUTRAL", this.commingGlobalEvent.revealedDelegate, game);
        }
        this.distantGlobalEvent = this.globalEventDealer.draw();
        if (this.distantGlobalEvent !== undefined) {
            this.sendDelegateToParty("NEUTRAL", this.distantGlobalEvent.revealedDelegate, game);
        }
    }

    // Function to return a party by name
    public getPartyByName(partyName: PartyName): IParty | undefined {
        return this.parties.find((party) => party.name === partyName);
    }

    // Use to send a delegate to a specific party
    public sendDelegateToParty(player: Player | "NEUTRAL", partyName: PartyName, game: Game): void {
        const party = this.getPartyByName(partyName);
        if (party) {
            if (player != "NEUTRAL" && this.lobby.has(player.id)) {
                this.lobby.delete(player.id);
            }
            else {
                const index = this.delegate_reserve.indexOf(player);
                if (index > -1) {
                    this.delegate_reserve.splice(index, 1);
                }
            }
            party.sendDelegate(player, game);
            this.checkDominantParty(party);
        }
        else {
            throw "Party not found";
        }
    }

    // Use to remove a delegate from a specific party
    public removeDelegateFromParty(player: Player | "NEUTRAL", partyName: PartyName, game: Game): void {
        const party = this.getPartyByName(partyName);
        if (party) {
            this.delegate_reserve.push(player);
            party.removeDelegate(player, game);
            this.checkDominantParty(party);
        }
        else {
            throw "Party not found";
        }
    }

    // Check dominant party
    public checkDominantParty(party:IParty): void {
        // If there is a dominant party
        if (this.dominantParty) {
            let sortParties = [...this.parties].sort(
                (p1, p2) => p2.delegates.length - p1.delegates.length
            );
            const max = sortParties[0].delegates.length;
            if (this.dominantParty.delegates.length != max) {
                this.setNextPartyAsDominant(this.dominantParty);
            }
        }
        else {
            this.dominantParty = party;
        }
    }

    // Function to get next dominant party taking into account the clockwise order
    public setNextPartyAsDominant(currentDominantParty: IParty) {
        let sortParties = [...this.parties].sort(
            (p1, p2) => p2.delegates.length - p1.delegates.length
        );
        const max = sortParties[0].delegates.length;
        
        const currentIndex = this.parties.indexOf(currentDominantParty);
        
        let partiesToCheck = [];

        // Manage if it's the first party or the last
        if (currentIndex === 0) {
            partiesToCheck = this.parties.slice(currentIndex + 1);
        }
        else if (currentIndex === this.parties.length - 1) {
            partiesToCheck = this.parties.slice(0, currentIndex);
        }
        else {
            let left = this.parties.slice(0, currentIndex);
            const right = this.parties.slice(currentIndex + 1);
            partiesToCheck = right.concat(left);
        }

        // Take the clockwise order
        const partiesOrdered = partiesToCheck.reverse();
        
        partiesOrdered.some(newParty => {
            if (newParty.delegates.length === max) {
                this.dominantParty = newParty;
                return true;
            }
            return false;
        });   
    }

    // Launch the turmoil phase
    public endGeneration(game: Game): void {
        // 1 - All player lose 1 TR
        game.getPlayers().forEach(player => {
            player.decreaseTerraformRating();
        });
        
        // 2 - Global Event
        if (this.currentGlobalEvent) {
            this.currentGlobalEvent.resolve(game, this);
        }

        // 3 - New Gouvernment
        this.rulingParty = this.dominantParty;

        // 3.a - Ruling Policy change
        if (this.rulingParty) {
            this.setRulingParty(game);
        }

        // 3.b - New dominant party
        this.setNextPartyAsDominant(this.rulingParty!);

        // 3.c - Fill the lobby
        this.lobby.forEach(playerId => {
            this.delegate_reserve.push(game.getPlayerById(playerId));
        });
        this.lobby = new Set<string>();

        game.getPlayers().forEach(player => {
            if (this.getDelegates(player) > 0) { 
                const index = this.delegate_reserve.indexOf(player);
                if (index > -1) {
                    this.delegate_reserve.splice(index, 1);
                }
                this.lobby.add(player.id);
            }
        });

        // 4 - Changing Time
        if (this.currentGlobalEvent) {
            this.globalEventDealer.discardedGlobalEvents.push(this.currentGlobalEvent);
        }
        // 4.a - Coming Event is now Current event. Add neutral delegate.
        this.currentGlobalEvent = this.commingGlobalEvent;
        if (this.currentGlobalEvent) {
            this.sendDelegateToParty("NEUTRAL", this.currentGlobalEvent.currentDelegate, game);
        }
        // 4.b - Distant Event is now Coming Event
        this.commingGlobalEvent = this.distantGlobalEvent;
        // 4.c - Draw the new distant event and add neutral delegate
        this.distantGlobalEvent = this.globalEventDealer.draw();
        if (this.distantGlobalEvent) {
            this.sendDelegateToParty("NEUTRAL", this.distantGlobalEvent.revealedDelegate, game);
        }
        game.log(
            LogMessageType.DEFAULT,
            "Turmoil phase has been resolved");        
    }

    // Ruling Party changes
    public setRulingParty(game: Game): void {
        if (this.rulingParty) {
            // Resolve Ruling Bonus
            this.rulingParty.rulingBonus(game);

            // Change the chairman
            if (this.chairman) {
                this.delegate_reserve.push(this.chairman);
            }
            
            this.chairman = this.rulingParty.partyLeader;
            if (this.chairman) {
                if (this.chairman instanceof Player) {
                    // Reds hook (chairman must no loose 3 MC here if reds are rulling)
                    if (this.rulingParty.name === PartyName.REDS) {
                        this.chairman.setResource(Resources.MEGACREDITS, 3);
                    }
                    this.chairman.increaseTerraformRating(game);


                    game.log(
                        LogMessageType.DEFAULT,
                        "${0} is the new chairman and got 1 TR increase",
                        new LogMessageData(LogMessageDataType.PLAYER, this.chairman.id));
                }
            }
            else {
                console.error("No chairman");
            }

            const index = this.rulingParty.delegates.indexOf(this.rulingParty.partyLeader!);
            // Remove the party leader from the delegates array
            this.rulingParty.delegates.splice(index, 1);
            // Fill the delegate reserve
            this.delegate_reserve = this.delegate_reserve.concat(this.rulingParty.delegates);

            // Clean the party
            this.rulingParty.partyLeader = undefined;
            this.rulingParty.delegates = new Array<Player>();
        }
    }

    public getPlayerInfluence(player: Player) {
        let influence: number = 0;
        if (this.chairman !== undefined && this.chairman === player) influence++;
        if (this.dominantParty !== undefined && this.dominantParty.partyLeader === player) influence++;
        if (this.dominantParty !== undefined && this.dominantParty.delegates.indexOf(player) !== -1) influence++;
        if (this.playersInfluenceBonus.has(player.id)) {
            const bonus = this.playersInfluenceBonus.get(player.id);
            if (bonus) {
                influence+= bonus;
            }
        }
        return influence;
    }

    public addInfluenceBonus(player: Player, bonus:number = 1) {
        if (this.playersInfluenceBonus.has(player.id)) {
            let current = this.playersInfluenceBonus.get(player.id);
            if (current) {
                current += bonus;
            }
        }
        else {
            this.playersInfluenceBonus.set(player.id, bonus);
        }
    }

    public canPlay(player: Player, partyName : PartyName): boolean {
        if (this.rulingParty === this.getPartyByName(partyName)) {
            return true;
        }
        
        let party = this.getPartyByName(partyName);
        if (party !== undefined && party.getDelegates(player) >= 2) {
            return true;
        }

        return false;
    }

    // List players present in the reserve
    public getPresentPlayers(): Array<Player | "NEUTRAL"> {
        return Array.from(new Set(this.delegate_reserve));
    }

    // Return number of delegate
    public getDelegates(player: Player | "NEUTRAL"): number {
        let delegates = this.delegate_reserve.filter(p => p === player).length;
        return delegates;
    }

    // Get Victory Points
    public getPlayerVictoryPoints(player: Player): number {
        let victory: number = 0;
        if (this.chairman !== undefined && this.chairman === player) victory++;
        this.parties.forEach(function(party) {
            if (party.partyLeader === player) {
                victory++;
            }
        });
        return victory;
    }

    // Function used to rebuild each objects
    loadFromJSON(d: SerializedTurmoil): Turmoil {
        // Assign each attributes
        let o = Object.assign(this, d);

        this.parties = ALL_PARTIES.map((cf) => new cf.factory());

        if (d.rulingParty) {
            this.rulingParty = this.getPartyByName(d.rulingParty.name);
        }
        if (d.dominantParty) {
            this.dominantParty = this.getPartyByName(d.dominantParty.name);
        }

        this.playersInfluenceBonus = new Map<string, number>(d.playersInfluenceBonus);

        // Rebuild Global Event Dealer
        this.globalEventDealer = new GlobalEventDealer();

        this.globalEventDealer.globalEventsDeck = d.globalEventDealer.globalEventsDeck.map((element: IGlobalEvent)  => {
            return getGlobalEventByName(element.name)!;
        });

        this.globalEventDealer.discardedGlobalEvents = d.globalEventDealer.discardedGlobalEvents.map((element: IGlobalEvent)  => {
            return getGlobalEventByName(element.name)!;
        });

        if (d.distantGlobalEvent) {
            this.distantGlobalEvent = getGlobalEventByName(d.distantGlobalEvent.name);
        }
        if (d.commingGlobalEvent) {
            this.commingGlobalEvent = getGlobalEventByName(d.commingGlobalEvent.name);
        }
        if (d.currentGlobalEvent) {
            this.currentGlobalEvent = getGlobalEventByName(d.currentGlobalEvent.name);
        }

        return o;
    }
}    