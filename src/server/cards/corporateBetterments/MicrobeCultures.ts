import {Card} from '../Card';
import {IActionCard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';

export class MicrobeCultures extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MICROBE_CULTURES,
      cost: 4,
      victoryPoints: 1,

      requirements: {tag: Tag.MICROBE, count: 2},

      metadata: {
        cardNumber: 'B25',
        description: 'Requires you own at least 2 Microbe tags.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 Heat to add 1 Microbe to any card, OR spend 5 Heat to add 2 Microbes to any card.', (ab) => {
            ab.heat(1).startAction.resource(CardResource.MICROBE).asterix().br;
            ab.or().br;
            ab.heat(5).startAction.resource(CardResource.MICROBE, 2).asterix();
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.heat >= 1;
  }

  public action(player: IPlayer) {
    if (player.heat < 5) {
      // Can only do the 1-heat option
      player.stock.deduct(Resource.HEAT, 1);
      player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 1}));
      return undefined;
    }
    return new OrOptions(
      new SelectOption('Spend 1 Heat to add 1 Microbe to any card', 'Spend 1 Heat').andThen(() => {
        player.stock.deduct(Resource.HEAT, 1);
        player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 1}));
        return undefined;
      }),
      new SelectOption('Spend 5 Heat to add 2 Microbes to any card', 'Spend 5 Heat').andThen(() => {
        player.stock.deduct(Resource.HEAT, 5);
        player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {count: 2}));
        return undefined;
      }),
    );
  }
}
