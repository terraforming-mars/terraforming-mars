import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class TitanShuttles extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 23,
      tags: [Tag.JOVIAN, Tag.SPACE],
      name: CardName.TITAN_SHUTTLES,
      type: CardType.ACTIVE,
      resourceType: CardResource.FLOATER,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C45',
        renderData: CardRenderer.builder((b) => {
          b.arrow().resource(CardResource.FLOATER, {amount: 2, secondaryTag: Tag.JOVIAN}).nbsp.or().br;
          b.text('x').resource(CardResource.FLOATER).arrow().text('x').titanium(1).br;

          b.plainText('Action: Add 2 floaters to ANY JOVIAN CARD, or spend any number of floaters here to gain the same number of titanium.', /* parens */ true);
        }),
      },
    });
  }


  public canAct(): boolean {
    return true;
  }

  public action(player: IPlayer) {
    if (this.resourceCount === 0) {
      player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 2, restrictedTag: Tag.JOVIAN, title: 'Add 2 floaters to a Jovian card'}));
      return undefined;
    }

    return new OrOptions(
      new SelectOption('Add 2 floaters to a Jovian card', 'Add floaters').andThen(() => {
        player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {count: 2, restrictedTag: Tag.JOVIAN}));
        return undefined;
      }),
      new SelectAmount(
        'Remove X floaters on this card to gain X titanium', 'Remove floaters',
        1, this.resourceCount, true,
      ).andThen((amount) => {
        player.removeResourceFrom(this, amount);
        player.titanium += amount;
        player.game.log('${0} removed ${1} floaters to gain ${2} titanium', (b) => b.player(player).number(amount).number(amount));
        return undefined;
      }),
    );
  }
}
