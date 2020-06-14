
import { CorporationCard } from "../../corporation/CorporationCard";
import { Player } from "../../../Player";
import { Game } from "../../../Game";
import { Tags } from "../../Tags";
import { StandardProjectType } from "../../../StandardProjectType";
import { IProjectCard } from "../../IProjectCard";
import { CardName } from "../../../CardName";

export class CrediCor_ implements CorporationCard {
    public name: CardName = CardName.CREDICOR_;
    public name_ori: CardName = CardName.CREDICOR;
    public tags: Array<Tags> = [];
    public startingMegaCredits: number = 157;
    public requirements: undefined;
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (player.corporationCard !== undefined && player.corporationCard.name === this.name && card.cost >= 20) {
            player.megaCredits += 4;
        }
    }
    public onStandardProject(player: Player, project: StandardProjectType) {
        if (project === StandardProjectType.GREENERY || project === StandardProjectType.CITY) {
            player.megaCredits += 4;
        }
    }
    public play() {
        return undefined;
    }
}
