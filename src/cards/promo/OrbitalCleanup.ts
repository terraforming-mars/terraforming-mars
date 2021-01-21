import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';

export class OrbitalCleanup extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ORBITAL_CLEANUP,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 14,

      metadata: {
        cardNumber: 'X08',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 MC per Science tag you have.', (eb) => {
            eb.empty().startAction.megacredits(1).slash().science().played;
          }).br;
          b.production((pb) => {
            pb.megacredits(-2);
          });
        }),
        description: 'Decrease your MC production 2 steps.',
        victoryPoints: 2,
      },
    });
  }

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.MEGACREDITS) >= -3;
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, -2);
    return undefined;
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    player.setResource(Resources.MEGACREDITS, player.getTagCount(Tags.SCIENCE));
    return undefined;
  }

  public getVictoryPoints() {
    return 2;
  }
}
