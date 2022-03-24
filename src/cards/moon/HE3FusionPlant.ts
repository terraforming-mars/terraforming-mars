import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resources} from '../../common/Resources';
import {TileType} from '../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {all} from '../Options';

export class HE3FusionPlant extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.HE3_FUSION_PLANT,
      cardType: CardType.AUTOMATED,
      tags: [Tags.ENERGY, Tags.ENERGY, Tags.MOON],
      cost: 12,
      requirements: CardRequirements.builder((b) => b.miningRate(2)),
      metadata: {
        description: 'Requires Mining Rate of 2 or higher. ' +
            'Increase your energy production 1 step for each mining tile on the Moon.',
        cardNumber: 'M48',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).slash().moonMine({all});
        }),
      },
    });
  }

  public play(player: Player) {
    const count = MoonExpansion.spaces(player.game, TileType.MOON_MINE, {surfaceOnly: true}).length;
    player.addProduction(Resources.ENERGY, count, {log: true});
    return undefined;
  }
}
