import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Board} from '../../boards/Board';

export class InterplanetaryAdvertisingNetwork extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.INTERPLANETARY_ADVERTISING_NETWORK,
      tags: [Tag.EARTH, Tag.CITY],
      cost: 33,
      victoryPoints: 2,
      metadata: {
        cardNumber: 'B09',
        description: 'Increase your TR one step for each City you own on Mars.',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).slash().city();
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    const citiesOnMars = player.game.board.spaces.filter(
      (s) => s.player === player && Board.isCitySpace(s),
    ).length;
    player.increaseTerraformRating(citiesOnMars);
    return undefined;
  }
}
