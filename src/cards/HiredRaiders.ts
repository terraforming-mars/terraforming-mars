
import { Game } from "../Game";
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { OrOptions } from "../inputs/OrOptions";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { SelectOption } from "../inputs/SelectOption";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class HiredRaiders implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.HIRED_RAIDERS;

    public play(player: Player, game: Game) {

        if (game.soloMode) {
            return new OrOptions(
                new SelectOption("Steal 2 steel", "Steal steel", () => {
                    player.steel += 2;
                    return undefined;
                }),
                new SelectOption("Steal 3 mega credit", "Steal MC", () => {
                    player.megaCredits += 3;
                    return undefined;
                })
            );
        }

        return new OrOptions(
            new SelectPlayer(game.getPlayers(), "Select player to steal up to 2 steel", "Steal steel", (selectedPlayer: Player) => {
                player.steel += Math.min(2, selectedPlayer.steel);
                selectedPlayer.setResource(Resources.STEEL, -2, game, player);
                return undefined;
            }),
            new SelectPlayer(game.getPlayers(), "Select player to steal up to 3 mega credits", "Steal MC", (selectedPlayer: Player) => {
                player.megaCredits += Math.min(3, selectedPlayer.megaCredits);
                selectedPlayer.setResource(Resources.MEGACREDITS, -3, game, player);
                return undefined;
            })
        );
    }
}

