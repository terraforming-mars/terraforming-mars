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
import { GlobalEventDealer } from './globalEvents/GlobalEventDealer';
import { IGlobalEvent } from './globalEvents/IGlobalEvent';

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

export class Turmoil {
    public chairman: undefined | Player = undefined;
    public rulingParty: undefined | IParty = undefined;
    public dominantParty: undefined | IParty = undefined;
    public lobby: Set<Player> = new Set<Player>();
    public parties: Array<IParty> = [];
    public globalEventDealer: GlobalEventDealer;
    public distantGlobalEvent: IGlobalEvent | undefined;
    public commingGlobalEvent: IGlobalEvent | undefined;
    public currentGlobalEvent: IGlobalEvent | undefined;

    constructor() {
        this.parties = ALL_PARTIES.map((cf) => new cf.factory());
        this.globalEventDealer = new GlobalEventDealer();
        this.commingGlobalEvent = this.globalEventDealer.draw();
        if (this.commingGlobalEvent !== undefined) {
            this.dominantParty = this.getPartyByName(this.commingGlobalEvent.currentDelegate);
        }
        this.distantGlobalEvent = this.globalEventDealer.draw();
        if (this.distantGlobalEvent !== undefined) {

            if (this.dominantParty === this.getPartyByName(this.distantGlobalEvent.currentDelegate)) {
                this.dominantParty.delegates.push(neutral);
            } else {
                this.getPartyByName(this.distantGlobalEvent.currentDelegate).partyLeader = neutral; 
            }

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
    public sendDelegateToParty(player: Player, partyName: PartyName, ): void {
        const party = this.getPartyByName(partyName);
        if (party) {
            party.sendDelegate(player);
            this.checkDominantParty(party);
        }
        else {
            console.error("Party not found");
        }
    }

    // Check dominant party
    public checkDominantParty(party:IParty | undefined = undefined): void {
        // If a new delegate is sent
        if (party) {
            if (this.dominantParty) {
                if (party.delegates.length > this.dominantParty.delegates.length) {
                    this.dominantParty = party;
                }
            }
            else {
                this.dominantParty = party;
            }
        }
        // If it's the end of generation
        else {
            const parties: Array<IParty> = this.parties;
            parties.sort(
                (p1, p2) => p2.delegates.length - p1.delegates.length
            );
            const max = parties[0].delegates.length;
            
            let left = this.parties.slice(0, this.parties.indexOf(parties[0]) -1);
            const right = this.parties.slice(this.parties.indexOf(parties[0])+1);
            let partiesOrdered = left.concat(right);
            partiesOrdered.reverse().forEach(party => {
                if (party.delegates.length === max) {
                    this.dominantParty = party;
                }
            });   
        }
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
        // TODO

        if (this.rulingParty) {
            // 3.b - Resolve Ruling Bonus
            this.rulingParty.rulingBonus(game);

            // 3.c - Change the chairman
            this.chairman = this.rulingParty.partyLeader;
            if (this.chairman) {
                this.chairman.terraformRating += 1;
            }
            else {
                console.error("No chairman");
            }

            // 3.d - Clean the rulingParty area and leader 
            this.rulingParty.becomesRulingParty();
        }

        // 3.e - New dominant party
        this.checkDominantParty();

        // 3.f - Fill the lobby
        this.lobby = new Set<Player>(game.getPlayers());

        // 4 - Changing Time
        // TODO
    }

    public getPlayerInfluence(player: Player) {
        let influence: number = 0;
        if (this.chairman !== undefined && this.chairman === player) influence++;
        if (this.dominantParty !== undefined && this.dominantParty.partyLeader === player) influence++;
        if (this.dominantParty !== undefined && this.dominantParty.delegates.indexOf(player) !== -1) influence++;
        return influence;
    }
}    