import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {SelectSpace} from '../../inputs/SelectSpace';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {message} from '../../logs/MessageBuilder';

export class NoctisCity extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.NOCTIS_CITY,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 18,

      behavior: {
        production: {energy: -1, megacredits: 3},
      },

      metadata: {
        cardNumber: '017',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.city().asterix();
        }),
        description: 'Decrease your energy production 1 step and increase your M€ production 3 steps. Place a city tile ON THE RESERVED AREA, disregarding normal placement restrictions.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    if (player.game.board.getNoctisCitySpaceId() !== undefined) {
      return true;
    } else {
      return player.game.board.getAvailableSpacesForCity(player).length > 0;
    }
  }
  public override bespokePlay(player: IPlayer) {
    const noctisCitySpaceId = player.game.board.getNoctisCitySpaceId();
    if (noctisCitySpaceId !== undefined) {
      const space = player.game.board.getSpaceOrThrow(noctisCitySpaceId);
      player.game.addCity(player, space);
      return undefined;
    }
    return new SelectSpace(message('Select space for ${0}', (b) => b.card(this)), player.game.board.getAvailableSpacesForCity(player))
      .andThen((space) => {
        player.game.addCity(player, space);
        return undefined;
      });
  }
}
