
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { OrOptions } from "../inputs/OrOptions";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class Sabotage implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.SABOTAGE;

    public play(player: Player, game: Game) {
        if (game.getPlayers().length === 1)  return undefined;
        return new OrOptions(
                new SelectPlayer(game.getPlayers(), "Select player to remove up to 3 titanium", "Remove titanium", (selectedPlayer: Player) => {
                    selectedPlayer.setResource(Resources.TITANIUM, -3, game, player);
                    return undefined;
                }),
                new SelectPlayer(game.getPlayers(), "Select player to remove up to 4 steel", "Remove steel", (selectedPlayer: Player) => {
                    selectedPlayer.setResource(Resources.STEEL, -4, game, player);
                    return undefined;
                }),
                new SelectPlayer(game.getPlayers(), "Select player to remove up to 7 mega credits", "Remove MC", (selectedPlayer: Player) => {
                    selectedPlayer.setResource(Resources.MEGACREDITS, -7, game, player);
                    return undefined;
                })
        );
    }
}

