import {CardName} from '../../CardName';
import {ShiftAresGlobalParametersDeferred} from '../../deferredActions/ShiftAresGlobalParametersDeferred';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';

export class ButterflyEffect implements IProjectCard {
    public cost = 8;
    public tags = [];
    public cardType = CardType.EVENT;
    public name = CardName.BUTTERFLY_EFFECT;
    public play(player: Player, game: Game) {
      player.increaseTerraformRating(game);
      game.defer(new ShiftAresGlobalParametersDeferred(game, player));
      return undefined;
    }
}
