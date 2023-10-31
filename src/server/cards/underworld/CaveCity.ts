import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IPlayer} from '../../IPlayer';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Tag} from '../../../common/cards/Tag';

export class CaveCity extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CAVE_CITY,
      type: CardType.AUTOMATED,
      cost: 14,
      tags: [Tag.MARS, Tag.BUILDING, Tag.CITY],

      requirements: {excavation: 1},

      behavior: {production: {megacredits: 1}},

      metadata: {
        cardNumber: 'U27',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).br;
          b.city().excavate().asterix();
        }),
        description: 'Requires 1 excavation marker. Increase your M€ production 1 step. ' +
        'Place a city in a space where YOU have an excavation marker. ' +
        'Regular placement restrictions still apply.',
      },
    });
  }

  private availableSpaces(player: IPlayer) {
    const availableSpaceForCity = player.game.board.getAvailableSpacesForCity(
      player, {cost: player.getCardCost(this)});
    return availableSpaceForCity.filter((space) => space.excavator === player);
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.availableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    return new SelectSpace(
      'Select space for a city tile',
      this.availableSpaces(player))
      .andThen((space) => {
        player.game.addCity(player, space);
        return undefined;
      });
  }
}
