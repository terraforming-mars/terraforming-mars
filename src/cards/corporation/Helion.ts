
import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";


export class Helion implements CorporationCard {
    public name: CardName = CardName.HELION;
    public tags: Array<Tags> = [Tags.SPACE];
    public startingMegaCredits: number = 42;
    public cardType: CardType = CardType.CORPORATION;

    public play(player: Player) {
        player.canUseHeatAsMegaCredits = true;
        player.addProduction(Resources.HEAT,3);
        return undefined;
    }
}
