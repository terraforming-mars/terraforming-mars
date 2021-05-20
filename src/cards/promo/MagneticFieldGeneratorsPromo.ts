import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class MagneticFieldGeneratorsPromo extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.MAGNETIC_FIELD_GENERATORS_PROMO,
      tags: [Tags.BUILDING],
      cost: 22,
      productionBox: Units.of({energy: -4, plants: 2}),

      metadata: {
        cardNumber: 'X33',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(4).digit.br;
            pb.plus().plants(2);
          }).br;
          b.tr(3).digit.tile(TileType.MAGNETIC_FIELD_GENERATORS, true).asterix();
        }),
        description: 'Decrease your Energy production 4 steps and increase your Plant production 2 steps. Raise your TR 3 steps.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    const meetsEnergyRequirements = player.getProduction(Resources.ENERGY) >= 4;
    const canPlaceTile = player.game.board.getAvailableSpacesOnLand(player).length > 0;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * 3, {steel: true}) && meetsEnergyRequirements && canPlaceTile;
    }

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
