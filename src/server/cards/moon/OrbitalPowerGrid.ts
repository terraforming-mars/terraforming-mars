import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';
import {Card} from '../Card';
import {all} from '../Options';

export class OrbitalPowerGrid extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.ORBITAL_POWER_GRID,
      cardType: CardType.AUTOMATED,
      tags: [Tag.ENERGY, Tag.SPACE],
      cost: 19,
      victoryPoints: 1,

      metadata: {
        description: 'Increase your energy production 1 step per city tile NOT ON MARS.',
        cardNumber: 'M85',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).slash().city({all, secondaryTag: Tag.SPACE});
        }),
      },
    });
  }

  public play(player: Player) {
    const amount = player.game.getCitiesCount() - player.game.getCitiesOnMarsCount();
    player.addProduction(Resources.ENERGY, amount, {log: true});
    return undefined;
  }
}
