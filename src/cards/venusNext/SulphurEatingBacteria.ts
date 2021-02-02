import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';
import {Card} from '../Card';

export class SulphurEatingBacteria extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.SULPHUR_EATING_BACTERIA,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS, Tags.MICROBE],
      cost: 6,
      resourceType: ResourceType.MICROBE,

      requirements: CardRequirements.builder((b) => b.venus(6)),
      metadata: {
        cardNumber: '251',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.or().br;
          b.action('Spend any number of Microbes here to gain triple amount of MC.', (eb) => {
            eb.text('x').microbes(1).startAction.megacredits(3).multiplier;
          });
        }),
        description: 'Requires Venus 6%',
      },
    });
  };
  public resourceCount: number = 0;
  public canPlay(player: Player): boolean {
    return player.game.checkMinRequirements(player, GlobalParameter.VENUS, 6);
  }
  public play() {
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    const opts: Array<SelectOption | SelectAmount> = [];

    const addResource = new SelectOption('Add 1 microbe to this card', 'Add microbe', () => this.addResource(player));
    const spendResource = new SelectAmount('Remove any number of microbes to gain 3 MC per microbe removed', 'Remove microbes', (amount: number) => this.spendResource(player, amount), 1, this.resourceCount);

    opts.push(addResource);

    if (this.resourceCount > 0) {
      opts.push(spendResource);
    } else {
      return this.addResource(player);
    }

    return new OrOptions(...opts);
  }

  private addResource(player: Player) {
    player.addResourceTo(this);
    LogHelper.logAddResource(player, this);
    return undefined;
  }

  private spendResource(player: Player, amount: number) {
    player.removeResourceFrom(this, amount);

    const megaCreditsGained = 3 * amount;
    player.megaCredits += megaCreditsGained;

    const logText: string = 'gain ' + megaCreditsGained + ' MC';
    LogHelper.logRemoveResource(player, this, amount, logText);
    return undefined;
  }
}
