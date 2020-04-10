import { Player } from '../../Player';

export abstract class Party  {
    public partyLeader: undefined | Player = undefined;
    public delegates: Array<Player> = [];

    // Empty the area after becoming the new ruling party
    public becomesRulingParty(): void {
        this.partyLeader = undefined;
        this.delegates = [];
    }

    // Send a delegate in the area
    public sendDelegate(player: Player): void {
        this.delegates.push(player);
        this.checkPartyLeader(player);
    }

    // Check if you are the new party leader 
    public checkPartyLeader(player: Player): void {
        if(player != this.partyLeader){
            if (this.delegates.filter((player) => player === player).length > this.delegates.filter((player) => player === this.partyLeader).length) {
                this.partyLeader = player;
            }
        }
    }
}    