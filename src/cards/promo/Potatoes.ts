import { IProjectCard } from "./../IProjectCard";
import { Tags } from "./../Tags";
import { CardType } from "./../CardType";
import { Player } from "../../Player";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class Potatoes implements IProjectCard {
    public cost: number = 2;
    public tags: Array<Tags> = [Tags.PLANT];
    public name: CardName = CardName.POTATOES;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
        const viralEnhancers = player.playedCards.find((card) => card.name === CardName.VIRAL_ENHANCERS);
        const hasEnoughPlants = player.plants >= 2 || player.plants >= 1 && viralEnhancers !== undefined;

        return hasEnoughPlants;
    }

    public play(player: Player) {
        player.plants -= 2;
        player.setProduction(Resources.MEGACREDITS,2);
        return undefined;
    }
}
