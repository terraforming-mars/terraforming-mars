import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class VenusGovernor implements IProjectCard {
    public cost = 4;
    public tags = [Tags.VENUS, Tags.VENUS];
    public name = CardName.VENUS_GOVERNOR;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.VENUS) >= 2;
    }
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '255',
      requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS, 2)),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(2));
      }),
      description: 'Requires 2 Venus tags. Increase your MC production 2 steps.',
    }
}
