import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {IResourceCard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class TitanAirScrapping extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 21,
      tags: [Tags.JOVIAN],
      name: CardName.TITAN_AIRSCRAPPING,
      cardType: CardType.ACTIVE,
      resourceType: ResourceType.FLOATER,
      victoryPoints: 2,

      metadata: {
        cardNumber: 'C43',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 2 floaters here.', (eb) => {
            eb.titanium(1).startAction.floaters(2);
          }).br;
          b.or().br;
          b.action('Spend 2 floaters here to increase your TR 1 step.', (eb) => {
            eb.floaters(2).startAction.tr(1);
          });
        }),
      },
    });
  }

  public resourceCount: number = 0;

  public canAct(player: Player): boolean {
    if (player.titanium > 0) {
      return true;
    }
    if (this.resourceCount >= 2) {
      return player.canAfford(0, {tr: {tr: 1}});
    }
    return false;
  }

  public action(player: Player) {
    const opts: Array<SelectOption> = [];

    const addResource = new SelectOption('Spend 1 titanium to add 2 floaters on this card', 'Spend titanium', () => this.addResource(player));
    const spendResource = new SelectOption('Remove 2 floaters on this card to increase your TR 1 step', 'Remove floaters', () => this.spendResource(player));

    if (this.resourceCount >= 2 && player.canAfford(0, {tr: {tr: 1}})) {
      opts.push(spendResource);
    }


    if (player.titanium > 0) {
      opts.push(addResource);
    }

    if (opts.length === 1) {
      return opts[0].cb();
    }

    return new OrOptions(...opts);
  }

  private addResource(player: Player) {
    player.addResourceTo(this, 2);
    player.titanium--;
    return undefined;
  }

  private spendResource(player: Player) {
    player.removeResourceFrom(this, 2);
    player.increaseTerraformRating();
    return undefined;
  }

  public play() {
    return undefined;
  }
}
