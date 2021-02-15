import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardMetadata} from '../CardMetadata';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../TileType';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class HE3FusionPlant implements IProjectCard {
  public cost = 12;
  public tags = [Tags.ENERGY, Tags.ENERGY, Tags.MOON];
  public cardType = CardType.AUTOMATED;
  public name = CardName.HE3_FUSION_PLANT;

  public canPlay(player: Player): boolean {
    return MoonExpansion.moonData(player.game).miningRate >= 2;
  }

  public play(player: Player) {
    const count = MoonExpansion.moonData(player.game).moon.getSpacesWithTile(TileType.MOON_MINE).length;
    player.addProduction(Resources.ENERGY, count, player.game);
    return undefined;
  }

  public readonly requirements = CardRequirements.builder((b) => b.miningRate(2));

  public readonly metadata: CardMetadata = {
    description: 'Requires Mining Rate of 2 or higher. ' +
      'Increase your energy production 1 step for each mining tile on the Moon.',
    cardNumber: 'M48',
    renderData: CardRenderer.builder((b) => {
      b.production((pb) => pb.energy(1)).slash().tile(TileType.MOON_MINE, false);
    }),
  };
}
