import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';
import { Game } from '../../Game';

export class NitrogenDelivery extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [];
    public name: CardName = CardName.NITROGEN_SHIPMENT;
    public bonusMc: number = 5;

    public play(player: Player, game: Game) {     
        player.megaCredits += this.bonusMc;
        player.increaseTerraformRating(game);
        player.setProduction(Resources.PLANTS);
        return undefined;
    }
}

