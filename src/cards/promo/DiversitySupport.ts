
import { IProjectCard } from "./../IProjectCard";
import { Tags } from "./../Tags";
import { CardType } from "./../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from '../../CardName';

export class DiversitySupport implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.DIVERSITY_SUPPORT;
    public cardType: CardType = CardType.EVENT;

    public canPlay(player: Player) {
        const cardsWithResources = player.getCardsWithResources();
        const resourceCount = cardsWithResources.map((card) => card.resourceCount!).reduce((c1, c2) => c1 + c2, 0);
        return resourceCount >= 9;
    }

    public play(player: Player, game: Game) {
        player.increaseTerraformRating(game);
        return undefined;
    }
}
