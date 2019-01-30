
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectSpace } from "../inputs/SelectSpace";
import { SelectAmount } from "../inputs/SelectAmount";
import { AndOptions } from "../inputs/AndOptions";
import { ISpace } from "../ISpace";

export class AquiferPumping implements IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Aquifer Pumping";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "";
    public description: string = "Underground water reservoirs may be tapped in a controlled manner, to safely build up oceans to the desired level";
    public play(_player: Player, _game: Game): Promise<void> {
        return Promise.resolve();
    }
    public actionText: string = "Spend 8 mega credits to place 1 ocean tile. STEEL MAY BE USED as if you were playing a building card.";
    public action(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            let totalPaid: number = 0;
            let steelToUse: number = 0;
            let megaCreditToUse: number = 0;
            let foundSpace: ISpace;
            player.setWaitingFor(
                new AndOptions(
                    () => {
                        if (steelToUse > player.steel) {
                            reject("Not enough steel");
                            return;
                        }
                        totalPaid += steelToUse * 2;
                        if (totalPaid < 8) {
                            if (megaCreditToUse > player.megaCredits) {
                                reject("Not enough mega credits");
                                return;
                            }
                            totalPaid += megaCreditToUse;
                        }
                        if (totalPaid < 8) {
                            reject("Need to pay 8");
                            return;
                        }
                        try { game.addOceanTile(player, foundSpace.id); }
                        catch (err) { reject(err); return; }
                        player.steel -= steelToUse;
                        player.megaCredits -= megaCreditToUse;
                        resolve();
                    },
                    new SelectSpace(this.name, "Select space for ocean tile", (space: ISpace) => {
                        foundSpace = space;
                    }),
                    new SelectAmount(this.name, "Select steel to use", (amount: number) => {
                        steelToUse = amount;
                    }),
                    new SelectAmount(this.name, "Select megacredit to use", (amount: number) => {
                        megaCreditToUse = amount;
                    })
                )
            );
        });
    }
}
