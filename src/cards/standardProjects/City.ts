import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Game} from '../../Game';
import {StandardProjectCard} from './StandardProjectCard';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {Resources} from '../../Resources';

export class City extends StandardProjectCard {
  public name = CardName.STANDARD_CITY;
  public _cost = 25;

  public canAct(player: Player, game: Game): boolean {
    return player.canAfford(this._cost) && game.board.getAvailableSpacesForCity(player).length > 0;
  }

  actionEssence(player: Player, game: Game): void {
    game.defer(new PlaceCityTile(player, game));
    player.addProduction(Resources.MEGACREDITS);
  }

  public metadata: CardMetadata = {
    cardNumber: '',
    renderData: CardRenderer.builder((b) =>
      b.effectBox((eb) => {
        eb.megacredits(25).startAction.city().productionBox((pb) => {
          pb.megacredits(1);
        });
        eb.description('Action: Spend 25 MC to place a city tile and increase your MC production 1 step.');
      }),
    ),
  };
}
