
import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { IProjectCard } from "../IProjectCard";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardType } from "../CardType";

export class InterplanetaryCinematics implements CorporationCard {
    public name: string = "Interplanetary Cinematics";
    public tags: Array<Tags> = [Tags.STEEL];
    public startingMegaCredits: number = 30;
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (player.corporationCard !== undefined && player.corporationCard.name === this.name && card.cardType === CardType.EVENT) {
            player.megaCredits += 2;
        }
    }
    public play(player: Player) {
        player.steel = 20;
        return undefined;
    }
}
