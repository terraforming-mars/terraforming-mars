import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {IActionCard} from '../ICard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Card} from '../Card';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class CopernicusTower extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      name: CardName.COPERNICUS_TOWER,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SCIENCE, Tags.MOON],
      cost: 36,
      resourceType: ResourceType.SCIENCE,
      requirements: CardRequirements.builder((b) => b.production(Resources.TITANIUM, 2)),

      metadata: {
        description: 'Requires that you have 2 Titanium production. 1VP per each Moon tag you have.',
        cardNumber: 'M72',
        victoryPoints: CardRenderDynamicVictoryPoints.moon(1, 1),
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Science resource to this card.', (eb) => {
            eb.empty().startAction.science(1);
          }).br;
          b.or().br;
          b.action('Action: Spend 1 Science resource here to raise your TR 1 step.', (eb) => {
            eb.science(1).startAction.production((pb) => pb.megacredits(1));
          });
        }),
      },
    });
  };
  public resourceCount = 0;

  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.TITANIUM) >= 2;
  }

  public play() {
    return undefined;
  }

  public canAct(player: Player) {
    return player.getProduction(Resources.TITANIUM) >= 2;
  }

  public action(player: Player) {
    if (this.resourceCount < 1) {
      this.addResource(player);
      return undefined;
    }

    return new OrOptions(
      new SelectOption('Add 1 science resource to this card', 'Add resource', () => this.addResource(player)),
      new SelectOption('Remove 1 science resource to increase TR 1 step', 'Remove resource', () => this.spendResource(player)),
    );
  }

  public getVictoryPoints(player: Player) {
    return player.getTagCount(Tags.MOON, true, false);
  }

  private addResource(player: Player) {
    player.addResourceTo(this, 1);
    return undefined;
  }

  private spendResource(player: Player) {
    player.removeResourceFrom(this);
    player.increaseTerraformRating();
    player.addProduction(Resources.MEGACREDITS);
    return undefined;
  }
}
