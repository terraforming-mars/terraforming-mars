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
import {Game} from '../../Game';
import {LogHelper} from '../../LogHelper';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';

export class NitriteReducingBacteria extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.NITRITE_REDUCING_BACTERIA,
      tags: [Tags.MICROBE],
      cost: 11,
      resourceType: ResourceType.MICROBE,

      metadata: {
        cardNumber: '157',
        renderData: CardRenderer.builder((b) => {
          b.effectBox((eb) => {
            eb.empty().startAction.microbes(1);
            eb.description('Action: Add 1 Microbe to this card.');
          }).br;
          b.or().br;
          b.effectBox((eb) => {
            eb.microbes(3).startAction.tr(1);
            eb.description('Action: Remove 3 Microbes to increase your TR 1 step.');
          }).br;
          b.microbes(3);
        }),
        description: 'Add 3 Microbes to this card.',
      },
    });
  }

    public resourceCount: number = 0;

    public play(player: Player, game: Game) {
      game.defer(new DeferredAction(
        player,
        () => {
          player.addResourceTo(this, 3);
          return undefined;
        },
      ));
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player, game: Game) {
      if (this.resourceCount < 3) {
        player.addResourceTo(this);
        LogHelper.logAddResource(game, player, this);
        return undefined;
      }

      const orOptions = new OrOptions();
      const redsAreRuling = PartyHooks.shouldApplyPolicy(game, PartyName.REDS);

      if (!redsAreRuling || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST))) {
        orOptions.options.push(new SelectOption('Remove 3 microbes to increase your terraform rating 1 step', 'Remove microbes', () => {
          this.resourceCount -= 3;
          LogHelper.logRemoveResource(game, player, this, 3, 'gain 1 TR');
          player.increaseTerraformRating(game);
          return undefined;
        }));
      }

      orOptions.options.push(new SelectOption('Add 1 microbe to this card', 'Add microbe', () => {
        player.addResourceTo(this);
        LogHelper.logAddResource(game, player, this);
        return undefined;
      }));

      if (orOptions.options.length === 1) return orOptions.options[0].cb();
      return orOptions;
    }
}
