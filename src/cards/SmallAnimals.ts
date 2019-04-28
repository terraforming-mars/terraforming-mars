
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class SmallAnimals implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = "Small Animals";
    public cardType: CardType = CardType.ACTIVE;
    public animals: number = 0;
    public actionText: string = "Add 1 animal to this card";
    public text: string = "Requires 6% oxygen. Decrease any plant production 1 step. Gain 1 victory point per 2 animals on this card.";
    public description: string = "Able to live in sparse conditions.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 6 - player.requirementsBonus && this.getAvailablePlayers(player, game).length > 0;
    }
    private getAvailablePlayers(_player: Player, game: Game): Array<Player> {
        return game.getPlayers().filter((player) => player.plantProduction > 0);
    }
    public play(player: Player, game: Game) {
        const availablePlayers = this.getAvailablePlayers(player, game);
        if (availablePlayers.length === 0) {
            throw "No players with plant production";
        }
        return new SelectPlayer(this.name, availablePlayers, "Select player to decrease plant production", (foundPlayer: Player) => {
            foundPlayer.plantProduction--;
            game.addGameEndListener(() => {
                player.victoryPoints += Math.floor(this.animals / 2);
            });
            return undefined;
        });
    }
    public action(_player: Player, _game: Game) {
        this.animals++;
        return undefined;
    }
}
