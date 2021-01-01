import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class PermafrostExtraction implements IProjectCard {
    public cardType = CardType.EVENT;
    public tags = [];
    public cost = 8;
    public name = CardName.PERMAFROST_EXTRACTION;

    public canPlay(player: Player, game: Game): boolean {
      const meetsTemperatureRequirements = game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, -8);
      const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST) && meetsTemperatureRequirements;
      }

      return meetsTemperatureRequirements;
    }

    public play(player: Player, game: Game) {
      if (game.board.getOceansOnBoard() === MAX_OCEAN_TILES) {
        return undefined;
      }

      return new SelectSpace('Select space for ocean tile', game.board.getAvailableSpacesForOcean(player), (space: ISpace) => {
        game.addOceanTile(player, space.id);
        return undefined;
      });
    }

    public metadata: CardMetadata = {
      cardNumber: '191',
      requirements: CardRequirements.builder((b) => b.temperature(-8)),
      renderData: CardRenderer.builder((b) => {
        b.oceans(1);
      }),
      description: 'Requires -8 C or warmer. Place 1 ocean tile.',
    }
}
