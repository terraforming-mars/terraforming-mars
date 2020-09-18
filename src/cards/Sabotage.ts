import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { Resources } from "../Resources";
import { CardName } from "../CardName";
import { SelectOption } from "../inputs/SelectOption";

export class Sabotage implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.SABOTAGE;

    public play(player: Player, game: Game) {
        if (game.isSoloMode()) return undefined;

        const availablePlayerTargets = game.getPlayers().filter((p) => p.name !== player.name);
        let availableActions = new OrOptions();

        availablePlayerTargets.forEach((target) => {
            if (target.titanium > 0) {
                const amountRemoved = Math.min(3, target.titanium);
                const optionTitle = "Remove " + amountRemoved + " titanium from " + target.name

                availableActions.options.push(new SelectOption(optionTitle, "Confirm", () => {
                    target.setResource(Resources.TITANIUM, -3, game, player);
                    return undefined;
                }))
            }

            if (target.steel > 0) {
                const amountRemoved = Math.min(4, target.steel);
                const optionTitle = "Remove " + amountRemoved + " steel from " + target.name

                availableActions.options.push(new SelectOption(optionTitle, "Confirm", () => {
                    target.setResource(Resources.STEEL, -4, game, player);
                    return undefined;
                }))
            }

            if (target.megaCredits > 0) {
                const amountRemoved = Math.min(7, target.megaCredits);
                const optionTitle = "Remove " + amountRemoved + " MC from " + target.name

                availableActions.options.push(new SelectOption(optionTitle, "Confirm", () => {
                    target.setResource(Resources.MEGACREDITS, -7, game, player);
                    return undefined;
                }))
            }
        });
        
        if (availableActions.options.length > 0) return availableActions;
        return undefined;
    }
}

