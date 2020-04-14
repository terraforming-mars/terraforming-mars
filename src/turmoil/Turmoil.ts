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
import { GlobalEventDealer } from "./globalEvents/GlobalEventDealer";
import { IGlobalEvent } from "./globalEvents/IGlobalEvent";

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

export class Turmoil  {
    public chairman: undefined | Player | "NEUTRAL" = undefined;
    public rulingParty: undefined | IParty = undefined;
    public dominantParty: undefined | IParty = undefined;
    public lobby: Set<Player> = new Set<Player>();
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
            this.lobby.add(player);
            // Begin with six delegates in the delegate reserve
            for (let i = 0; i < 6; i++) {
                this.delegate_reserve.push(player);   
            }
        });

        // The game begin with Neutral chairman
        this.chairman = "NEUTRAL";
        // Begin with 13 neutral delegates in the reserve
        for (let i = 0; i < 13; i++) {
            this.delegate_reserve.push("NEUTRAL");   
        }

        // Init the global event dealer
        this.globalEventDealer = new GlobalEventDealer();
        this.initGlobalEvent(game);
    }

    public initGlobalEvent(game: Game) {
        // Draw the first global event to setup the game
        this.commingGlobalEvent = this.globalEventDealer.draw();
        if (this.commingGlobalEvent !== undefined) {
            this.sendDelegateToParty("NEUTRAL", this.commingGlobalEvent.currentDelegate, game);
        }
        this.distantGlobalEvent = this.globalEventDealer.draw();
        if (this.distantGlobalEvent !== undefined) {
            this.sendDelegateToParty("NEUTRAL", this.distantGlobalEvent.currentDelegate, game);
        }
    }

    // Function to return a party by name
    public getPartyByName(partyName: PartyName): IParty | undefined {
        const party = this.parties.find((party) => party.name === partyName);
        if (party) {
            return party;
        }
        else {
            return undefined;
        }
    }

    // Use to send a delegate to a specific party
    public sendDelegateToParty(player: Player | "NEUTRAL", partyName: PartyName, game: Game): void {
        const party = this.getPartyByName(partyName);
        if (party) {
            if (player != "NEUTRAL" && this.lobby.has(player)) {
                this.lobby.delete(player);
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
            console.error("Party not found");
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
            console.error("Party not found");
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
            player.terraformRating -= 1;
        });
        
        // 2 - Global Event
        // TODO

        // 3 - New Gouvernment
        this.rulingParty = this.dominantParty;

        // 3.a - Ruling Policy change
        if (this.rulingParty) {
            this.setRulingParty(game);
        }

        // 3.b - New dominant party
        this.setNextPartyAsDominant(this.rulingParty!);

        // 3.c - Fill the lobby
        this.lobby = new Set<Player>(game.getPlayers());

        // 4 - Changing Time
        // TODO
    }

    // Ruling Party changes
    public setRulingParty(game: Game): void {
        if (this.rulingParty) {
            // Resolve Ruling Bonus
            this.rulingParty.rulingBonus(game);

            // Change the chairman
            this.chairman = this.rulingParty.partyLeader;
            if (this.chairman && this.chairman instanceof Player) {
                this.chairman.terraformRating += 1;
            }
            else {
                console.error("No chairman");
            }

            const index = this.rulingParty.delegates.indexOf(this.rulingParty.partyLeader!);
            // Remove the party leader from the delegates array
            this.rulingParty.delegates.slice(index, 1);
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
}    