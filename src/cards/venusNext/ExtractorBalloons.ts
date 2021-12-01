import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE} from '../../constants';
import {LogHelper} from '../../LogHelper';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Card} from '../Card';

export class ExtractorBalloons extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.EXTRACTOR_BALLOONS,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS],
      cost: 21,
      resourceType: ResourceType.FLOATER,

      metadata: {
        cardNumber: '223',
        description: 'Add 3 Floaters to this card',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Floater to this card.', (eb) => {
            eb.empty().startAction.floaters(1);
          }).br;
          b.action('Remove 2 Floaters here to raise Venus 1 step.', (eb) => {
            eb.or(Size.SMALL).floaters(2).startAction.venus(1);
          }).br.floaters(3);
        }),
      },
    });
  };

  public resourceCount: number = 0;

  public play(player: Player) {
    player.addResourceTo(this, 3);
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    const venusMaxed = player.game.getVenusScaleLevel() === MAX_VENUS_SCALE;
    const canAffordReds = player.canAfford(0, {tr: {venus: 1}});
    if (this.resourceCount < 2 || venusMaxed || !canAffordReds) {
      player.addResourceTo(this, {log: true});
      return undefined;
    }
    return new OrOptions(
      new SelectOption('Remove 2 floaters to raise Venus scale 1 step',
        'Remove floaters', () => {
          player.removeResourceFrom(this, 2);
          player.game.increaseVenusScaleLevel(player, 1);
          LogHelper.logVenusIncrease( player, 1);
          return undefined;
        }),
      new SelectOption('Add 1 floater to this card', 'Add floater', () => {
        player.addResourceTo(this, {log: true});
        return undefined;
      }),
    );
  }
}
