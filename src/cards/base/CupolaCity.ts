
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class CupolaCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CUPOLA_CITY,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 16,
      productionDelta: Units.of({energy: -1, megacredits: 3}),

      metadata: {
        cardNumber: '029',
        requirements: CardRequirements.builder((b) => b.oxygen(9).max()),
        description: 'Oxygen must be 9% or less. Place a City tile. Decrease your Energy production 1 step and increase your MC production 3 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.nbsp.city();
        }),
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return super.canPlay(player) &&
        player.getProduction(Resources.ENERGY) >= 1 &&
        game.board.getAvailableSpacesForCity(player).length > 0;
  }
  public play(player: Player, game: Game) {
    return new SelectSpace(
      'Select a space for city tile',
      game.board.getAvailableSpacesForCity(player),
      (space: ISpace) => {
        game.addCityTile(player, space.id);
        player.addProduction(Resources.ENERGY, -1);
        player.addProduction(Resources.MEGACREDITS, 3);
        return undefined;
      },
    );
  }
}
