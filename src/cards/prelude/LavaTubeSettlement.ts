import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { LavaFlows } from "../LavaFlows";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { BoardName } from "../../BoardName";
import { PlaceCityTile } from "../../deferredActions/PlaceCityTile";

export class LavaTubeSettlement implements IProjectCard {
    public cost = 15;
    public tags = [Tags.STEEL, Tags.CITY];
    public name = CardName.LAVA_TUBE_SETTLEMENT;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    private getSpacesForCity(player: Player, game: Game) {
        if (game.gameOptions.boardName === BoardName.HELLAS) {
            // https://boardgamegeek.com/thread/1953628/article/29627211#29627211
            return game.board.getAvailableSpacesForCity(player);
        }
        
        return LavaFlows.getVolcanicSpaces(player, game);
    }

    public canPlay(player: Player, game: Game): boolean {
        return this.getSpacesForCity(player, game).length > 0 && player.getProduction(Resources.ENERGY) >= 1;
    }

    public play(player: Player, game: Game) {
        player.addProduction(Resources.MEGACREDITS,2);
        player.addProduction(Resources.ENERGY,-1);
        game.defer(new PlaceCityTile(
            player,
            game,
            "Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons",
            this.getSpacesForCity(player, game)
        ));
        return undefined;
    }
}
