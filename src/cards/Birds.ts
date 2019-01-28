
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class Birds implements IActiveProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = "Birds";
    public animals: number = 0;
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Add an animal to this card.";
    public text: string = "Requires 13% oxygen. Decrease any plant production 2 steps. Gain 1 victory point for each animal on this card.";
    public description: string = "Bringing life to the skies.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() < 13) {
            return Promise.reject("Requires 13% oxygen");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectPlayer(this, game.getPlayers(), "Select player to decrease plant production", (foundPlayer: Player) => {
                if (foundPlayer.plantProduction < 2) {
                    reject("Player needs at least 2 plant production");
                    return;
                }
                foundPlayer.plantProduction -= 2;
                game.addGameEndListener(() => {
                    player.victoryPoints += this.animals;
                });
                resolve();
            }));
        });
    }
    public action(_player: Player, _game: Game): Promise<void> {
        this.animals++;
        return Promise.resolve();
    }
}
