
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
    public text: string = "You start with 20 steel. Each time you play an event, you gain 2 mega credits";
    public description: string = "Finding funding where nations struggles, IC, initiated the colonization of Mars by turning the process into a soap opera infused with plenty of advertising. With the media's attention and a head start in colonization, IC sets out to terraform.";
    public play(player: Player, _game: Game) {
        player.addCardPlayedHandler((card: IProjectCard) => {
            if (card.cardType === CardType.EVENT) {
                player.megaCredits += 2;
            }
        });
        player.steel = 20;
        return undefined;
    }
}
