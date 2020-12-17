import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class LunarBeam implements IProjectCard {
    public cost = 13;
    public tags = [Tags.EARTH, Tags.ENERGY];
    public name = CardName.LUNAR_BEAM;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.MEGACREDITS) >= -3;
    }
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, -2);
      player.addProduction(Resources.HEAT, 2);
      player.addProduction(Resources.ENERGY, 2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '030',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().megacredits(2).br;
          pb.plus().heat(2).br;
          pb.plus().energy(2);
        });
      }),
      description: 'Decrease your MC production 2 steps and increase your heat production and Energy production 2 steps each.',
    };
}
