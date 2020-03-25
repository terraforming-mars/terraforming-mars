import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class GHGImportFromVenus implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE, Tags.VENUS];
    public name: CardName = CardName.GHG_IMPORT_FROM_VENUS;
    public cardType: CardType = CardType.EVENT;

    public play(player: Player, game: Game) {
        player.setProduction(Resources.HEAT,3);
        game.increaseVenusScaleLevel(player,1);
        return undefined;
    }
}