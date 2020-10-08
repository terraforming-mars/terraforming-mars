
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectAmount } from "../inputs/SelectAmount";
import { Resources } from "../Resources";
import { CardName } from "../CardName";


export class Insulation implements IProjectCard {
    public cost: number = 2;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.INSULATION;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, _game: Game) {
        if (player.getProduction(Resources.HEAT) < 1) return undefined;
        return new SelectAmount("Select amount of heat production to decrease", "Decrease", (amount: number) => {
            player.addProduction(Resources.HEAT, -amount);
            player.addProduction(Resources.MEGACREDITS,amount);
            return undefined;
        }, player.getProduction(Resources.HEAT));
    }
}
