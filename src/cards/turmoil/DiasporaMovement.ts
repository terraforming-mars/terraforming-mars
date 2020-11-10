import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {PartyName} from '../../turmoil/parties/PartyName';


export class DiasporaMovement implements IProjectCard {
    public cost = 7;
    public tags = [Tags.JOVIAN];
    public name = CardName.DIASPORA_MOVEMENT;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        return game.turmoil.canPlay(player, PartyName.REDS);
      }
      return false;
    }

    public play(player: Player, game: Game) {
      const amount = game.getPlayers()
          .map((aplayer) => aplayer.getTagCount(Tags.JOVIAN, false, false))
          .reduce((a, c) => a + c, 0);
      player.setResource(Resources.MEGACREDITS, amount + 1);
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }
}
