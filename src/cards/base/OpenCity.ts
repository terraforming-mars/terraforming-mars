import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class OpenCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.OPEN_CITY,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 23,
      productionDelta: Units.of({energy: -1, megacredits: 4}),

      metadata: {
        cardNumber: '108',
        requirements: CardRequirements.builder((b) => b.oxygen(12)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(4);
          }).city().plants(2);
        }),
        description: {
          text: 'Requires 12% oxygen. Gain 2 plants. Place a City tile. Decrease your Energy production 1 step and increase your MC production 4 steps.',
          align: 'left',
        },
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    return super.canPlay(player) && player.getProduction(Resources.ENERGY) >= 1 && game.board.getAvailableSpacesForCity(player).length > 0;
  }
  public play(player: Player, game: Game) {
    return new SelectSpace('Select space for city tile', game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
      game.addCityTile(player, space.id);
      player.addProduction(Resources.ENERGY, -1);
      player.addProduction(Resources.MEGACREDITS, 4);
      player.plants += 2;
      return undefined;
    });
  }
  public getVictoryPoints() {
    return 1;
  }
}
