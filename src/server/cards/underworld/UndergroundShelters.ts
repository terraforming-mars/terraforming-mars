import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {IPlayer} from '../../IPlayer';
import {sum} from '../../../common/utils/utils';

export class UndergroundShelters extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.UNDERGROUND_SHELTERS,
      cost: 14,
      tags: [Tag.MARS, Tag.BUILDING],
      victoryPoints: 'special',

      behavior: {
        underworld: {excavate: 1},
      },

      metadata: {
        cardNumber: 'U72',
        // TODO(kberg): Custom VP icon.
        victoryPoints: CardRenderDynamicVictoryPoints.questionmark(1, 3),
        renderData: CardRenderer.builder((b) => {
          b.excavate(1);
        }),
        description: 'Excavate an underground resource. At the end of the game, your cities score 1 VP per 3 excavation markers YOU have in that city space and adjacent spaces.',
      },
    });
  }

  public override getVictoryPoints(player: IPlayer): number {
    const cities = player.game.board.getCities(player);
    const counts = cities.map((city) => {
      return [city, ...player.game.board.getAdjacentSpaces(city)].filter((space) => space.excavator === player).length;
    });
    const vps = counts.map((count) => Math.floor(count / 3));
    return sum(vps);
  }
}
