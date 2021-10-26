
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {max} from '../Options';

export class CupolaCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CUPOLA_CITY,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 16,
      productionBox: Units.of({energy: -1, megacredits: 3}),

      requirements: CardRequirements.builder((b) => b.oxygen(9, {max})),
      metadata: {
        cardNumber: '029',
        description: 'Oxygen must be 9% or less. Place a City tile. Decrease your Energy production 1 step and increase your M€ production 3 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.nbsp.city();
        }),
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1 &&
      player.game.board.getAvailableSpacesForCity(player).length > 0;
  }
  public play(player: Player) {
    return new SelectSpace(
      'Select a space for city tile',
      player.game.board.getAvailableSpacesForCity(player),
      (space: ISpace) => {
        player.game.addCityTile(player, space.id);
        player.addProduction(Resources.ENERGY, -1);
        player.addProduction(Resources.MEGACREDITS, 3);
        return undefined;
      },
    );
  }
}
