import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {MAX_OCEAN_TILES} from '../../constants';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class PermafrostExtraction extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.PERMAFROST_EXTRACTION,
      cost: 8,
      tr: {oceans: 1},

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

  public play(player: Player) {
    // TODO(kberg): Replace with PlaceOceanTile
    if (player.game.board.getOceansOnBoard() === MAX_OCEAN_TILES) {
      return undefined;
    }

    return new SelectSpace('Select space for ocean tile', player.game.board.getAvailableSpacesForOcean(player), (space: ISpace) => {
      player.game.addOceanTile(player, space.id);
      return undefined;
    });
  }
}
