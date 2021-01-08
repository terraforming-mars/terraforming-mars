import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class TerraformingContract implements IProjectCard {
    public cost = 8;
    public tags = [Tags.EARTH];
    public name = CardName.TERRAFORMING_CONTRACT;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
      return player.getTerraformRating() >= 25;
    }
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 4);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '252',
      requirements: CardRequirements.builder((b) => b.tr(25)),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(4));
      }),
      description: 'Requires that you have at least 25 TR. Increase your MC production 4 steps.',
    }
}
