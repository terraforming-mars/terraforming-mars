import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {IResourceCard} from '../ICard';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {ColonyName} from '../../colonies/ColonyName';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {SelectColony} from '../../inputs/SelectColony';
import {ColonyModel} from '../../models/ColonyModel';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class TitanFloatingLaunchPad extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 18,
      tags: [Tags.JOVIAN],
      name: CardName.TITAN_FLOATING_LAUNCHPAD,
      cardType: CardType.ACTIVE,
      resourceType: ResourceType.FLOATER,

      metadata: {
        cardNumber: 'C44',
        renderData: CardRenderer.builder((b) => {
          b.action(undefined, (eb) => {
            eb.empty().startAction.floaters(1).secondaryTag(Tags.JOVIAN).nbsp.or();
          }).br;
          b.action('Add 1 floater to ANY JOVIAN CARD or spend 1 floater here to trade for free.', (eb) => {
            eb.floaters(1).startAction.trade();
          }).br.br;
          b.floaters(2).secondaryTag(Tags.JOVIAN);
        }),
        description: {
          text: 'Add two floaters to ANY JOVIAN CARD.',
          align: 'left',
        },
        victoryPoints: 1,
      },
    });
  }

  public resourceCount: number = 0;

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const openColonies = player.game.colonies.filter((colony) => colony.isActive && colony.visitor === undefined);

    if (this.resourceCount === 0 || openColonies.length === 0 || player.getFleetSize() <= player.tradesThisTurn) {
      player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {restrictedTag: Tags.JOVIAN, title: 'Add 1 floater to a Jovian card'}));
      return undefined;
    }

    return new OrOptions(
      new SelectOption('Add 1 floater to a Jovian card', 'Add floater', () => {
        player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {restrictedTag: Tags.JOVIAN}));
        return undefined;
      }),
      new SelectOption('Remove 1 floater on this card to trade for free', 'Remove floater', () => {
        const coloniesModel: Array<ColonyModel> = player.game.getColoniesModel(openColonies);

        player.game.defer(new DeferredAction(
          player,
          () => new SelectColony('Select colony tile to trade with for free', 'Select', coloniesModel, (colonyName: ColonyName) => {
            openColonies.forEach((colony) => {
              if (colony.name === colonyName) {
                this.resourceCount--;
                player.game.log('${0} traded with ${1}', (b) => b.player(player).colony(colony));
                colony.trade(player);
                return undefined;
              }

              return undefined;
            });

            return undefined;
          }),
        ));

        return undefined;
      }),
    );
  }

  public play(player: Player) {
    player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2, restrictedTag: Tags.JOVIAN}));
    return undefined;
  }

  public getVictoryPoints(): number {
    return 1;
  }
}
