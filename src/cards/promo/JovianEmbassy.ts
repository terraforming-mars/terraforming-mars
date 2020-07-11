import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import { CardName } from '../../CardName';

export class JovianEmbassy implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.STEEL];
    public name: CardName = CardName.JOVIAN_EMBASSY;
    public cardType: CardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      player.increaseTerraformRating(game);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
