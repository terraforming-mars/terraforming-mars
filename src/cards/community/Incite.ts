import { CorporationCard } from "../corporation/CorporationCard";
import { Player } from "../../Player";
import { Tags } from "../Tags";
import { Game } from "../../Game";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { SendDelegateToArea } from "../../deferredActions/SendDelegateToArea";


export class Incite implements CorporationCard {
    public name: CardName =  CardName.INCITE;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public startingMegaCredits: number = 32;
    public cardType: CardType = CardType.CORPORATION;

    public play(player: Player, game: Game) {
        if (game.turmoil) game.turmoil.addInfluenceBonus(player);
        return undefined;
    }

    public initialAction(player: Player, game: Game) {
        if (game.turmoil) {
            const title = "Incite first action - Select where to send two delegates";
            game.defer(new SendDelegateToArea(player, game, title, 2, undefined, undefined, false));
        }

        return undefined;
    }
}
