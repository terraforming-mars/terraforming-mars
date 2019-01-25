
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";

export class SmallAnimals implements IActiveProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [Tags.ANIMAL];
    public name: string = "Small Animals";
    public cardType: CardType = CardType.ACTIVE;
    public animals: number = 0;
    public actionText: string = "Add 1 animal to this card";
    public text: string = "Requires 6% oxygen. Decrease any plant production 1 step. Gain 1 victory point per 2 animals on this card.";
    public description: string = "Able to live in sparse conditions.";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() < 6) {
            return Promise.reject("Requires 6% oxygen.");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectPlayer(this), (playerId: string) => {
                const foundPlayer = game.getPlayerById(playerId);
                if (foundPlayer === undefined) {
                    reject("Player not found");
                    return;
                }
                foundPlayer.plantProduction--;
                game.addGameEndListener(() => {
                    player.victoryPoints += Math.floor(this.animals / 2);
                });
                resolve();
            });
        });
    }
    public action(_player: Player, _game: Game): Promise<void> {
        this.animals++;
        return Promise.resolve();
    }
}
