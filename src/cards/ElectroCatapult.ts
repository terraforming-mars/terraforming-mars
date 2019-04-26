
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class ElectroCatapult implements IProjectCard {
    public cost: number = 17;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Electro Catapult";
    public cardType: CardType = CardType.ACTIVE;
    public actionText: string = "Spend 1 plant or 1 steel to gain 7 mega credit.";
    public text: string = "Oxygen must be 8% or less. Decrease your energy production 1 step. Gain 1 victory point.";
    public description: string = "A 200km long acceleration ramp up the side of Pavonis Mons, hurtling export goods into space.";
    public canPlay(player: Player, game: Game): boolean {
        return player.energyProduction >= 1 && game.getOxygenLevel() <= 8;
    }
    public action(player: Player, _game: Game) {
        return new OrOptions(
            new SelectOption(this.name, "Spend 1 plant", () => {
                if (player.plants < 1) {
                    throw "Need plant to spend";
                }
                player.plants--;
                player.megaCredits += 7;
                return undefined;
            }),
            new SelectOption(this.name, "Spend 1 steel", () => {
                if (player.steel < 1) {
                    throw "Need steel to spend";
                }
                player.steel--;
                player.megaCredits += 7;
                return undefined;
            })
        );
    }
    public play(player: Player, game: Game) {
        if (game.getOxygenLevel() > 8) {
            throw "Oxygen must be 8% or less.";
        }
        if (player.energyProduction < 1) {
            throw "Must have energy production";
        }
        player.energyProduction--;
        player.victoryPoints++;
        return undefined;
    }
}
