import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardName } from "../../CardName";

export class IoSulphurResearch implements IProjectCard {
    public cost = 17;
    public tags = [Tags.SCIENCE, Tags.JOVIAN];
    public name = CardName.IO_SULPHUR_RESEARCH;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        if (player.getTagCount(Tags.VENUS) >= 3) {
            player.cardsInHand.push(
                game.dealer.dealCard(),
                game.dealer.dealCard(),
                game.dealer.dealCard()
            );
            return undefined;
        }
        player.cardsInHand.push(game.dealer.dealCard());
        return undefined;
    }
    public getVictoryPoints() {
        return 2;
    }
}