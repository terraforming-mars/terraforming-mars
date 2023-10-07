import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {Resource} from '../../../common/Resource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class JupiterFloatingStation extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 9,
      tags: [Tag.JOVIAN],
      name: CardName.JUPITER_FLOATING_STATION,
      type: CardType.ACTIVE,
      resourceType: CardResource.FLOATER,
      requirements: {tag: Tag.SCIENCE, count: 3},
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C19',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to a JOVIAN CARD.', (eb) => {
            eb.empty().startAction.floaters(1, {secondaryTag: Tag.JOVIAN});
          }).br;
          b.or().br;
          b.action('Gain 1 M€ for every floater here [MAX 4].', (eb) => {
            eb.empty().startAction;
            eb.megacredits(1).slash().floaters(1).text('[max 4]', Size.SMALL);
          });
        }),
        description: {
          text: 'Requires 3 science tags.',
          align: 'left',
        },
      },
    });
  }


  public canAct(): boolean {
    return true;
  }

  public action(player: IPlayer) {
    return new OrOptions(
      new SelectOption('Add 1 floater to a Jovian card', 'Add floater').andThen(() => {
        player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {
          restrictedTag: Tag.JOVIAN, title: 'Add 1 floater to a Jovian card',
        }));
        return undefined;
      }),
      new SelectOption('Gain 1 M€ per floater here (max 4) ', 'Gain M€').andThen(() => {
        player.stock.add(Resource.MEGACREDITS, Math.min(this.resourceCount, 4), {log: true});
        return undefined;
      }),
    );
  }
}
