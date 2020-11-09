import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {DrawCards} from '../../deferredActions/DrawCards';

export class SFMemorial implements IProjectCard {
    public cost = 7;
    public tags = [Tags.STEEL];
    public name = CardName.SF_MEMORIAL;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      game.defer(new DrawCards(player, game, 1));
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }
}
