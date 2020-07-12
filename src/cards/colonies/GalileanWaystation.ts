import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from '../CardType';
import { Player } from "../../Player";
import { CardName } from '../../CardName';
import { Resources } from "../../Resources";
import { Game } from '../../Game';

export class GalileanWaystation implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: CardName = CardName.GALILEAN_WAYSTATION;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
        let amount = game.getPlayers()
        .map((aplayer) => aplayer.getTagCount(Tags.JOVIAN, false, player.id === aplayer.id))
        .reduce((a, c) => a + c, 0);
        player.setProduction(Resources.MEGACREDITS, amount);
        return undefined;
    }

    public getVictoryPoints() {
        return 1;
    }
}
