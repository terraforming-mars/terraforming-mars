
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';

export class ReleaseOfInertGases implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.RELEASE_OF_INERT_GASES;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
        player.increaseTerraformRatingSteps(2, game);
        return undefined;
    }
}
