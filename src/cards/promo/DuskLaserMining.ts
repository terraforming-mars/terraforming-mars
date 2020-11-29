import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class DuskLaserMining implements IProjectCard {
    public name = CardName.DUSK_LASER_MINING;
    public cost = 8;
    public tags = [Tags.SPACE];
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.SCIENCE) >= 2 && player.getProduction(Resources.ENERGY) >= 1;
    }

    public play(player: Player) {
      player.addProduction(Resources.ENERGY, -1);
      player.addProduction(Resources.TITANIUM);
      player.titanium += 4;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'X01',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      description: 'Requires 2 Science tags. Decrease your energy production 1 step, and increase your titanium production 1 step. Gain 4 titanium',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().energy(1).br;
          pb.plus().titanium(1);
        }).titanium(4).digit;
      }),
    }
}
