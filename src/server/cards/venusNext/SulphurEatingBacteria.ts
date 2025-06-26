import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class SulphurEatingBacteria extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.SULPHUR_EATING_BACTERIA,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS, Tag.MICROBE],
      cost: 6,
      resourceType: CardResource.MICROBE,

      requirements: {venus: 6},
      metadata: {
        cardNumber: '251',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to this card.', (eb) => {
            eb.empty().startAction.resource(CardResource.MICROBE);
          }).br;
          b.or().br;
          b.action('Spend any number of microbes here to gain triple amount of M€.', (eb) => {
            eb.text('x').resource(CardResource.MICROBE).startAction.megacredits(1, {text: '3x'});
          });
        }),
        description: 'Requires Venus 6%',
      },
    });
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: IPlayer) {
    const opts = [];

    const addResource = new SelectOption('Add 1 microbe to this card', 'Add microbe').andThen(() => {
      player.addResourceTo(this, {log: true});
      return undefined;
    });
    const spendResource = new SelectAmount('Remove any number of microbes to gain 3 M€ per microbe removed', 'Remove microbes', 1, this.resourceCount, true)
      .andThen((amount) => this.spendResource(player, amount));

    opts.push(addResource);

    if (this.resourceCount > 0) {
      opts.push(spendResource);
    } else {
      player.addResourceTo(this, {log: true});
      return undefined;
    }

    return new OrOptions(...opts);
  }

  private spendResource(player: IPlayer, amount: number) {
    player.removeResourceFrom(this, amount, {log: false});

    const megaCreditsGained = 3 * amount;
    player.megaCredits += megaCreditsGained;

    player.game.log('${0} removed ${1} microbes from ${2} to gain ${3} M€', (b) =>
      b.player(player).number(amount).card(this).number(megaCreditsGained));

    return undefined;
  }
}
