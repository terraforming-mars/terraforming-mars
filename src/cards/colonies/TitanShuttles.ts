import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {IResourceCard} from '../ICard';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class TitanShuttles extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 23,
      tags: [Tags.JOVIAN, Tags.SPACE],
      name: CardName.TITAN_SHUTTLES,
      cardType: CardType.ACTIVE,
      resourceType: ResourceType.FLOATER,

      metadata: {
        cardNumber: 'C45',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 2 floaters to ANY JOVIAN CARD.', (eb) => {
            eb.empty().startAction.floaters(2).secondaryTag(Tags.JOVIAN);
          }).br;
          b.or().br;
          b.action('Spend any number of floaters here to gain the same number of titanium.', (eb) => {
            eb.text('x').floaters(1).startAction.text('x').titanium(1);
          }).br;
        }),
        victoryPoints: 1,
      },
    });
  }

  public resourceCount: number = 0;

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    if (this.resourceCount === 0) {
      player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2, restrictedTag: Tags.JOVIAN, title: 'Add 2 floaters to a Jovian card'}));
      return undefined;
    }

    return new OrOptions(
      new SelectOption('Add 2 floaters to a Jovian card', 'Add floaters', () => {
        player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2, restrictedTag: Tags.JOVIAN}));
        return undefined;
      }),
      new SelectAmount(
        'Remove X floaters on this card to gain X titanium',
        'Remove floaters',
        (amount: number) => {
          player.removeResourceFrom(this, amount);
          player.titanium += amount;
          player.game.log('${0} removed ${1} floaters to gain ${2} titanium', (b) => b.player(player).number(amount).number(amount));
          return undefined;
        },
        1,
        this.resourceCount,
      ),
    );
  }

  public play() {
    return undefined;
  }

  public getVictoryPoints(): number {
    return 1;
  }
}
