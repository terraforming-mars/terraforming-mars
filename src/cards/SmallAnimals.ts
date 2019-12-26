
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ResourceType } from "../ResourceType";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class SmallAnimals implements IActionCard, IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = "Small Animals";
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.ANIMAL;
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 6 - player.getRequirementsBonus(game) && this.getAvailablePlayers(player, game).length > 0;
    }
    private getAvailablePlayers(_player: Player, game: Game): Array<Player> {
        return game.getPlayers().filter((player) => player.plantProduction > 0);
    }
    public getVictoryPoints(player: Player) {
        return Math.floor(player.getResourcesOnCard(this) / 2);
    }
    public play(player: Player, game: Game) {
        if (game.getPlayers().length == 1) return undefined;
        const availablePlayers = this.getAvailablePlayers(player, game);
        return new SelectPlayer(availablePlayers, "Select player to decrease plant production", (foundPlayer: Player) => {
            foundPlayer.plantProduction--;
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
