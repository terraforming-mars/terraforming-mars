import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class NoctisCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.NOCTIS_CITY,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 18,
      productionBox: Units.of({energy: -1, megacredits: 3}),

      metadata: {
        cardNumber: '017',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.city().asterix();
        }),
        description: 'Decrease your Energy production 1 step and increase your M€ production 3 steps. Place a City tile ON THE RESERVED AREA, disregarding normal placement restrictions.',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    if (player.getProduction(Resources.ENERGY) < 1) {
      return false;
    }
    if (player.game.board.getNoctisCitySpaceId !== undefined) {
      return true;
    } else {
      return player.game.board.getAvailableSpacesForCity(player).length > 0;
    }
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.MEGACREDITS, 3);
    const noctisCitySpaceId = player.game.board.getNoctisCitySpaceId();
    if (noctisCitySpaceId !== undefined) {
      player.game.addCityTile(player, noctisCitySpaceId);
      return undefined;
    }
    return new SelectSpace('Select space for Noctis city', player.game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
      player.game.addCityTile(player, space.id);
      return undefined;
    });
  }
}
