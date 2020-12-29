import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SolarPower implements IProjectCard {
    public cost = 11;
    public tags = [Tags.ENERGY, Tags.BUILDING];
    public cardType = CardType.AUTOMATED;
    public name = CardName.SOLAR_POWER;

    public play(player: Player) {
      player.addProduction(Resources.ENERGY);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: '113',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.energy(1));
      }),
      description: 'Increase your energy production 1 step.',
      victoryPoints: 1,
    }
}
