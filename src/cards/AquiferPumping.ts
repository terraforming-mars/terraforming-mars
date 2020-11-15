import {IActionCard} from './ICard';
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {CardName} from '../CardName';
import {PartyHooks} from '../turmoil/parties/PartyHooks';
import {PartyName} from '../turmoil/parties/PartyName';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../constants';
import {SelectHowToPayDeferred} from '../deferredActions/SelectHowToPayDeferred';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';

export class AquiferPumping implements IActionCard, IProjectCard {
    public cost = 18;
    public tags = [Tags.STEEL];
    public name = CardName.AQUIFER_PUMPING;
    public cardType = CardType.ACTIVE;

    public play() {
      return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
      const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;
      const oceanCost = 8;

      if (oceansMaxed) return player.canAfford(oceanCost, game, true, false);

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(oceanCost + REDS_RULING_POLICY_COST, game, true, false);
      }

      return player.canAfford(oceanCost, game, true, false);
    }
    public action(player: Player, game: Game) {
      game.defer(new SelectHowToPayDeferred(player, 8, true, false, 'Select how to pay for action'));
      game.defer(new PlaceOceanTile(player, game));
      return undefined;
    }
}
