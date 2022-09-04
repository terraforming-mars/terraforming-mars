import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class SpacePort extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 22,
      tags: [Tag.CITY, Tag.BUILDING],
      name: CardName.SPACE_PORT,
      cardType: CardType.AUTOMATED,
      productionBox: {energy: -1, megacredits: 4},

      requirements: CardRequirements.builder((b) => b.colonies()),
      metadata: {
        cardNumber: 'C39',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(4);
          }).nbsp.city().br;
          b.tradeFleet();
        }),
        description: 'Requires 1 colony. Decrease your Energy production 1 step and increase your M€ production 4 steps. Place a City tile. Gain 1 Trade Fleet.',
      },
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    if (player.game.board.getAvailableSpacesForCity(player).length === 0) return false;
    let coloniesCount = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
    });
    return coloniesCount > 0;
  }

  public override bespokePlay(player: Player) {
    player.colonies.increaseFleetSize();

    return new SelectSpace('Select space for city tile', player.game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
      player.game.addCityTile(player, space.id);
      return undefined;
    });
  }

  public onDiscard(player: Player): void {
    player.colonies.decreaseFleetSize();
  }
}
