import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {ResourceType} from '../../common/ResourceType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {IResourceCard} from '../ICard';
import {Resources} from '../../common/Resources';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Card} from '../Card';
import {Size} from '../render/Size';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class AtmoCollectors extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 15,
      name: CardName.ATMO_COLLECTORS,
      cardType: CardType.ACTIVE,
      resourceType: ResourceType.FLOATER,

      metadata: {
        description: 'Add 2 floaters to ANY card.',
        cardNumber: 'C03',
        renderData: CardRenderer.builder((b) => {
          b.action('Add one floater here.', (eb) => {
            eb.empty().startAction.floaters(1).or(Size.SMALL);
          }).br;
          b.action('Spend 1 floater here to gain 2 titanium, or 3 energy, or 4 heat.', (eb) => {
            eb.floaters(1).startAction.titanium(2, {digit}).slash(Size.SMALL).energy(3, {digit}).slash(Size.SMALL).heat(4, {digit});
          }).br;
          b.floaters(2).asterix();
        }),
      },
    });
  }

  public override resourceCount: number = 0;

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    if (this.resourceCount < 1) {
      player.addResourceTo(this, 1);
      return undefined;
    }
    return new OrOptions(
      new SelectOption('Remove 1 floater to gain 2 titanium', 'Remove floater', () => {
        this.resourceCount--;
        player.addResource(Resources.TITANIUM, 2, {log: true});
        return undefined;
      }),
      new SelectOption('Remove 1 floater to gain 3 energy', 'Remove floater', () => {
        this.resourceCount--;
        player.addResource(Resources.ENERGY, 3, {log: true});
        return undefined;
      }),
      new SelectOption('Remove 1 floater to gain 4 heat', 'Remove floater', () => {
        this.resourceCount--;
        player.addResource(Resources.HEAT, 4, {log: true});
        return undefined;
      }),
      new SelectOption('Add 1 floater to this card', 'Add floater', () => {
        player.addResourceTo(this, {log: true});
        return undefined;
      }),
    );
  }
  public play(player: Player) {
    player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2}));
    return undefined;
  }
}
