import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class CoronaExtractor implements IProjectCard {
    public cost = 10;
    public tags = [Tags.SPACE, Tags.ENERGY];
    public name = CardName.CORONA_EXTRACTOR;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 4;
    }

    public play(player: Player) {
      player.addProduction(Resources.ENERGY, 4);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C06',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 4)),
      description: 'Requires 4 science tags. Increase your energy production 4 steps.',
      renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.energy(4).digit)),
    }
}
