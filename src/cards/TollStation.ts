
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class TollStation implements IProjectCard {
    public cost = 12;
    public tags = [Tags.SPACE];
    public name = CardName.TOLL_STATION;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        let amount = game.getPlayers()
        .filter((aPlayer) => aPlayer !== player)
        .map((opponent) => opponent.getTagCount(Tags.SPACE, false, false))
        .reduce((a, c) => a + c, 0);
        player.addProduction(Resources.MEGACREDITS, amount);
        return undefined;
    }
}
