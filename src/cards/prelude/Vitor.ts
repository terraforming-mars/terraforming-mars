
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { CorporationCard } from "./../corporation/CorporationCard";
import { IProjectCard } from "../IProjectCard";
import { Game } from "../../Game";
import { OrOptions } from "../../inputs/OrOptions";
import { SelectOption } from "../../inputs/SelectOption";
import { IAward } from "../../awards/IAward";
import { CardName } from "../../CardName";

export class Vitor implements CorporationCard {
    public name: CardName = CardName.VITOR;
    public tags: Array<Tags> = [Tags.EARTH];
    public startingMegaCredits: number = 48; // It's 45 + 3 when this corp is played

    private selectAwardToFund(player: Player, game: Game, award: IAward): SelectOption {
        return new SelectOption("Fund " + award.name + " award", "Confirm", () => {
            game.fundAward(player, award);
            return undefined;
        });
    }

    public initialAction(player: Player, game: Game) {
        // Awards are disabled for 1 player games
        if (game.isSoloMode()) {
            return;
        }
        const freeAward = new OrOptions();
        freeAward.title = "Select award to fund";
        freeAward.buttonLabel = "Confirm";
        freeAward.options = game.awards.map((award) => this.selectAwardToFund(player, game, award));
        return freeAward;
    }

    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
        if (player.corporationCard !== undefined && player.corporationCard.name === this.name && card.getVictoryPoints !== undefined && card.getVictoryPoints(player, game) >= 0 ) {
            player.megaCredits += 3;
        }
    }
    
    public play(_player: Player) {
        return undefined;
    }
}
