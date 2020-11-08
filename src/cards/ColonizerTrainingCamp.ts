import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from "../CardName";
import { CardMetadata } from "../cards/CardMetadata";
import { CardRequirements } from "../cards/CardRequirements";

export class ColonizerTrainingCamp implements IProjectCard {
    public cost = 8;
    public tags = [Tags.JOVIAN, Tags.STEEL];
    public name = CardName.COLONIZER_TRAINING_CAMP;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() <= 5 + player.getRequirementsBonus(game);
    }
    public play() {
        return undefined;
    }
    public getVictoryPoints() {
        return 2;
    }
    public metadata: CardMetadata = {
        description: "Oxygen must be 5% or less.",
        cardNumber: "001",
        requirements: CardRequirements.builder((b) => b.oxygen(5).max()),
        victoryPoints: 2,
    };
}
