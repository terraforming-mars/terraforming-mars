import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {BuildColony} from '../../deferredActions/BuildColony';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';

export class IceMoonColony implements IProjectCard {
    public cost = 23;
    public tags = [Tags.SPACE];
    public name = CardName.ICE_MOON_COLONY;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;
      const hasAvailableColonyTile = player.hasAvailableColonyTileToBuildOn(game);
      const canPayForReds = player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, true);

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
        return hasAvailableColonyTile && canPayForReds;
      }

      return hasAvailableColonyTile;
    }

    public play(player: Player, game: Game) {
      game.defer(new BuildColony(player, game, false, 'Select colony for Ice Moon Colony'));
      game.defer(new PlaceOceanTile(player, game, 'Select ocean for Ice Moon Colony'));
      return undefined;
    }
}
