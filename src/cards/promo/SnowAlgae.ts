import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { Resources } from "../../Resources";

export class SnowAlgae implements IProjectCard {
    public name = CardName.SNOW_ALGAE;
    public cost = 12;
    public tags = [Tags.PLANT];
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        return game.board.getOceansOnBoard() >= 2 - player.getRequirementsBonus(game);
    }

    public play(player: Player) {
        player.addProduction(Resources.PLANTS);
        player.addProduction(Resources.HEAT);
        return undefined;
    }

}
