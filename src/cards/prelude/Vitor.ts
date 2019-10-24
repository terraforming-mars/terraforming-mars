
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Game } from "../../Game";
import { Award } from "../../Award";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";

export class Vitor implements CorporationCard {
    public name: string = "Vitor";
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 45;
    public text: string = "You start with 45 MC. As your first action, fund an award for free. Effect: When you play a card with a NON-NEGATIVE VP icon, including this, gain 3MC";
    public description: string = "A corporation grown from crowd funding of new innovations. Always inclined to initiate projects to gain public support as well as innovation prizes";

    public initialAction(player: Player, game: Game) {
        return new OrOptions(
            new SelectOption("Fund landlord award", () => {
                game.fundAward(player, Award.LANDLORD);
                return undefined;
            }),
            new SelectOption("Fund banker award", () => {
                game.fundAward(player, Award.BANKER);
                return undefined;
            }),
            new SelectOption("Fund scientist award", () => {
                game.fundAward(player, Award.SCIENTIST);
                return undefined;
            }),
            new SelectOption("Fund thermalist award", () => {
                game.fundAward(player, Award.THERMALIST);
                return undefined;
            }),
            new SelectOption("Fund miner award", () => {
                game.fundAward(player, Award.MINER);
                return undefined;
            })
        );
    }

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.nonNegativeVPIcon !== undefined && card.nonNegativeVPIcon) {
            player.megaCredits +=3;
        }
    }

    public play() {
        this.startingMegaCredits = 48;
        return undefined;
    }
}
