import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { PartyName } from "../../turmoil/parties/PartyName";
import { Resources } from "../../Resources";

export class ParliamentHall implements IProjectCard {
    public cost = 8;
    public tags = [Tags.STEEL];
    public name = CardName.PARLIAMENT_HALL;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.canPlay(player, PartyName.MARS);
        }
        return false;
    }

    public play(player: Player) {
        let amount = Math.floor((player.getTagCount(Tags.STEEL) + 1) / 3);
        player.addProduction(Resources.MEGACREDITS, amount);
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }
}