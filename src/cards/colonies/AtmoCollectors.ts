import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {IResourceCard} from '../ICard';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../Resources';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class AtmoCollectors implements IProjectCard, IResourceCard {
  public cost = 15;
  public tags = [];
  public name = CardName.ATMO_COLLECTORS;
  public cardType = CardType.ACTIVE;
  public resourceType = ResourceType.FLOATER;
  public resourceCount: number = 0;

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    if (this.resourceCount < 1) {
      this.resourceCount++;
      return undefined;
    }
    return new OrOptions(
      new SelectOption('Remove 1 floater to gain 2 titanium', 'Remove floater', () => {
        this.resourceCount--;
        player.titanium += 2;
        LogHelper.logGainStandardResource(player, Resources.TITANIUM, 2);
        return undefined;
      }),
      new SelectOption('Remove 1 floater to gain 3 energy', 'Remove floater', () => {
        this.resourceCount--;
        player.energy += 3;
        LogHelper.logGainStandardResource(player, Resources.ENERGY, 3);
        return undefined;
      }),
      new SelectOption('Remove 1 floater to gain 4 heat', 'Remove floater', () => {
        this.resourceCount--;
        player.heat += 4;
        LogHelper.logGainStandardResource(player, Resources.HEAT, 4);
        return undefined;
      }),
      new SelectOption('Add 1 floater to this card', 'Add floater', () => {
        this.resourceCount++;
        LogHelper.logAddResource(player, this);
        return undefined;
      }),
    );
  }
  public play(player: Player, game: Game) {
    game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2}));
    return undefined;
  }
  public metadata: CardMetadata = {
    description: 'Add 2 floaters to ANY card.',
    cardNumber: 'C03',
    renderData: CardRenderer.builder((b) => {
      b.action('Add one floater here.', (eb) => {
        eb.empty().startAction.floaters(1).or(CardRenderItemSize.SMALL);
      }).br;
      b.action('Spend 1 floater here to gain 2 titanium, or 3 energy, or 4 heat.', (eb) => {
        eb.floaters(1).startAction.titanium(2).digit.slash(CardRenderItemSize.SMALL).energy(3).digit.slash(CardRenderItemSize.SMALL).heat(4).digit;
      }).br;
      b.floaters(2).asterix();
    }),
  };
}
