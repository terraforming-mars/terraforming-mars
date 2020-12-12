import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class SpaceHotels implements IProjectCard {
    public cost = 12;
    public tags = [Tags.SPACE, Tags.EARTH];
    public name = CardName.SPACE_HOTELS;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.EARTH) >= 2;
    }

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 4);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'P42',
      requirements: CardRequirements.builder((b) => b.tag(Tags.EARTH, 2)),
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.megacredits(4);
        });
      }),
      description: 'Requires 2 Earth tags. Increase MC production 4 steps.',
    }
}
