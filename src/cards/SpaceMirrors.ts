
import { Player } from "../Player";
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { Game } from "../Game";

export class SpaceMirrors implements IActionCard, IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.SPACE];
    public name: CardName = CardName.SPACE_MIRRORS;
    public cardType: CardType = CardType.ACTIVE;

    public play() {
        return undefined;
    }
    public canAct(player: Player): boolean {
        return player.canAfford(7);
    }
    public action(player: Player, game: Game) {
        game.addSelectHowToPayInterrupt(player, 7, false, false, "Select how to pay for action");
        player.setProduction(Resources.ENERGY);
        return undefined;
    }
}
