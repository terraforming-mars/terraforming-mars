import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {StandardProjectCard} from '../../StandardProjectCard';
import {PlaceGreeneryTile} from '../../../deferredActions/PlaceGreeneryTile';

export class GreeneryStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.GREENERY_STANDARD_PROJECT,
      cost: 23,
      tr: {oxygen: 1},
      metadata: {
        cardNumber: 'SP6',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 23 M€ to place a greenery tile and raise oxygen 1 step.', (eb) => {
            eb.megacredits(23).startAction.greenery();
          }),
        ),
      },
    });
  }

  public override canPayWith(player: Player) {
    if (player.isCorporation(CardName.SOYLENT_SEEDLING_SYSTEMS)) {
      return {seeds: true};
    } else {
      return {};
    }
  }

  public canAct(player: Player): boolean {
    if (player.game.board.getAvailableSpacesForGreenery(player).length === 0) return false;
    return super.canAct(player);
  }

  actionEssence(player: Player): void {
    player.game.defer(new PlaceGreeneryTile(player, 'Select space for greenery'));
  }
}
