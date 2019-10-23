
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { OrOptions } from "../inputs/OrOptions";
import { PlayerInput } from "../PlayerInput";

export class Virus implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "Virus";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Remove up to 2 animals or 5 plants from any player.";
    public description: string = "The virus is transient, changing from liquid to air-borne to blood transfusion.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game): PlayerInput | undefined {
        if (game.getPlayers().length == 1)  return undefined;
        const cards = game.getPlayedCardsWithAnimals();
        const remove5Plants = () => {
            return new SelectPlayer(game.getPlayers(), "Select player to remove 5 plants from", (foundPlayer: Player) => {
                foundPlayer.removePlants(player, 5);
                return undefined;
            });
        };
        if (cards.length === 0) {
            return remove5Plants();
        }
        return new OrOptions(
            new SelectCard("Select card to remove 2 animals from", cards, (foundCard: Array<IProjectCard>) => {
                game.getCardPlayer(foundCard[0].name).removeAnimals(player, foundCard[0], 2);
                return undefined;
            }),
            remove5Plants()
        );
    }
}
