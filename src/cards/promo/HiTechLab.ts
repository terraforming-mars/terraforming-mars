import { IProjectCard } from "../IProjectCard";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { Game } from "../../Game";
import { SelectAmount } from "../../inputs/SelectAmount";
import { SelectFromCards } from "../../interrupts/SelectFromCards";

export class HiTechLab implements IProjectCard {

    public name: CardName = CardName.HI_TECH_LAB;
    public cost: number = 17;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;

    public play() {
        return undefined;
    }

    public canAct(player: Player): boolean {
        return player.getResource(Resources.ENERGY) > 0;
    }

    public action(player: Player, game: Game) {
        return new SelectAmount("Select amount of energy to spend", (amount: number) => {
            // 0 amount failsafe
            if (amount === 0 ) {
                return undefined;
            }
            player.setResource(Resources.ENERGY, -amount);
            let cardsDrawn: Array<IProjectCard> = [];
            for (let counter = 0; counter < amount; counter++) {
                cardsDrawn.push(game.dealer.dealCard());
            };
            game.addInterrupt(new SelectFromCards(player, game, "Select card to take into hand", cardsDrawn));
            return undefined;
        }, player.getResource(Resources.ENERGY));
    }

    public getVictoryPoints() {
        return 1;
    }

}