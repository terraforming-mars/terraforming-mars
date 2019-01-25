
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";

export class Flooding implements IProjectCard {
    public cardType: CardType = CardType.EVENT;
    public cost: number = 7;
    public name: string = "Flooding";
    public tags: Array<Tags> = [];
    public text: string = "Place an ocean tile. IF THERE ARE TILES ADJACENT TO THIS OCEAN TILE, YOU MAY REMOVE 4 MEGA CREDITS FROM THE OWNER OF ONE OF THOSE TILES";
    public description: string = "Look out for tsunamis";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectASpace"
            }, (spaceId: string) => {
                const space = game.getSpace(spaceId);
                try { game.addOceanTile(player, spaceId); }
                catch (err) { reject(err); return; }
                player.setWaitingFor(undefined); // we are done with the first request
                const adjacentPlayers: Array<Player> = [];
                game.getAdjacentSpaces(space).forEach((space) => {
                    if (space.player) {
                        adjacentPlayers.push(space.player);
                    }
                });
                if (adjacentPlayers.length) {
                    player.setWaitingFor({
                        initiator: "card",
                        card: this,
                        type: "SelectAPlayer",
                        players: adjacentPlayers
                    }, (playerId: string) => {
                        game.getPlayerById(playerId).megaCredits = Math.max(game.getPlayerById(playerId).megaCredits - 4, 0);
                        player.victoryPoints--;
                        resolve();
                    });
                } else {
                    player.victoryPoints--;
                    resolve();
                }
            });
        });
    }
}
