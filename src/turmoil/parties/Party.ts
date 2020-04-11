import { Player } from '../../Player';

export abstract class Party  {
    public partyLeader: undefined | Player = undefined;
    public delegates: Array<Player> = [];

    // Empty the area after becoming the new ruling party
    public becomesRulingParty(): void {
        this.partyLeader = undefined;
        this.delegates = new Array<Player>();
    }

    // Send a delegate in the area
    public sendDelegate(player: Player): void {
        this.delegates.push(player);
        this.checkPartyLeader(player);
    }

    // Check if you are the new party leader 
    public checkPartyLeader(newPlayer: Player): void {
        if(newPlayer != this.partyLeader){
            if (this.delegates.filter((player) => player === newPlayer).length > this.delegates.filter((player) => player === this.partyLeader).length) {
                this.partyLeader = newPlayer;
            }
        }
    }

    // Return number of delegate + partyleader for a player
    public getDelegates(player: Player): number {
        let delegates = this.delegates.filter(p => p === player).length;
        if (this.partyLeader === player) delegates++;
        return delegates;
    }
}    