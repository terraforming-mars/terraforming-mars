import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { Resources } from "../Resources";
import { CardName } from "../CardName";

export class ArtificialPhotosynthesis implements IProjectCard {
    public cost = 12;
    public tags = [Tags.SCIENCE];
    public cardType = CardType.AUTOMATED;
    public name = CardName.ARTIFICIAL_PHOTOSYNTHESIS;

    public play(player: Player) {
      return new OrOptions(
          new SelectOption("Increase your energy production 2 steps", "Increase", () => {
            player.addProduction(Resources.ENERGY,2);
            return undefined;
          }),
          new SelectOption("Increase your plant production 1 step", "Increase", () => {
            player.addProduction(Resources.PLANTS);
            return undefined;
          })
      );
    }
}
