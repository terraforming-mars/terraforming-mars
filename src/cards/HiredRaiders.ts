import { Game } from "../Game";
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class HiredRaiders implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.HIRED_RAIDERS;

    public play(player: Player, game: Game) {
        if (game.isSoloMode()) {
            return new OrOptions(
                new SelectOption("Steal 2 steel", "Steal steel", () => {
                    player.steel += 2;
                    return undefined;
                }),
                new SelectOption("Steal 3 mega credit", "Steal MC", () => {
                    player.megaCredits += 3;
                    return undefined;
                })
            );
        }

        const availablePlayerTargets = game.getPlayers().filter((p) => p.name !== player.name);
        let availableActions = new OrOptions();

        availablePlayerTargets.forEach((target) => {
            if (target.steel > 0) {
                const amountStolen = Math.min(2, target.steel);
                const optionTitle = "Steal " + amountStolen + " steel from " + target.name

                availableActions.options.push(new SelectOption(optionTitle, "Confirm", () => {
                    player.steel += amountStolen;
                    target.setResource(Resources.STEEL, -2, game, player);
                    return undefined;
                }))
            }

            if (target.megaCredits > 0) {
                const amountStolen = Math.min(3, target.megaCredits);
                const optionTitle = "Steal " + amountStolen + " MC from " + target.name

                availableActions.options.push(new SelectOption(optionTitle, "Confirm", () => {
                    player.megaCredits += amountStolen;
                    target.setResource(Resources.MEGACREDITS, -3, game, player);
                    return undefined;
                }))
            }
        });

        if (availableActions.options.length > 0) return availableActions;
        return undefined;
    }
}

