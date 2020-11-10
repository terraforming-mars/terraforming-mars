import {IProjectCard} from './IProjectCard';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {CardName} from '../CardName';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../constants';
import {PartyHooks} from '../turmoil/parties/PartyHooks';
import {PartyName} from '../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';

export class BlackPolarDust implements IProjectCard {
    public cost = 15;
    public tags = [];
    public name = CardName.BLACK_POLAR_DUST;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      const meetsMcProdRequirement = player.getProduction(Resources.MEGACREDITS) >= -3;
      const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST) && meetsMcProdRequirement;
      }

      return meetsMcProdRequirement;
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.MEGACREDITS, -2);
      player.addProduction(Resources.HEAT, 3);
      game.defer(new PlaceOceanTile(player, game));
      return undefined;
    }
}
