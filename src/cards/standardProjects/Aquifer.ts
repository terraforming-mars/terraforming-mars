import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Game} from '../../Game';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {StandardProjectCard} from './StandardProjectCard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';

export class Aquifer extends StandardProjectCard {
  public name = CardName.STANDARD_AQUIFER;
  public cost = 18;

  public canAct(player: Player, game: Game): boolean {
    if (game.board.getOceansOnBoard() === MAX_OCEAN_TILES) {
      return false;
    }

    let additionalCost = 0;
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      additionalCost += REDS_RULING_POLICY_COST;
    }

    return player.canAfford(this.cost + additionalCost, game);
  }

  actionEssence(player: Player, game: Game): void {
    game.defer(new PlaceOceanTile(player, 'Select space for ocean'));
  }

  public metadata: CardMetadata = {
    cardNumber: 'SP2',
    renderData: CardRenderer.builder((b) =>
      b.standardProject('Spend 18 MC to place an ocean tile.', (eb) => {
        eb.megacredits(18).startAction.oceans(1);
      }),
    ),
  };
}
