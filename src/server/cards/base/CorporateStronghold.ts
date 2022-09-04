import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class CorporateStronghold extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CORPORATE_STRONGHOLD,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 11,
      productionBox: {energy: -1, megacredits: 3},
      victoryPoints: -2,

      metadata: {
        cardNumber: '182',
        description: 'Decrease your Energy production 1 step and increase your M€ production 3 steps. Place a City tile.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.nbsp.city();
        }),
      },
    });
  }
  public override bespokeCanPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesForCity(player).length > 0;
  }
  public override bespokePlay(player: Player) {
    return new SelectSpace(
      'Select space for city tile',
      player.game.board.getAvailableSpacesForCity(player),
      (space: ISpace) => {
        player.game.addCityTile(player, space.id);
        return undefined;
      },
    );
  }
}
