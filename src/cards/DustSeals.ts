import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";
import { CardMetadata } from "../cards/CardMetadata";
import { CardRequirements } from "../cards/CardRequirements";

export class DustSeals implements IProjectCard {
    public cost = 2;
    public tags = [];
    public cardType = CardType.AUTOMATED;
    public name = CardName.DUST_SEALS;
    public canPlay(player: Player, game: Game): boolean {
        return game.board.getOceansOnBoard() <= 3 + player.getRequirementsBonus(game);
    }
    public play() {
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
    public metadata: CardMetadata = {
        description: "Requires 3 or less ocean tiles.",
        cardNumber: "119",
        requirements: CardRequirements.builder((b) => b.oceans(3).max()),
        victoryPoints: 1,
    };
}
