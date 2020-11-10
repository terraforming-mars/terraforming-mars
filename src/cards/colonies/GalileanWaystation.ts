import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {Game} from '../../Game';

export class GalileanWaystation implements IProjectCard {
    public cost = 15;
    public tags = [Tags.SPACE];
    public name = CardName.GALILEAN_WAYSTATION;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      const amount = game.getPlayers()
          .map((aplayer) => aplayer.getTagCount(Tags.JOVIAN, false, player.id === aplayer.id))
          .reduce((a, c) => a + c, 0);
      player.addProduction(Resources.MEGACREDITS, amount);
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }
}
