import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';

export class SisterPlanetSupport implements IProjectCard {
    public cost = 7;
    public tags = [Tags.VENUS, Tags.EARTH];
    public name = CardName.SISTER_PLANET_SUPPORT;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
      return player.checkMultipleTagPresence([Tags.VENUS, Tags.EARTH]);
    }
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 3);
      return undefined;
    }
}
