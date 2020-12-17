import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class FuelFactory implements IProjectCard {
  public cost = 6;
  public name = CardName.FUEL_FACTORY;
  public tags = [Tags.STEEL];
  public cardType = CardType.AUTOMATED;
  public hasRequirements = false;
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.TITANIUM);
    player.addProduction(Resources.MEGACREDITS);
    return undefined;
  }
  public metadata: CardMetadata = {
    cardNumber: '180',
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => {
        pb.minus().energy(1).br;
        pb.plus().titanium(1).megacredits(1);
      });
    }),
    description: 'Decrease your Energy production 1 step and increase your titanium and your MC production 1 step each.',
  }
}
