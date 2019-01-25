
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class RadChemFactory implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Rad-chem Factory";
    public text: string = "Decrease your energy production 1 step. Raise your terraform rating 2 steps.";
    public description: string = "Certain aromatic compounds can absorb dangerous radiation without breaking.";
    public play(player: Player, _game: Game): Promise<void> {
        if (player.energyProduction < 1) {
            return Promise.reject("Must have energy production");
        }
        player.energyProduction--;
        player.terraformRating += 2;
        return Promise.resolve();
    }
}
