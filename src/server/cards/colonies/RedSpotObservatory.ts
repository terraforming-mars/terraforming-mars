import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class RedSpotObservatory extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 17,
      tags: [Tag.JOVIAN, Tag.SCIENCE],
      name: CardName.RED_SPOT_OBSERVATORY,
      cardType: CardType.ACTIVE,
      resourceType: CardResource.FLOATER,
      victoryPoints: 2,

      behavior: {
        drawCard: 2,
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 3)),
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

  public action(player: Player) {
    if (this.resourceCount < 1) {
      player.addResourceTo(this, 1);
      return undefined;
    }

    const opts: Array<SelectOption> = [];

    const addResource = new SelectOption('Add 1 floater on this card', 'Add floater', () => this.addResource(player));
    const spendResource = new SelectOption('Remove 1 floater on this card to draw a card', 'Remove floater', () => this.spendResource(player));

    opts.push(spendResource);
    opts.push(addResource);

    return new OrOptions(...opts);
  }

  private addResource(player: Player) {
    player.addResourceTo(this, 1);
    return undefined;
  }

  private spendResource(player: Player) {
    this.resourceCount--;
    player.drawCard();
    return undefined;
  }
}
