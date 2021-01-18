import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class ImmigrantCity extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.IMMIGRANT_CITY,
      tags: [Tags.CITY, Tags.BUILDING],
      cost: 13,
      productionDelta: Units.of({energy: -1, megacredits: -2}),

      metadata: {
        cardNumber: '200',
        renderData: CardRenderer.builder((b) => {
          b.effect('When a City tile is placed, including this, increase your MC production 1 step.', (eb) => {
            eb.city().any.startEffect.production((pb) => pb.megacredits(1));
          }).br;
          b.production((pb) => pb.minus().energy(1).megacredits(-2)).city();
        }),
        description: 'Decrease your Energy production 1 step and decrease your MC production 2 steps. Place a City tile.',
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    const hasEnergyProduction = player.getProduction(Resources.ENERGY) >= 1;
    const canPlaceCityOnMars = game.board.getAvailableSpacesForCity(player).length > 0;
    const canDecreaseMcProduction = player.getProduction(Resources.MEGACREDITS) >= -4 || player.isCorporation(CardName.THARSIS_REPUBLIC);

    return hasEnergyProduction && canDecreaseMcProduction && canPlaceCityOnMars;
  }
  public onTilePlaced(player: Player, space: ISpace) {
    if (Board.isCitySpace(space)) {
      player.addProduction(Resources.MEGACREDITS);
    }
  }
  public play(player: Player, game: Game) {
    return new SelectSpace('Select space for city tile', game.board.getAvailableSpacesForCity(player), (space: ISpace) => {
      game.addCityTile(player, space.id);
      player.addProduction(Resources.ENERGY, -1);
      player.addProduction(Resources.MEGACREDITS, -2);
      return undefined;
    });
  }
}
