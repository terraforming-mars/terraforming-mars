import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {IColony} from '../../colonies/IColony';
import {SelectColony} from '../../inputs/SelectColony';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IColonyTrader} from '../../colonies/IColonyTrader';
import {ColoniesHandler} from '../../colonies/ColoniesHandler';
import {message} from '../../logs/MessageBuilder';

export class TitanFloatingLaunchPad extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 18,
      tags: [Tag.JOVIAN],
      name: CardName.TITAN_FLOATING_LAUNCHPAD,
      type: CardType.ACTIVE,
      resourceType: CardResource.FLOATER,
      victoryPoints: 1,

      behavior: {
        addResourcesToAnyCard: {type: CardResource.FLOATER, count: 2, tag: Tag.JOVIAN},
      },

      metadata: {
        cardNumber: 'C44',
        renderData: CardRenderer.builder((b) => {
          b.action(undefined, (eb) => {
            eb.empty().startAction.resource(CardResource.FLOATER, {secondaryTag: Tag.JOVIAN}).nbsp.or();
          }).br;
          b.action('Add 1 floater to ANY JOVIAN CARD or spend 1 floater here to trade for free.', (eb) => {
            eb.resource(CardResource.FLOATER).startAction.trade();
          }).br.br;
          b.resource(CardResource.FLOATER, {amount: 2, secondaryTag: Tag.JOVIAN});
        }),
        description: {
          text: 'Add two floaters to ANY JOVIAN CARD.',
          align: 'left',
        },
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: IPlayer) {
    const orOptions = new OrOptions(
      new SelectOption('Remove 1 floater on this card to trade for free', 'Remove floater').andThen(() => {
        player.defer(
          new SelectColony('Select colony tile to trade with for free', 'Select', ColoniesHandler.tradeableColonies(player.game))
            .andThen((colony) => {
              this.resourceCount--;
              player.game.log('${0} spent 1 floater to trade with ${1}', (b) => b.player(player).colony(colony));
              colony.trade(player);
              return undefined;
            }));
        return undefined;
      }),
      new SelectOption('Add 1 floater to a Jovian card', 'Add floater').andThen(() => {
        player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {restrictedTag: Tag.JOVIAN, title: 'Add 1 floater to a Jovian card'}));
        return undefined;
      }),
    );
    if (this.resourceCount === 0 || !player.colonies.canTrade()) {
      return orOptions.options[1].cb();
    }
    return orOptions;
  }
}

export class TradeWithTitanFloatingLaunchPad implements IColonyTrader {
  private titanFloatingLaunchPad: TitanFloatingLaunchPad | undefined;

  constructor(private player: IPlayer) {
    const card = player.playedCards.find((card) => card.name === CardName.TITAN_FLOATING_LAUNCHPAD);
    this.titanFloatingLaunchPad = card === undefined ? undefined : (card as TitanFloatingLaunchPad);
  }

  public canUse() {
    return (this.titanFloatingLaunchPad?.resourceCount ?? 0) > 0 &&
      !this.player.getActionsThisGeneration().has(CardName.TITAN_FLOATING_LAUNCHPAD);
  }

  public optionText() {
    return message('Pay 1 floater (use ${0} action)', (b) => b.cardName(CardName.TITAN_FLOATING_LAUNCHPAD));
  }

  public trade(colony: IColony) {
    // grr I wish there was a simpler syntax.
    if (this.titanFloatingLaunchPad !== undefined) {
      this.titanFloatingLaunchPad.resourceCount--;
    }
    this.player.addActionThisGeneration(CardName.TITAN_FLOATING_LAUNCHPAD);
    this.player.game.log('${0} spent 1 floater to trade with ${1}', (b) => b.player(this.player).colony(colony));
    colony.trade(this.player);
  }
}
