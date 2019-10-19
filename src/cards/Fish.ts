
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { ResourceType } from "../ResourceType";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { Player } from "../Player";
import { Game } from "../Game";

export class Fish implements IActionCard, IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = "Fish";
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Add 1 animal to this card";
    public text: string = "Requires +2C or warmer. Decrease any plant production 1 step. Gain 1 victory point for each animal on this card.";
    public description: string = "Martian barracudas? Why not!";
    public canPlay(player: Player, game: Game): boolean {
        return game.getTemperature() >= 2 - (player.getRequirementsBonus(game) * 2);
    }
    public onGameEnd(player: Player) {
        player.victoryPoints += player.getResourcesOnCard(this);
    }
    public play(_player: Player, game: Game) {
        if (game.getPlayers().length == 1) return undefined;
        return new SelectPlayer(game.getPlayers(), "Select player to decrease plant production 1 step", (foundPlayer: Player) => {
            foundPlayer.plantProduction = Math.max(0, foundPlayer.plantProduction - 1);
            return undefined;
        });
    }
    public canAct(): boolean {
        return true;
    }
    public action(player: Player) {
        player.addResourceTo(this);
        return undefined;
    }
}
