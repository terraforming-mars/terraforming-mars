import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {PartyName} from '../../../common/turmoil/PartyName';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardRenderer} from '../render/CardRenderer';
import {Turmoil} from '../../turmoil/Turmoil';

export class CulturalMetropolis extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.CULTURAL_METROPOLIS,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 20,

      behavior: {
        production: {energy: -1, megacredits: 3},
        city: {},
      },

      requirements: {party: PartyName.UNITY},
      metadata: {
        cardNumber: 'T03',
        description: 'Requires that Unity is ruling or that you have 2 delegates there. Decrease your energy production 1 step and increase your M€ production 3 steps. Place a city tile. Place 2 delegates in 1 party.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).city().delegates(2);
        }),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    const turmoil = Turmoil.getTurmoil(player.game);
    return turmoil.getAvailableDelegateCount(player) >= 2 && player.game.board.getAvailableSpacesForCity(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new SendDelegateToArea(player, 'Select where to send two delegates', {count: 2}));
    return undefined;
  }
}
