import { IProjectCard } from "./../IProjectCard";
import { Tags } from "./../Tags";
import { CardType } from "./../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";

export class DiversitySupport implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.DIVERSITY_SUPPORT;
    public cardType: CardType = CardType.EVENT;

    public canPlay(player: Player) {
        const count = this.getStandardResourceCount(player) + this.getNonStandardResourceCount(player);
        return count >= 9;
    }

    public play(player: Player, game: Game) {
        player.increaseTerraformRating(game);
        return undefined;
    }

    private getStandardResourceCount(player: Player) {
        const standardResources = [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT];
        return standardResources.map((res) => player.getResource(res)).filter((count) => count > 0).length;
    }

    private getNonStandardResourceCount(player: Player) {
        const cardsWithResources = player.getCardsWithResources();
        return cardsWithResources.map((card) => card.resourceType).filter((v, i, a) => a.indexOf(v) === i).length;
    }
}
