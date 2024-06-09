import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Payment} from '../../../common/inputs/Payment';

export class TitanAirScrapping extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 21,
      tags: [Tag.JOVIAN],
      name: CardName.TITAN_AIRSCRAPPING,
      type: CardType.ACTIVE,
      resourceType: CardResource.FLOATER,
      victoryPoints: 2,

      metadata: {
        cardNumber: 'C43',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 2 floaters here.', (eb) => {
            eb.titanium(1).startAction.resource(CardResource.FLOATER, 2);
          }).br;
          b.or().br;
          b.action('Spend 2 floaters here to increase your TR 1 step.', (eb) => {
            eb.resource(CardResource.FLOATER, 2).startAction.tr(1);
          });
        }),
      },
    });
  }


  public canAct(player: IPlayer): boolean {
    if (player.titanium > 0) {
      return true;
    }
    if (this.resourceCount >= 2) {
      return player.canAfford({cost: 0, tr: {tr: 1}});
    }
    return false;
  }

  public action(player: IPlayer) {
    const opts = [];

    const addResource = new SelectOption('Spend 1 titanium to add 2 floaters on this card', 'Spend titanium').andThen(() => this.addResource(player));
    const spendResource = new SelectOption('Remove 2 floaters on this card to increase your TR 1 step', 'Remove floaters').andThen(() => this.spendResource(player));

    if (this.resourceCount >= 2 && player.canAfford({cost: 0, tr: {tr: 1}})) {
      opts.push(spendResource);
    }


    if (player.titanium > 0) {
      opts.push(addResource);
    }

    if (opts.length === 1) {
      return opts[0].cb(undefined);
    }

    return new OrOptions(...opts);
  }

  private addResource(player: IPlayer) {
    player.pay(Payment.of({titanium: 1}));
    player.addResourceTo(this, {qty: 2, log: true});
    return undefined;
  }

  private spendResource(player: IPlayer) {
    player.removeResourceFrom(this, 2);
    player.increaseTerraformRating();
    return undefined;
  }
}
