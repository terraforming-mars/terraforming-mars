
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from "../ResourceType";

export class Decomposers implements IProjectCard {
    public cost: number = 5;
    public nonNegativeVPIcon: boolean = true;
    public resourceType: ResourceType = ResourceType.MICROBE;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Decomposers";
    public text: string = "Requires 3% oxygen. When you play an animal, plant, or microbe tag, including this, add a microbe to this card. 1 VP per 3 microbes on this card.";
    public requirements: string = "3% Oxygen";
    public description: string = "Decomposing dead organisms is essential to making sustainable soil.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 3 - player.getRequirementsBonus(game);
    }
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
        if (card.tags.indexOf(Tags.ANIMAL) !== -1 || card.tags.indexOf(Tags.MICROBES) !== -1 || card.tags.indexOf(Tags.PLANT) !== -1) {
            player.addResourceTo(this);
        }
    }
    public onGameEnd(player: Player) {
        player.victoryPoints += Math.floor(player.getResourcesOnCard(this) / 3);
    }
    public play() {
        return undefined;
    }
}

