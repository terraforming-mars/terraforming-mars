import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { Game } from "../../Game";
import { SelectOption } from "../../inputs/SelectOption";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectAmount } from "../../inputs/SelectAmount";

export class EnergyMarket implements IProjectCard {
    public name: CardName = CardName.ENERGY_MARKET;
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.ENERGY];
    public cardType: CardType = CardType.ACTIVE;

    public play() {
        return undefined;
    }

    public canAct(player: Player): boolean {
        const availableMC = (player.canUseHeatAsMegaCredits) ? player.getResource(Resources.MEGACREDITS) + player.getResource(Resources.HEAT) : player.getResource(Resources.MEGACREDITS);
        return availableMC >= 2 || player.getProduction(Resources.ENERGY) >= 1;
    }

    private getEnergyOption(player: Player, game: Game, availableMC: number): SelectAmount {
        return new SelectAmount("Select amount of energy to gain", (amount: number) => {
            if (player.canUseHeatAsMegaCredits) {
                player.setResource(Resources.ENERGY, amount);
                game.addSelectHowToPayInterrupt(player, (amount * 2), false, false);
            } else {
                player.setResource(Resources.ENERGY, amount);
                player.setResource(Resources.MEGACREDITS, -(amount * 2));
            }
            return undefined;
        }, Math.floor(availableMC / 2));
    }

    private getMegacreditsOption(player: Player) {
        player.setProduction(Resources.ENERGY, -1);
        player.setResource(Resources.MEGACREDITS, 8);
        return undefined;
    }

    public action(player: Player, game: Game) {
        const availableMC = (player.canUseHeatAsMegaCredits) ? player.getResource(Resources.MEGACREDITS) + player.getResource(Resources.HEAT) : player.getResource(Resources.MEGACREDITS);
        if (availableMC >= 2 && player.getProduction(Resources.ENERGY) >= 1) {
            return new OrOptions(
                new SelectOption("Spend 2X MC to gain X energy", () => {
                    return this.getEnergyOption(player, game, availableMC);
                }),
                new SelectOption("Decrease energy production 1 step to gain 8 MC", () => {
                    return this.getMegacreditsOption(player);
                })
            );
        } else if (availableMC >= 2) {
            return this.getEnergyOption(player, game, availableMC);
        } else if (player.getProduction(Resources.ENERGY) >= 1) {
            return this.getMegacreditsOption(player);
        }
        return undefined;
    }
    
}