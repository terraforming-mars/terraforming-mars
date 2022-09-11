import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PartyName} from '../../../common/turmoil/PartyName';
import {SendDelegateToArea} from '../../deferredActions/SendDelegateToArea';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Turmoil} from '../../turmoil/Turmoil';

export class CulturalMetropolis extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CULTURAL_METROPOLIS,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 20,

      behavior: {
        production: {energy: -1, megacredits: 3},
        city: {},
      },

      requirements: CardRequirements.builder((b) => b.party(PartyName.UNITY)),
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

  public override bespokeCanPlay(player: Player): boolean {
    // This card requires player has 2 delegates available
    const turmoil = Turmoil.getTurmoil(player.game);
    return turmoil.getAvailableDelegateCount(player.id, 'both') >= 2 && player.game.board.getAvailableSpacesForCity(player).length > 0;
  }

  public override bespokePlay(player: Player) {
    const title = 'Select where to send two delegates';

    const turmoil = Turmoil.getTurmoil(player.game);
    const availableReserveDelegates = turmoil.getAvailableDelegateCount(player.id, 'reserve');
    if (availableReserveDelegates > 1) {
      player.game.defer(new SendDelegateToArea(player, title, {count: 2, source: 'reserve'}));
    } else if (availableReserveDelegates === 1 && turmoil.lobby.has(player.id)) {
      // TODO(kberg): it's not that clear that 'lobby' when count > 1 falls into the reserve.
      player.game.defer(new SendDelegateToArea(player, title, {count: 2, source: 'lobby'}));
    }
    return undefined;
  }
}
