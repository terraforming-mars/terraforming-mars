import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { PartyName } from '../../turmoil/parties/PartyName';
import { Resources } from "../../Resources";

export class RedTourismWave implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.EARTH];
    public name: CardName = CardName.RED_TOURISM_WAVE;
    public cardType: CardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.canPlay(player, PartyName.REDS);
        }
        return false;
    }

    public play(player: Player, game: Game) {
        
        let amount = game.board.getEmptySpaces()
            .filter((space) => game.board.getAdjacentSpaces(space).find((adj) => adj.tile !== undefined 
                && adj.player === player) !== undefined).length;
        player.setResource(Resources.MEGACREDITS, amount);
        return undefined;
    }
}