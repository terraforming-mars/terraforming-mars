
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { SelectCard } from "../inputs/SelectCard";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { PlayerInput } from "../PlayerInput";
import { ResourceType } from '../ResourceType';

export class ImportedHydrogen implements IProjectCard {
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = "Imported Hydrogen";
    public cardType: CardType = CardType.EVENT;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game): undefined | PlayerInput {

        const addOcean = () => {
            if (game.noOceansAvailable()) return undefined;
            return new SelectSpace(
                "Select space for ocean tile", 
                game.getAvailableSpacesForOcean(player), 
                (foundSpace: ISpace) => {
                    game.addOceanTile(player, foundSpace.id);
                    return undefined;
                }
            )
        }

        return new OrOptions(
            new SelectOption("Gain 3 plants", () => {
                player.plants += 3;
                return addOcean();
            }),
            new SelectCard("Add 3 microbes to card", player.getResourceCards(ResourceType.MICROBE), (foundCards: Array<IProjectCard>) => {
                player.addResourceTo(foundCards[0], 3);
                return addOcean();
            }),
            new SelectCard("Add 2 animals to card", player.getResourceCards(ResourceType.ANIMAL), (foundCards: Array<IProjectCard>) => {
                player.addResourceTo(foundCards[0], 2);
                return addOcean();
            })
        )
    }
}
