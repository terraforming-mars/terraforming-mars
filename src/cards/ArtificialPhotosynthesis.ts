
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class ArtificialPhotosynthesis implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Artficial Photosynthesis";
    public text: string = "Increase your plant production 1 step or your energy production 2 steps.";
    public description: string = "Artificial photosynthesis was achieved chemically by prof Akermark et. al. in 2021. Its application to terraforming remains to be seen.";
    public play(player: Player, _game: Game): Promise<void> {
        return new Promise((resolve, _reject) => {
            player.setWaitingFor(
                new OrOptions(
                    new SelectOption(this, "Increase your plant production 1 step", () => {
                        player.plantProduction++;
                        resolve();
                    }),
                    new SelectOption(this, "Increase your energy production 2 steps", () => {
                        player.energyProduction += 2;
                        resolve();
                    })
                )
            );
        });
    }
}
