import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardName } from "../../CardName";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { PartyName } from '../../turmoil/parties/PartyName';
import { SelectSpace } from "../../inputs/SelectSpace";
import { ISpace } from "../../ISpace";


export class WildlifeDome implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.ANIMAL, Tags.PLANT, Tags.STEEL];
    public name: CardName = CardName.WILDLIFE_DOME;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        if (game.turmoil !== undefined) {
            return game.turmoil.canPlay(player, PartyName.GREENS);
        }
        return false;
    }

    public play(player: Player, game: Game) {
        return new SelectSpace("Select space for greenery tile", game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
            return game.addGreenery(player, space.id);
        });
    }
}