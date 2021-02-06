import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';
import {REDS_RULING_POLICY_COST} from '../../constants';

export class GHGProducingBacteria extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.GHG_PRODUCING_BACTERIA,
      tags: [Tags.SCIENCE, Tags.MICROBE],
      cost: 8,
      resourceType: ResourceType.MICROBE,

      requirements: CardRequirements.builder((b) => b.oxygen(4)),
      metadata: {
        description: 'Requires 4% oxygen.',
        cardNumber: '034',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.or().br;
          b.action('Remove 2 Microbes to raise temperature 1 step.', (eb) => {
            eb.microbes(2).startAction.temperature(1);
          });
        }),
      },
    });
  }

    public resourceCount: number = 0;
    public canPlay(player: Player): boolean {
      return player.game.checkMinRequirements(player, GlobalParameter.OXYGEN, 4);
    }
    public play() {
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player) {
      if (this.resourceCount < 2) {
        player.addResourceTo(this);
        LogHelper.logAddResource(player, this);
        return undefined;
      }

      const orOptions = new OrOptions();
      const redsAreRuling = PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS);

      if (!redsAreRuling || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST))) {
        orOptions.options.push(new SelectOption('Remove 2 microbes to raise temperature 1 step', 'Remove microbes', () => {
          player.removeResourceFrom(this, 2);
          LogHelper.logRemoveResource(player, this, 2, 'raise temperature 1 step');
          return player.game.increaseTemperature(player, 1);
        }));
      }

      orOptions.options.push(new SelectOption('Add 1 microbe to this card', 'Add microbe', () => {
        player.addResourceTo(this);
        LogHelper.logAddResource(player, this);
        return undefined;
      }));

      if (orOptions.options.length === 1) return orOptions.options[0].cb();
      return orOptions;
    }
}
