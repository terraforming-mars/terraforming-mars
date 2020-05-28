
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';

export class TerraformingGanymede implements IProjectCard {
    public cost: number = 33;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: CardName = CardName.TERRAFORMING_GANYMEDE;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        player.increaseTerraformRatingSteps(1 + player.getTagCount(Tags.JOVIAN), game);
        return undefined;
    }
    public getVictoryPoints() {
        return 2;
    }
}
