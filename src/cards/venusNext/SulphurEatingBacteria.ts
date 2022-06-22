import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardName} from '../../common/cards/CardName';
import {LogHelper} from '../../LogHelper';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {multiplier} from '../Options';

export class SulphurEatingBacteria extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.SULPHUR_EATING_BACTERIA,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS, Tags.MICROBE],
      cost: 6,
      resourceType: CardResource.MICROBE,

      requirements: CardRequirements.builder((b) => b.venus(6)),
      metadata: {
        cardNumber: '251',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.or().br;
          b.action('Spend any number of Microbes here to gain triple amount of MC.', (eb) => {
            eb.text('x').microbes(1).startAction.megacredits(3, {multiplier});
          });
        }),
        description: 'Requires Venus 6%',
      },
    });
  }
  public override resourceCount: number = 0;

  public play() {
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    const opts: Array<SelectOption | SelectAmount> = [];

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
    player.removeResourceFrom(this, amount);

    const megaCreditsGained = 3 * amount;
    player.megaCredits += megaCreditsGained;

    const logText: string = 'gain ' + megaCreditsGained + ' M€';
    LogHelper.logRemoveResource(player, this, amount, logText);
    return undefined;
  }
}
