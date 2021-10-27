import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {CardRequirements} from '../CardRequirements';
import {Tags} from '../Tags';
import {Resources} from '../../Resources';

export class OzoneGenerators extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.OZONE_GENERATORS,
      cost: 14,
      tags: [Tags.MARS, Tags.SPACE],
      requirements: CardRequirements.builder((b) => b.oxygen(6)),

      metadata: {
        cardNumber: 'Pf36',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 3 energy to gain 1 TR.', (eb) => eb.energy(3).startAction.tr(1));
        }),
        description: 'Requires 6% Oxygen.',
      },
    });
  }

  public canAct(player: Player) {
    return player.energy >= 3 && player.canAfford(0, {tr: {tr: 1}});
  }

  public action(player: Player) {
    player.deductResource(Resources.ENERGY, 3);
    player.increaseTerraformRating();
    player.game.log('${0} spent 3 energy to gain 1 TR', (b) => b.player(player));
    return undefined;
  }

  public play() {
    return undefined;
  }
}

