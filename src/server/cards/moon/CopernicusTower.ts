import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {IActionCard} from '../ICard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {Size} from '../../../common/cards/render/Size';

export class CopernicusTower extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      name: CardName.COPERNICUS_TOWER,
      cardType: CardType.ACTIVE,
      tags: [Tag.SCIENCE, Tag.MOON],
      cost: 36,

      resourceType: CardResource.SCIENCE,
      requirements: CardRequirements.builder((b) => b.production(Resources.TITANIUM, 2)),
      victoryPoints: VictoryPoints.tags(Tag.MOON, 1, 1),

      metadata: {
        cardNumber: 'M72',
        renderData: CardRenderer.builder((b) => {
          b.text('Requires you have 2 titanium production.', Size.TINY, false, false).br;
          b.action('Add 1 science resource here, or spend 1 science resource here to raise your TR 1 step.', (eb) => {
            eb.empty().startAction.science(1).nbsp.slash().nbsp.science(1).arrow().tr(1);
          });
          b.br;
          b.vpText('1 VP PER MOON TAG YOU HAVE.');
        }),
      },
    });
  }

  private canRaiseTR(player: Player) {
    return this.resourceCount > 0 && player.canAfford(0, {tr: {tr: 1}});
  }

  public canAct(player: Player) {
    return player.production.titanium >= 2 || this.canRaiseTR(player);
  }

  public action(player: Player) {
    if (!this.canRaiseTR(player)) {
      this.addResource(player);
      return undefined;
    }

    return new OrOptions(
      new SelectOption('Remove 1 science resource to increase TR 1 step', 'Remove resource', () => this.spendResource(player)),
      new SelectOption('Add 1 science resource to this card', 'Add resource', () => this.addResource(player)),
    );
  }

  private addResource(player: Player) {
    player.addResourceTo(this, 1);
    return undefined;
  }

  private spendResource(player: Player) {
    player.removeResourceFrom(this);
    player.increaseTerraformRating();
    return undefined;
  }
}
