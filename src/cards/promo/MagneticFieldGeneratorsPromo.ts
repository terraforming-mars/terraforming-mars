import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../common/TileType';
import {ISpace} from '../../boards/ISpace';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {digit} from '../Options';

export class MagneticFieldGeneratorsPromo extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MAGNETIC_FIELD_GENERATORS_PROMO,
      tags: [Tags.BUILDING],
      cost: 22,
      productionBox: Units.of({energy: -4, plants: 2}),
      tr: {tr: 3},

      metadata: {
        cardNumber: 'X33',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(4, {digit}).br;
            pb.plus().plants(2);
          }).br;
          b.tr(3, {digit}).tile(TileType.MAGNETIC_FIELD_GENERATORS, true).asterix();
        }),
        description: 'Decrease your Energy production 4 steps and increase your Plant production 2 steps. Raise your TR 3 steps.',
      },
    });
  }
  public override canPlay(player: Player): boolean {
    const meetsEnergyRequirements = player.getProduction(Resources.ENERGY) >= 4;
    const canPlaceTile = player.game.board.getAvailableSpacesOnLand(player).length > 0;

    return meetsEnergyRequirements && canPlaceTile;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -4);
    player.addProduction(Resources.PLANTS, 2);
    player.increaseTerraformRatingSteps(3);

    const availableSpaces = player.game.board.getAvailableSpacesOnLand(player);
    if (availableSpaces.length < 1) return undefined;

    return new SelectSpace('Select space for tile', availableSpaces, (foundSpace: ISpace) => {
      player.game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.MAGNETIC_FIELD_GENERATORS});
      return undefined;
    });
  }
}
