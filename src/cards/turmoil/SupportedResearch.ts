import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { PartyName } from '../../turmoil/parties/PartyName';


export class SupportedResearch implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: CardName = CardName.SUPPORTED_RESEARCH;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.canPlay(player, PartyName.SCIENTISTS);
        }
        return false;
    }

    public play(player: Player, game: Game) {
        for (let i = 0; i < 2; i++) {
            player.cardsInHand.push(game.dealer.dealCard());
        }
        return undefined;
    }
}