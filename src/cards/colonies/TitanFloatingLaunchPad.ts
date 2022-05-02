import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardResource} from '../../common/CardResource';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {IResourceCard} from '../ICard';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {IColony} from '../../colonies/IColony';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {SelectColony} from '../../inputs/SelectColony';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IColonyTrader} from '../../colonies/IColonyTrader';

export class TitanFloatingLaunchPad extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 18,
      tags: [Tags.JOVIAN],
      name: CardName.TITAN_FLOATING_LAUNCHPAD,
      cardType: CardType.ACTIVE,
      resourceType: CardResource.FLOATER,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C44',
        renderData: CardRenderer.builder((b) => {
          b.action(undefined, (eb) => {
            eb.empty().startAction.floaters(1, {secondaryTag: Tags.JOVIAN}).nbsp.or();
          }).br;
          b.action('Add 1 floater to ANY JOVIAN CARD or spend 1 floater here to trade for free.', (eb) => {
            eb.floaters(1).startAction.trade();
          }).br.br;
          b.floaters(2, {secondaryTag: Tags.JOVIAN});
        }),
        description: {
          text: 'Add two floaters to ANY JOVIAN CARD.',
          align: 'left',
        },
      },
    });
  }

  public override resourceCount: number = 0;

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const openColonies = player.game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);

    if (this.resourceCount === 0 || openColonies.length === 0 || player.getFleetSize() <= player.tradesThisGeneration) {
      player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {restrictedTag: Tags.JOVIAN, title: 'Add 1 floater to a Jovian card'}));
      return undefined;
    }

    return new OrOptions(
      new SelectOption('Remove 1 floater on this card to trade for free', 'Remove floater', () => {
        player.game.defer(new SimpleDeferredAction(
          player,
          () => new SelectColony('Select colony tile to trade with for free', 'Select', openColonies, (colony: IColony) => {
            this.resourceCount--;
            player.game.log('${0} spent 1 floater to trade with ${1}', (b) => b.player(player).colony(colony));
            colony.trade(player);
            return undefined;
          }),
        ));

        return undefined;
      }),
      new SelectOption('Add 1 floater to a Jovian card', 'Add floater', () => {
        player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {restrictedTag: Tags.JOVIAN}));
        return undefined;
      }),
    );
  }

  public play(player: Player) {
    player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 2, restrictedTag: Tags.JOVIAN}));
    return undefined;
  }
}

export class TradeWithTitanFloatingLaunchPad implements IColonyTrader {
  private titanFloatingLaunchPad: TitanFloatingLaunchPad | undefined;

  constructor(private player: Player) {
    const card = player.playedCards.find((card) => card.name === CardName.TITAN_FLOATING_LAUNCHPAD);
    this.titanFloatingLaunchPad = card === undefined ? undefined : (card as TitanFloatingLaunchPad);
  }

  public canUse() {
    return (this.titanFloatingLaunchPad?.resourceCount ?? 0) > 0 &&
      !this.player.getActionsThisGeneration().has(CardName.TITAN_FLOATING_LAUNCHPAD);
  }

  public optionText() {
    return 'Pay 1 Floater (use Titan Floating Launch-pad action)';
  }

  public trade(colony: IColony) {
    // grr I wish there was a simpler syntax.
    if (this.titanFloatingLaunchPad !== undefined) this.titanFloatingLaunchPad.resourceCount--;
    this.player.addActionThisGeneration(CardName.TITAN_FLOATING_LAUNCHPAD);
    this.player.game.log('${0} spent 1 floater to trade with ${1}', (b) => b.player(this.player).colony(colony));
    colony.trade(this.player);
  }
}
