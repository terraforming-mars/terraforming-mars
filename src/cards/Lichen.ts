
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class Lichen implements IProjectCard {
    public cost = 7;
    public tags = [Tags.PLANT];
    public name = CardName.LICHEN;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= -24 - (2 * player.getRequirementsBonus(game));
    }
    public play(player: Player) {
        player.addProduction(Resources.PLANTS);
        return undefined;
    }
}

