import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {StandardProjectCard} from '../../StandardProjectCard';
import {PlaceCityTile} from '../../../deferredActions/PlaceCityTile';
import {Resources} from '../../../Resources';

export class CityStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.CITY_STANDARD_PROJECT,
      cost: 25,
      metadata: {
        cardNumber: 'SP4',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 25 M€ to place a city tile and increase your M€ production 1 step.', (eb) => {
            eb.megacredits(25).startAction.city().production((pb) => {
              pb.megacredits(1);
            });
          }),
        ),
      },
    });
  }

  public canAct(player: Player): boolean {
    return player.canAfford(this.cost) && player.game.board.getAvailableSpacesForCity(player).length > 0;
  }

  actionEssence(player: Player): void {
    player.game.defer(new PlaceCityTile(player));
    player.addProduction(Resources.MEGACREDITS, 1);
  }
}
