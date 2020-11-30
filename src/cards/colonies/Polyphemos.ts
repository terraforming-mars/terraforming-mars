import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';

export class Polyphemos implements CorporationCard {
    public name = CardName.POLYPHEMOS;
    public tags = [];
    public startingMegaCredits: number = 50;
    public cardType = CardType.CORPORATION;
    public cardCost = 5;


    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 5);
      player.titanium = 5;
      return undefined;
    }
}
