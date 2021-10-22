import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {Card} from '../Card';
import {all} from '../Options';

export class OrbitalPowerGrid extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.ORBITAL_POWER_GRID,
      cardType: CardType.AUTOMATED,
      tags: [Tags.ENERGY, Tags.SPACE],
      cost: 19,
      victoryPoints: 1,

      metadata: {
        description: 'Increase your energy production 1 step per city tile NOT ON MARS.',
        cardNumber: 'M85',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(1)).slash().city({all, secondaryTag: Tags.SPACE});
        }),
      },
    });
  };

  public play(player: Player) {
    const amount = player.game.getCitiesInPlay() - player.game.getCitiesInPlayOnMars();
    player.addProduction(Resources.ENERGY, amount, {log: true});
    return undefined;
  }
}
