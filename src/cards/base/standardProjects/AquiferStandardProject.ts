import {Player} from '../../../Player';
import {CardName} from '../../../CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../../constants';
import {PlaceOceanTile} from '../../../deferredActions/PlaceOceanTile';
import {StandardProjectCard} from '../../StandardProjectCard';
import {PartyHooks} from '../../../turmoil/parties/PartyHooks';
import {PartyName} from '../../../turmoil/parties/PartyName';

export class AquiferStandardProject extends StandardProjectCard {
  constructor() {
    super({
      name: CardName.AQUIFER_STANDARD_PROJECT,
      cost: 18,
      metadata: {
        cardNumber: 'SP2',
        renderData: CardRenderer.builder((b) =>
          b.standardProject('Spend 18 M€ to place an ocean tile.', (eb) => {
            eb.megacredits(18).startAction.oceans(1);
          })),
      },
    });
  }

  public canAct(player: Player): boolean {
    if (player.game.board.getOceansOnBoard() === MAX_OCEAN_TILES) {
      return false;
    }

    let additionalCost = 0;
    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      additionalCost += REDS_RULING_POLICY_COST;
    }

    return player.canAfford(this.cost + additionalCost);
  }

  actionEssence(player: Player): void {
    player.game.defer(new PlaceOceanTile(player, 'Select space for ocean'));
  }
}
