import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {OrOptions} from '../../inputs/OrOptions';
import {ResourceType} from '../../common/ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../common/cards/CardName';
import {LogHelper} from '../../LogHelper';
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

  public override resourceCount = 0;

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

    if (player.canAfford(0, {tr: {oxygen: 1}})) {
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
