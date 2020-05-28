import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { Game } from '../../Game';
import { PartyName } from '../../turmoil/parties/PartyName';


export class SponsoredMohole implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.SPONSORED_MOHOLE;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.canPlay(player, PartyName.KELVINISTS);
        }
        return false;
    }

    public play(player: Player) {
        player.setProduction(Resources.HEAT,2);
        return undefined;
    }
}