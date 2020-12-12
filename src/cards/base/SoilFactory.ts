import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SoilFactory implements IProjectCard {
    public cost = 9;
    public tags = [Tags.STEEL];
    public name = CardName.SOIL_FACTORY;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player): boolean {
      return player.getProduction(Resources.ENERGY) >= 1;
    }
    public play(player: Player) {
      player.addProduction(Resources.ENERGY, -1);
      player.addProduction(Resources.PLANTS);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '179',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().energy(1).br;
          pb.plus().plants(1);
        });
      }),
      description: 'Decrease your Energy production 1 step and increase your Plant production 1 step.',
      victoryPoints: 1,
    }
}
