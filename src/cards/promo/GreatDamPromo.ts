
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { Player } from "../../Player";
import { Game } from "../../Game";
import { CardType } from "../CardType";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';
import { SelectSpace } from "../../inputs/SelectSpace";
import { TileType } from "../../TileType";
import { ISpace } from "../../ISpace";

export class GreatDamPromo implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.GREAT_DAM_PROMO;
    public canPlay(player: Player, game: Game): boolean {
        return game.board.getOceansOnBoard() >= 4 - player.getRequirementsBonus(game);
    }
    public play(player: Player, game: Game) {
        player.setProduction(Resources.ENERGY,2);

        const availableSpaces = game.board.getAvailableSpacesOnLand(player);
        if (availableSpaces.length < 1) return undefined;

        return new SelectSpace("Select space for tile", availableSpaces, (foundSpace: ISpace) => {
            game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.GREAT_DAM });
            return undefined;
        });
    }
    public getVictoryPoints() {
        return 1;
    }
}

