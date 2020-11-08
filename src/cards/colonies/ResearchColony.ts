import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { BuildColony } from "../../deferredActions/BuildColony";

export class ResearchColony implements IProjectCard {
    public cost = 20;
    public tags = [Tags.SPACE, Tags.SCIENCE];
    public name = CardName.RESEARCH_COLONY;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        game.defer(new BuildColony(player, game, true, "Select colony for Research Colony"));
        player.cardsInHand.push(
            game.dealer.dealCard(),
            game.dealer.dealCard()
        );
        return undefined;
    }
}
