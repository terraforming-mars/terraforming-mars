
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CorporationCard} from './CorporationCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';

export class PhoboLog implements CorporationCard {
    public name = CardName.PHOBOLOG;
    public tags = [Tags.SPACE];
    public startingMegaCredits: number = 23;
    public cardType = CardType.CORPORATION;

    public play(player: Player, _game: Game) {
      player.titanium = 10;
      player.increaseTitaniumValue();
      return undefined;
    }
}
