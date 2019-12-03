
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Game } from "../../Game";
import { ORIGINAL_AWARDS } from "../../awards/Awards";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";

export class Vitor implements CorporationCard {
    public name: string = "Vitor";
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 45;

    public initialAction(player: Player, game: Game) {        
        const freeAward = new OrOptions();
        for (let award of ORIGINAL_AWARDS) {
            freeAward.options.push(
            new SelectOption("Fund "+ award.name +" award", () => {
                game.fundAward.bind(game, player, award);
                return undefined;
            }));
        }
        return freeAward;
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
