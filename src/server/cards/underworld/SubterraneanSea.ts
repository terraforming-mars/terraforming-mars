import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Tag} from '../../../common/cards/Tag';

export class SubterraneanSea extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SUBTERRANEAN_SEA,
      type: CardType.AUTOMATED,
      cost: 10,
      tags: [Tag.BUILDING],

      tr: {oceans: 1},

      metadata: {
        cardNumber: 'U15',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).excavate().asterix();
        }),
        description: 'Place an ocean tile ON AN AREA NOT RESERVED FOR OCEAN where you have an excavation marker.',
      },
    });
  }

  private availableSpaces(player: IPlayer) {
    const availableSpcesOnLand = player.game.board.getAvailableSpacesOnLand(
      player, {
        cost: player.getCardCost(this),
        tr: {oceans: 1},
      });
    return availableSpcesOnLand.filter((space) => space.excavator === player);
  }

  public override bespokeCanPlay(player: IPlayer) {
    return player.game.canAddOcean() && this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectSpace('Select space for ocean tile', this.availableSpaces(player))
      .andThen((space) => {
        player.game.addOcean(player, space);
        return undefined;
      });
  }
}
