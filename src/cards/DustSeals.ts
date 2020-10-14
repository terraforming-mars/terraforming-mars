import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";
import { CardMetadata } from "../cards/CardMetadata";
import { CardRequirements } from "../cards/CardRequirements";
import { CardRequirement } from "../cards/CardRequirement";
import { RequirementType } from "./RequirementType";

export class DustSeals implements IProjectCard {
    public cost: number = 2;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.DUST_SEALS;
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
        cardNumber: 119,
        requirements: new CardRequirements([new CardRequirement(RequirementType.OCEANS, 3, true)]),
        points: 1,
    };
}
