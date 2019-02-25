
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
    public play(player: Player, game: Game) {
        if (game.getOxygenLevel() < 6) {
            throw "Requires 6% oxygen.";
        }
        return new SelectPlayer(this.name, game.getPlayers(), "Select player to decrease plant production", (foundPlayer: Player) => {
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
