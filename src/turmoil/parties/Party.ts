import { Player } from '../../Player';
import { Game } from '../../Game';

export abstract class Party  {
    public partyLeader: undefined | Player | "NEUTRAL" = undefined;
    public delegates: Array<Player|"NEUTRAL"> = [];

    // Empty the area after becoming the new ruling party
    public becomesRulingParty(): void {
        this.partyLeader = undefined;
        this.delegates = new Array<Player>();
    }

    // Send a delegate in the area
    public sendDelegate(player: Player | "NEUTRAL", game: Game): void {
        this.delegates.push(player);
        this.checkPartyLeader(player, game);
    }

    // Remove a delegate from the area
    public removeDelegate(player: Player | "NEUTRAL", game: Game): void {
        this.delegates.splice(this.delegates.indexOf(player),1);
        this.checkPartyLeader(player, game);
    }

    // Check if you are the new party leader 
    public checkPartyLeader(newPlayer: Player | "NEUTRAL", game: Game): void {
        // If there is a party leader
        if (this.partyLeader) {
            if (game) {
                let sortedPlayers = [...this.getPresentPlayers()].sort(
                    (p1, p2) => this.getDelegates(p2) - this.getDelegates(p1)
                );
                const max = this.getDelegates(sortedPlayers[0]);

                if (this.getDelegates(this.partyLeader) != max) {
                    let currentIndex = 0;
                    if (this.partyLeader === "NEUTRAL") {
                        currentIndex = game.getPlayers().indexOf(game.activePlayer);
                    }
                    else {
                        currentIndex = game.getPlayers().indexOf(this.partyLeader);
                    }
            
                    let playersToCheck = [];

                    // Manage if it's the first party or the last
                    if (currentIndex === 0) {
                        playersToCheck = game.getPlayers().slice(currentIndex + 1);
                    }
                    else if (currentIndex === game.getPlayers().length - 1) {
                        playersToCheck = game.getPlayers().slice(0, currentIndex);
                    }
                    else {
                        let left = game.getPlayers().slice(0, currentIndex);
                        const right = game.getPlayers().slice(currentIndex + 1);
                        playersToCheck = right.concat(left);
                    }
                    
                    playersToCheck.some(nextPlayer => {
                        if (this.getDelegates(nextPlayer) === max) {
                            this.partyLeader = nextPlayer;
                            return true;
                        }
                        return false;
                    });   
                }
            }
        }
        else {
            this.partyLeader = newPlayer;
        }
    }

    // List players present in this party
    public getPresentPlayers(): Array<Player | "NEUTRAL"> {
        return Array.from(new Set(this.delegates));
    }

    // Return number of delegate
    public getDelegates(player: Player | "NEUTRAL"): number {
        let delegates = this.delegates.filter(p => p === player).length;
        return delegates;
    }
}    