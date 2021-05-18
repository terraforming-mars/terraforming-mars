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
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardRenderer} from '../render/CardRenderer';

export class RegolithEaters extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.REGOLITH_EATERS,
      tags: [Tags.SCIENCE, Tags.MICROBE],
      cost: 13,
      resourceType: ResourceType.MICROBE,

      metadata: {
        cardNumber: '033',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.or().br;
          b.action('Remove 2 Microbes from this card to raise oxygen level 1 step.', (eb) => {
            eb.microbes(2).startAction.oxygen(1);
          }).br;
        }),
      },
    });
  }

    public resourceCount = 0;

    public play(_player: Player) {
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player) {
      if (this.resourceCount < 2) {
        player.addResourceTo(this, {log: true});
        return undefined;
      }

      const orOptions = new OrOptions();
      const redsAreRuling = PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS);

      if (!redsAreRuling || (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST))) {
        orOptions.options.push(new SelectOption('Remove 2 microbes to raise oxygen level 1 step', 'Remove microbes', () => {
          player.removeResourceFrom(this, 2);
          LogHelper.logRemoveResource(player, this, 2, 'raise oxygen 1 step');
          return player.game.increaseOxygenLevel(player, 1);
        }));
      }

      orOptions.options.push(new SelectOption('Add 1 microbe to this card', 'Add microbe', () => {
        player.addResourceTo(this, {log: true});
        return undefined;
      }));

      if (orOptions.options.length === 1) return orOptions.options[0].cb();
      return orOptions;
    }
}
