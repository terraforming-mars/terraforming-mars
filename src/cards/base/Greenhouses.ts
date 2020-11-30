
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {LogHelper} from '../../components/LogHelper';
import {Resources} from '../../Resources';

export class Greenhouses implements IProjectCard {
    public cost = 6;
    public tags = [Tags.PLANT, Tags.STEEL];
    public name = CardName.GREENHOUSES;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      const qty = game.getCitiesInPlay();
      player.plants += qty;
      LogHelper.logGainStandardResource(game, player, Resources.PLANTS, qty);
      return undefined;
    }
}
