
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
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game): PlayerInput | undefined {
        if (game.getPlayers().length == 1)  return undefined;
        const cards = game.getPlayedCardsWithAnimals();
        const playersWithPlants = game.getPlayers().filter(
            (p) => p.plants > 0 && p.id != player.id
        )
        const remove5Plants = () => {
            return new SelectPlayer(
                playersWithPlants, 
                "Select player to remove up to 5 plants from", (foundPlayer: Player) => {
                foundPlayer.removePlants(player, 5);
                return undefined;
            });
        };

        const removeAnimals = () => {
            return new SelectCard(
                "Select card to remove up to 2 animals from", 
                cards, (foundCard: Array<IProjectCard>) => {
                game.getCardPlayer(foundCard[0].name).removeAnimals(player, foundCard[0], 2);
                return undefined;
            })
        };

        if (cards.length === 0) {
            if (playersWithPlants.length > 1) {
              return remove5Plants();
            }
            if (playersWithPlants.length === 1) {
                playersWithPlants[0].removePlants(player, 5);
                return undefined;
            }
            return undefined;
        }

        if (playersWithPlants.length === 0) {
            if (cards.length > 1) {
                return removeAnimals()
            }

            if (cards.length === 1) {
                game.getCardPlayer(cards[0].name).removeAnimals(player, cards[0], 2);
                return undefined;
            }
            return undefined;
        }

        return new OrOptions(
            removeAnimals(),
            remove5Plants()
        );
    }
}
