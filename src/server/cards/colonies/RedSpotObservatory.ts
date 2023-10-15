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

export class RedSpotObservatory extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 17,
      tags: [Tag.JOVIAN, Tag.SCIENCE],
      name: CardName.RED_SPOT_OBSERVATORY,
      type: CardType.ACTIVE,
      resourceType: CardResource.FLOATER,
      victoryPoints: 2,

      behavior: {
        drawCard: 2,
      },

      requirements: {tag: Tag.SCIENCE, count: 3},
      metadata: {
        cardNumber: 'C32',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to this card, or spend 1 floater here to draw a card.', (eb) => {
            eb.empty().arrow().floaters(1).or();
            eb.floaters(1).startAction.cards(1);
          }).br;
          b.cards(2);
        }),
        description: {
          text: 'Requires 3 science tags. Draw 2 cards.',
          align: 'left',
        },
      },
    });
  }


  public canAct(): boolean {
    return true;
  }

  public action(player: IPlayer) {
    if (this.resourceCount < 1) {
      player.addResourceTo(this, 1);
      return undefined;
    }

    const opts: Array<SelectOption> = [];

    const addResource = new SelectOption('Add 1 floater on this card', 'Add floater').andThen(() => this.addResource(player));
    const spendResource = new SelectOption('Remove 1 floater on this card to draw a card', 'Remove floater').andThen(() => this.spendResource(player));

    opts.push(spendResource);
    opts.push(addResource);

    return new OrOptions(...opts);
  }

  private addResource(player: IPlayer) {
    player.addResourceTo(this, 1);
    return undefined;
  }

  private spendResource(player: IPlayer) {
    this.resourceCount--;
    player.drawCard();
    return undefined;
  }
}
