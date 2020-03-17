import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { Game } from '../../Game';
import { CardName } from '../../CardName';

export class SulphurExports implements IProjectCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.VENUS, Tags.SPACE];
    public name: string = CardName.SULPHUR_EXPORTS;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        player.setProduction(Resources.MEGACREDITS,player.getTagCount(Tags.VENUS) + 1 );
        game.increaseVenusScaleLevel(player,1);
        return undefined;
    }
}