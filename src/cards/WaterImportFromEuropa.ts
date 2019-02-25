
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { AndOptions } from "../inputs/AndOptions";
import { SelectAmount } from "../inputs/SelectAmount";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { SpaceType } from "../SpaceType";
import { PlayerInput } from "../PlayerInput";

export class WaterImportFromEuropa implements IProjectCard {
    public cost: number = 25;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Water Import From Europa";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Pay 12 mega credit to place an ocean tile. Titanium may be used as if playing a space card";
    public text: string =" Gain 1 victory point for each jovian tag you have";
    public description: string = "With its low gravity, this Jovian ice moon is suitable for mass export of water";
    public play(player: Player, game: Game): PlayerInput | undefined {
        game.addGameEndListener(() => {
            player.victoryPoints += player.getTagCount(Tags.JOVIAN);
        });
        return undefined;
    }
    public action(player: Player, game: Game): PlayerInput | undefined {
        let titanium: number = 0;
        let megaCredit: number = 0;
        let selectedSpace: ISpace;
        return new AndOptions(
                    () => {
                        if ((titanium * player.titaniumValue) + megaCredit < 12) {
                            throw "Not enough value";
                        }
                        game.addOceanTile(player, selectedSpace.id);
                        player.titanium -= titanium;
                        player.megaCredits -= megaCredit;
                        return undefined;
                    },
                    new SelectAmount(this.name, "How much titanium to use?", (amount: number) => {
                        titanium = amount;
                        return undefined;
                    }),
                    new SelectAmount(this.name, "How much mega credit to use?", (amount: number) => {
                        megaCredit = amount;
                        return undefined;
                    }),
                    new SelectSpace(this.name, "Where to place ocean?", game.getSpaces(SpaceType.OCEAN).filter((space) => space.tile === undefined && space.player === undefined), (space: ISpace) => {
                        selectedSpace = space;
                        return undefined;
                    })
                );
    }
}
