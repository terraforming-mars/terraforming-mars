
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Game } from "../Game";
import { Player } from "../Player";
import { CardName } from "../CardName";

export class SpecialDesign implements IProjectCard {
    public cost = 4;
    public tags = [Tags.SCIENCE];
    public cardType = CardType.EVENT;
    public name = CardName.SPECIAL_DESIGN;

    public getRequirementBonus(player: Player, _game: Game): number {
        if (player.lastCardPlayed !== undefined && player.lastCardPlayed.name === this.name) {
            return 2;
        }
        return 0;
    }
    public play() {
        return undefined;
    }
}
