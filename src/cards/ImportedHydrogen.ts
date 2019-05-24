
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { AndOptions } from "../inputs/AndOptions";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { SelectCard } from "../inputs/SelectCard";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { PlayerInput } from "../PlayerInput";

export class ImportedHydrogen implements IProjectCard {
    public cost: number = 16;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = "Imported Hydrogen";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Gain 3 plants, or add 3 microbes or 2 animals to another card. Place an ocean tile.";
    public description: string = "A light-weight bug expensive crucial element.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game): undefined | PlayerInput {
        return new AndOptions(
            () => {
                return undefined;
            },
            new OrOptions(
                new SelectOption("Gain 3 plants", () => {
                    player.plants += 3;
                    return undefined;
                }),
                new SelectCard("Add 3 microbes to card", game.getOtherMicrobeCards(this), (foundCards: Array<IProjectCard>) => {
                    foundCards[0]!.microbes! += 3;
                    return undefined;
                }),
                new SelectCard("Add 2 animals to card", game.getOtherAnimalCards(this), (foundCards: Array<IProjectCard>) => {
                    foundCards[0]!.animals! += 2;
                    return undefined;
                })
            ),
            new SelectSpace("Select space for ocean tile", game.getAvailableSpacesForOcean(player), (foundSpace: ISpace) => {
                game.addOceanTile(player, foundSpace.id);
                return undefined;
            })
        );
    }
}
