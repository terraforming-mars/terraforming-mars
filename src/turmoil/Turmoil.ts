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

// Function to return a party by name
export function getPartyByName(partyName: string): IParty | undefined {
    let partyFactory = ALL_PARTIES.find((partyFactory) => partyFactory.partyName === partyName);
    if (partyFactory !== undefined) {
        return new partyFactory.factory();
    }
    return undefined;
}

export class Turmoil {
    public chairman: undefined | Player = undefined;
    public dominantParty: undefined | IParty = undefined;
    public lobby: Set<Player> = new Set<Player>();
    public parties: Array<IParty> = [];

    constructor() {
        this.parties = ALL_PARTIES.map((cf) => new cf.factory());
    }

    // Use to send a delegate to a specific party
    public sendDelegateToParty(player: Player, partyName: PartyName, ): void {
        const party = getPartyByName(partyName);
        party.sendDelegate(player);
        this.checkDominantParty(party);
    }

    // Check dominant party
    public checkDominantParty(party:IParty = undefined): void {
        // If a new delegate is sent
        if (party) {
            if (party.delegates.length > this.dominantParty.delegates.length) {
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
        // 3.a - Ruling Policy change
        // TODO

        // 3.b - Resolve Ruling Bonus
        this.dominantParty.rulingBonus(game);

        // 3.c - Change the chairman
        this.chairman = this.dominantParty.partyLeader;
        this.chairman.terraformRating += 1;

        // 3.d - Clean the dominantParty 
        this.dominantParty.becomesRulingParty();

        // 3.e - New dominant party
        this.checkDominantParty();

        // 3.f - Fill the lobby
        this.lobby = new Set<Player>(game.getPlayers());

        // 4 - Changing Time
        // TODO
    }
}    