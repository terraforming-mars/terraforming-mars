import {IActionCard} from '../ICard';
import {PlayerInput} from '../../PlayerInput';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {multiplier} from '../Options';

export class SulphurEatingBacteria extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.SULPHUR_EATING_BACTERIA,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS, Tag.MICROBE],
      cost: 6,
      resourceType: CardResource.MICROBE,

      requirements: CardRequirements.builder((b) => b.venus(6)),
      metadata: {
        cardNumber: '251',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.or().br;
          b.action('Spend any number of microbes here to gain triple amount of M€.', (eb) => {
            eb.text('x').microbes(1).startAction.megacredits(3, {multiplier});
          });
        }),
        description: 'Requires Venus 6%',
      },
    });
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    const opts: Array<PlayerInput> = [];

    const addResource = new SelectOption('Add 1 microbe to this card', 'Add microbe', () => {
      player.addResourceTo(this, {log: true});
      return undefined;
    });
    const spendResource = new SelectAmount('Remove any number of microbes to gain 3 M€ per microbe removed', 'Remove microbes', (amount: number) => this.spendResource(player, amount), 1, this.resourceCount, true);

    opts.push(addResource);

    if (this.resourceCount > 0) {
      opts.push(spendResource);
    } else {
      player.addResourceTo(this, {log: true});
      return undefined;
    }

    return new OrOptions(...opts);
  }

  private spendResource(player: Player, amount: number) {
    player.removeResourceFrom(this, amount, {log: false});

    const megaCreditsGained = 3 * amount;
    player.megaCredits += megaCreditsGained;

    player.game.log('${0} removed ${1} microbes from ${2} to gain ${3} M€', (b) =>
      b.player(player).number(amount).card(this).number(megaCreditsGained));

    return undefined;
  }
}
