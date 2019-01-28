
import { Game } from "../Game";
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { AndOptions } from "../inputs/AndOptions";
import { OrOptions } from "../inputs/OrOptions";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { SelectAmount } from "../inputs/SelectAmount";

export class HiredRaiders implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Hired Raiders";
    public text: string = "Steal up to 2 steel, or 3 mega credit from any player.";
    public description: string = "We have a better use for those resources.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, _reject) => {
            let selectedPlayer: Player;
            let stealSteel: number = 0;
            let stealMegaCredits: number = 0;
            player.setWaitingFor(
                new AndOptions(
                    () => {
                        if (stealSteel > 0) {
                            const starting = selectedPlayer.steel;
                            selectedPlayer.steel = Math.max(0, selectedPlayer.steel - 2);
                            player.steel += starting - selectedPlayer.steel;
                        }
                        if (stealMegaCredits > 0) {
                            const starting = selectedPlayer.megaCredits;
                            selectedPlayer.megaCredits = Math.max(0, selectedPlayer.megaCredits - 3);
                            player.megaCredits += starting - selectedPlayer.megaCredits;
                        }
                        resolve();
                    },
                    new SelectPlayer(this, game.getPlayers(), "Select player to steal from", (foundPlayer: Player) => {
                        selectedPlayer = foundPlayer;
                    }),
                    new OrOptions(
                        new SelectAmount(this, "Steal up to 2 steel", (amount: number) => { stealSteel = amount; }),
                        new SelectAmount(this, "Steal up to 3 mega credit", (amount: number) => { stealMegaCredits = amount; })
                    )
                )
            );
        });
    }
}

