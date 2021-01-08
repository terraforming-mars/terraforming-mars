import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

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
    public metadata: CardMetadata = {
      cardNumber: '244',
      requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS).tag(Tags.EARTH)),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(3));
      }),
      description: 'Requires Venus and Earth tags. Increase your MC production 3 steps.',
    }
}
