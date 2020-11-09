import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {DrawCards} from '../../deferredActions/DrawCards';

export class MartianSurvey implements IProjectCard {
    public cost = 9;
    public tags = [Tags.SCIENCE];
    public name = CardName.MARTIAN_SURVEY;
    public cardType = CardType.EVENT;

    public canPlay(player: Player, game: Game): boolean {
      return game.getOxygenLevel() <= 4 + player.getRequirementsBonus(game);
    }

    public play(player: Player, game: Game) {
      game.defer(new DrawCards(player, game, 2));
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }
}
