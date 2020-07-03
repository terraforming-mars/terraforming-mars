import { Player, PlayerId } from "../../Player";
import { Game } from '../../Game';

export abstract class Party  {
    public partyLeader: undefined | PlayerId | "NEUTRAL" = undefined;
    public delegates: Array<PlayerId|"NEUTRAL"> = [];

    // Send a delegate in the area
    public sendDelegate(playerId: PlayerId | "NEUTRAL", game: Game): void {
        this.delegates.push(playerId);
        this.checkPartyLeader(playerId, game);
    }

    // Remove a delegate from the area
    public removeDelegate(playerId: PlayerId | "NEUTRAL", game: Game): void {
        this.delegates.splice(this.delegates.indexOf(playerId),1);
        this.checkPartyLeader(playerId, game);
    }

    // Check if you are the new party leader 
    public checkPartyLeader(newPlayer: PlayerId | "NEUTRAL", game: Game): void {
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
                        currentIndex = game.getPlayers().indexOf(game.getPlayerById(game.activePlayer));
                    }
                    else {
                        currentIndex = game.getPlayers().indexOf(game.getPlayerById(this.partyLeader));
                    }
            
                    let playersToCheck = new Array<Player | "NEUTRAL">();

                    // Manage if it's the first player or the last
                    if (game.getPlayers().length === 1 || currentIndex === 0) {
                        playersToCheck = game.getPlayers();
                    }
                    else if (currentIndex === game.getPlayers().length - 1) {
                        playersToCheck = game.getPlayers().slice(0, currentIndex);
                        playersToCheck.unshift(game.getPlayers()[currentIndex]);
                    }
                    else {
                        let left = game.getPlayers().slice(0, currentIndex);
                        const right = game.getPlayers().slice(currentIndex);
                        playersToCheck = right.concat(left);
                    }

                    // Add NEUTRAL in the list
                    playersToCheck.push("NEUTRAL");
                    
                    playersToCheck.some(nextPlayer => {
                        let nextPlayerId = "";
                        if (nextPlayer === "NEUTRAL") {
                          nextPlayerId = "NEUTRAL";
                        } else {
                          nextPlayerId = nextPlayer.id;
                        }
                        if (this.getDelegates(nextPlayerId) === max) {
                            this.partyLeader = nextPlayerId;
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
    public getPresentPlayers(): Array<PlayerId | "NEUTRAL"> {
        return Array.from(new Set(this.delegates));
    }

    // Return number of delegate
    public getDelegates(player: PlayerId | "NEUTRAL"): number {
        let delegates = this.delegates.filter(p => p === player).length;
        return delegates;
    }
}    