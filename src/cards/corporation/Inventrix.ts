import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from "../../CardName";
import { LogHelper } from "../../components/LogHelper";
import { CardType } from "../CardType";

export class Inventrix implements CorporationCard {
    public name = CardName.INVENTRIX;
    public tags = [Tags.SCIENCE];
    public startingMegaCredits: number = 45;
    public cardType = CardType.CORPORATION;

    public initialActionText: string = "Draw 3 cards";
    public initialAction(player: Player, game: Game) {
        player.cardsInHand.push(
            game.dealer.dealCard(),
            game.dealer.dealCard(),
            game.dealer.dealCard()
        );
        
        LogHelper.logCardChange(game, player, "drew", 3);
        
        return undefined;
    }
    public getRequirementBonus(_player: Player, _game: Game): number {
        return 2;
    }
    public play() {
        return undefined;
    }
}
