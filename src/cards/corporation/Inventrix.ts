
import { CorporationCard } from "./CorporationCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from '../../CardName';
import { LogMessageType } from "../../LogMessageType";
import { LogMessageData } from "../../LogMessageData";
import { LogMessageDataType } from "../../LogMessageDataType";

export class Inventrix implements CorporationCard {
    public name: CardName = CardName.INVENTRIX;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public startingMegaCredits: number = 45;
    public initialAction(player: Player, game: Game) {
        player.cardsInHand.push(
            game.dealer.dealCard(),
            game.dealer.dealCard(),
            game.dealer.dealCard()
        );
        
        game.log(
            LogMessageType.DEFAULT,
            "${0} drew 3 cards",
            new LogMessageData(LogMessageDataType.PLAYER, player.id)
        );
        
        return undefined;
    }
    public getRequirementBonus(_player: Player, _game: Game): number {
        return 2;
    }
    public play() {
        return undefined;
    }
}
