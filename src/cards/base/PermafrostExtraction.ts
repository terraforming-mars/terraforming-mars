import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class PermafrostExtraction extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.PERMAFROST_EXTRACTION,
      cost: 8,

      requirements: CardRequirements.builder((b) => b.temperature(-8)),
      metadata: {
        cardNumber: '191',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1);
        }),
        description: 'Requires -8 C or warmer. Place 1 ocean tile.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const meetsTemperatureRequirements = super.canPlay(player);
    const oceansMaxed = player.game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !oceansMaxed) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST) && meetsTemperatureRequirements;
    }

    return meetsTemperatureRequirements;
  }

  public play(player: Player) {
    if (player.game.board.getOceansOnBoard() === MAX_OCEAN_TILES) {
      return undefined;
    }

    return new SelectSpace('Select space for ocean tile', player.game.board.getAvailableSpacesForOcean(player), (space: ISpace) => {
      player.game.addOceanTile(player, space.id);
      return undefined;
    });
  }
}
