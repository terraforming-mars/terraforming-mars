import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";
import { OrOptions } from "../inputs/OrOptions";
import { PlayerInput } from "../PlayerInput";
import { CardName } from "../CardName";
import { SelectOption } from "../inputs/SelectOption";
import { ResourceType } from "../ResourceType";
import { ICard } from "./ICard";
import { RemoveAnyPlants } from "../deferredActions/RemoveAnyPlants";

export class Virus implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: CardName = CardName.VIRUS;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;
    public canPlay(): boolean {
        return true;
    }

    private getPossibleTargetCards(player: Player, game: Game): Array<ICard> {
        const result: Array<ICard> = [];
        game.getPlayers().forEach((p) => {
            if (p.hasProtectedHabitats() && player.id !== p.id) return;
            // TODO(kberg): the list of cards that can't have animals removed is now 2.
            // This logic is duplicated in Predators.ts.
            // TODO(kberg): Add test for pets & bioengineering enclosure respect a la Predators.
            result.push(...p.getCardsWithResources().filter(card => card.resourceType === ResourceType.ANIMAL && card.name !== CardName.PETS && card.name !== CardName.BIOENGINEERING_ENCLOSURE));
        });
        return result;
    }

    public play(player: Player, game: Game): PlayerInput | undefined {
        if (game.getPlayers().length === 1)  return undefined;
        const cards = this.getPossibleTargetCards(player, game);
        const playersWithPlants: number = game.getPlayers().filter((p) => 
            ((p.id !== player.id && !p.plantsAreProtected()) 
            || p.id === player.id)
            && p.plants > 0).length;
        const remove5Plants = () => {
            return new SelectOption("Remove up to 5 plants from a player", "Remove plants", () =>
            {
                game.defer(new RemoveAnyPlants(player, game, 5));
                return undefined;
            })
        };

        const removeAnimals = () => {
            return new SelectCard(
                "Select card to remove up to 2 animals from", 
                "Remove animals",
                cards, (foundCard: Array<ICard>) => {
                    game.getCardPlayer(foundCard[0].name).removeResourceFrom(foundCard[0], 2, game, player);
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
            game.defer(new RemoveAnyPlants(player, game, 5));
            return undefined;
        }

        // Another player has cards to remove animals from
        if (cards.length > 0 && playersWithPlants === 0) {
            if (cards.length > 1) {
                return removeAnimals()
            }

            if (cards.length === 1) {
                game.getCardPlayer(cards[0].name).removeResourceFrom(cards[0], 2, game, player);
                return undefined;
            }
            return undefined;
        }

        // Select other animal or plants to remove
        return new OrOptions(removeAnimals(), remove5Plants());
    }
}
