
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";
import { OrOptions } from "../inputs/OrOptions";
import { PlayerInput } from "../PlayerInput";
import { CardName } from '../CardName';
import { Resources } from '../Resources';
import { SelectOption } from '../inputs/SelectOption';

export class Virus implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: CardName = CardName.VIRUS;
    public cardType: CardType = CardType.EVENT;

    private getPossibleTargetCards(player: Player, game: Game): Array<IProjectCard> {
        return game.getPlayedCardsWithAnimals().filter((card) => {
            const owner = game.getCardPlayer(card.name);
            if (player.id === owner.id || owner.hasProtectedHabitats()) return false;
            if (owner.getResourcesOnCard(card) < 1) return false;
            if (this.name === card.name) return false;
            if (card.name === CardName.PETS) return false;
            return true;
        });
    }

    public play(player: Player, game: Game): PlayerInput | undefined {
        if (game.getPlayers().length === 1)  return undefined;
        const cards = this.getPossibleTargetCards(player, game);
        const playersWithPlants: number = game.getPlayers().filter((p) => p.id !== player.id && !p.hasProtectedHabitats() && p.plants > 0).length;
        const remove5Plants = () => {
            return new SelectOption("Remove up to 5 plants from a player", () =>
            {
                game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 5);
                return undefined;
            })
        };

        const removeAnimals = () => {
            return new SelectCard(
                "Select card to remove up to 2 animals from", 
                cards, (foundCard: Array<IProjectCard>) => {
                    game.getCardPlayer(foundCard[0].name).removeAnimals(player, foundCard[0], 2, game);
                    return undefined;
                }
            );
        };

        // If no other player has resources to remove
        // assume player will remove nothing from themselves
        if (cards.length === 0 && playersWithPlants === 0) {
            return undefined;
        }

        // Another player has plants to remove
        if (cards.length === 0 && playersWithPlants > 0) {
            game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 5);
            return undefined;
        }

        // Another player has cards to remove animals from
        if (cards.length > 0 && playersWithPlants === 0) {
            if (cards.length > 1) {
                return removeAnimals()
            }

            if (cards.length === 1) {
                game.getCardPlayer(cards[0].name).removeAnimals(player, cards[0], 2, game);
                return undefined;
            }
            return undefined;
        }

        // Select other animal or plants to remove
        return new OrOptions(removeAnimals(), remove5Plants());
    }
}
