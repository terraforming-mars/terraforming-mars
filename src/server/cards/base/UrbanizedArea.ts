import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CanAffordOptions, IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {SelectSpace} from '../../inputs/SelectSpace';
import {CardName} from '../../../common/cards/CardName';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';

export class UrbanizedArea extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.URBANIZED_AREA,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 10,

      behavior: {
        production: {energy: -1, megacredits: 2},
      },

      metadata: {
        cardNumber: '120',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(2);
          }).city().asterix();
        }),
        description: 'Decrease your energy production 1 step and increase your M€ production 2 steps. Place a city tile ADJACENT TO AT LEAST 2 OTHER CITY TILES.',
      },
    });
  }
  private getAvailableSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): Array<Space> {
    return player.game.board.getAvailableSpacesOnLand(player, canAffordOptions)
      .filter((space) => player.game.board.getAdjacentSpaces(space).filter((adjacentSpace) => Board.isCitySpace(adjacentSpace)).length >= 2);
  }
  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions): boolean {
    return this.getAvailableSpaces(player, canAffordOptions).length > 0;
  }
  public override bespokePlay(player: IPlayer) {
    return new SelectSpace('Select space next to at least 2 other city tiles', this.getAvailableSpaces(player))
      .andThen((space) => {
        player.game.addCity(player, space);
        return undefined;
      });
  }
}
