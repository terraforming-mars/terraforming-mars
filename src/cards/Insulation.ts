
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectAmount } from "../inputs/SelectAmount";
import { Resources } from "../Resources";


export class Insulation implements IProjectCard {
    public cost: number = 2;
    public tags: Array<Tags> = [];
    public name: string = "Insulation";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        if (player.getProduction(Resources.HEAT) < 1) return undefined;
        return new SelectAmount("Select amount of heat production to decrease", (amount: number) => {
            player.setProduction(Resources.HEAT, -amount);
            player.setProduction(Resources.MEGACREDITS,amount);
            return undefined;
        }, player.getProduction(Resources.HEAT));
    }
}
