
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { AndOptions } from "../inputs/AndOptions";
import { SelectAmount } from "../inputs/SelectAmount";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";

export class WaterImportFromEuropa implements IActiveProjectCard {
    public cost: number = 25;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: string = "Water Import From Europa";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Pay 12 mega credit to place an ocean tile. Titanium may be used as if playing a space card";
    public text: string =" Gain 1 victory point for each jovian tag you have";
    public description: string = "With its low gravity, this Jovian ice moon is suitable for mass export of water";
    public play(player: Player, game: Game): Promise<void> {
        game.addGameEndListener(() => {
            player.victoryPoints += player.getTagCount(Tags.JOVIAN);
        });
        return Promise.resolve();
    }
    public action(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            let titanium: number = 0;
            let megaCredit: number = 0;
            let selectedSpace: ISpace;
            player.setWaitingFor(
                new AndOptions(
                    () => {
                        if ((titanium * player.titaniumValue) + megaCredit < 12) {
                            reject("Not enough value");
                            return;
                        }
                        try { game.addOceanTile(player, selectedSpace.id); }
                        catch (err) { reject(err); return; }
                        player.titanium -= titanium;
                        player.megaCredits -= megaCredit;
                        resolve(); 
                    },
                    new SelectAmount(this.name, "How much titanium to use?", (amount: number) => {
                        titanium = amount;
                    }),
                    new SelectAmount(this.name, "How much mega credit to use?", (amount: number) => {
                        megaCredit = amount;
                    }),
                    new SelectSpace(this.name, "Where to place ocean?", (space: ISpace) => {
                        selectedSpace = space;
                    })
                )
            );
        });
    }
}
