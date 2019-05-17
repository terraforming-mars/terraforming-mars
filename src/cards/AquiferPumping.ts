
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectHowToPay } from "../inputs/SelectHowToPay";
import { AndOptions } from "../inputs/AndOptions";
import { ISpace } from "../ISpace";
import { HowToPay } from "../inputs/HowToPay";
import { SelectSpace } from "../../src/inputs/SelectSpace";

export class AquiferPumping implements IActionCard, IProjectCard {
    public cost: number = 18;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Aquifer Pumping";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "";
    public description: string = "Underground water reservoirs may be tapped in a controlled manner, to safely build up oceans to the desired level";
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public actionText: string = "Spend 8 mega credits to place 1 ocean tile. STEEL MAY BE USED as if you were playing a building card.";
    public canAct(player: Player): boolean {
        return (player.steelValue * player.steel) + player.megaCredits + (player.canUseHeatAsMegaCredits ? player.heat : 0) >= 8;
    }
    public action(player: Player, game: Game) {
            let howToPay: HowToPay;
            let foundSpace: ISpace;
            return new AndOptions(
                    () => {
                        if ((howToPay.steel * player.steelValue) + howToPay.megaCredits + howToPay.heat < 8) {
                            throw "Need to pay 8";
                        }
                        player.steel -= howToPay.steel;
                        player.heat -= howToPay.heat;
                        player.megaCredits -= howToPay.megaCredits;
                        game.addOceanTile(player, foundSpace.id);
                        return undefined;
                    },
                    new SelectSpace(this.name, "Select space for ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                        foundSpace = space;
                        return undefined;
                    }),
                    new SelectHowToPay("Select how to pay", this.name, true, false, player.canUseHeatAsMegaCredits, (htp: HowToPay) => {
                        howToPay = htp;
                        return undefined;
                    })
                );
    }
}
