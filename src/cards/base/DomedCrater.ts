
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {digit, max} from '../Options';

export class DomedCrater extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DOMED_CRATER,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 24,
      productionBox: Units.of({energy: -1, megacredits: 3}),
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.oxygen(7, {max})),
      metadata: {
        cardNumber: 'T03',
        description: {
          text: 'Oxygen must be 7% or less. Gain 3 plants. Place a City tile. Decrease your Energy production 1 step and increase your M€ production 3 steps.',
          align: 'left',
        },
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.city().plants(3, {digit}).br;
        }),
      },
    });
  }

  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1 &&
      player.game.board.getAvailableSpacesForCity(player).length > 0;
  }
  public play(player: Player) {
    return new SelectSpace(
      'Select space for city tile',
      player.game.board.getAvailableSpacesForCity(player),
      (space: ISpace) => {
        player.game.addCityTile(player, space.id);
        player.plants += 3;
        player.addProduction(Resources.ENERGY, -1);
        player.addProduction(Resources.MEGACREDITS, 3);
        return undefined;
      },
    );
  }
}
