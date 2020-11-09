import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';

export class MonsInsurance implements CorporationCard {
    public name = CardName.MONS_INSURANCE;
    public tags = [];
    public startingMegaCredits: number = 48;
    public cardType = CardType.CORPORATION;

    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS, 6);
      for (const player of game.getPlayers()) {
        player.addProduction(Resources.MEGACREDITS, -2);
      }
      game.monsInsuranceOwner = player.id;
      return undefined;
    }
}
