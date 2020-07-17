import { IProjectCard } from '../IProjectCard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { Game } from '../../Game';
import { Resources } from '../../Resources';

export class SnowAlgae implements IProjectCard {
    public name: CardName = CardName.SNOW_ALGAE;
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.PLANT];
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
        return game.board.getOceansOnBoard() >= 2 - player.getRequirementsBonus(game);
    }

    public play(player: Player) {
        player.setProduction(Resources.PLANTS);
        player.setProduction(Resources.HEAT);
        return undefined;
    }

}
