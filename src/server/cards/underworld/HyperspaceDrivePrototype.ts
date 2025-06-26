import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';

export class HyperspaceDrivePrototype extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.HYPERSPACE_DRIVE_PROTOTYPE,
      cost: 11,
      tags: [Tag.SCIENCE, Tag.SPACE],

      requirements: {tag: Tag.SCIENCE, count: 3},

      metadata: {
        cardNumber: 'U52',
        renderData: CardRenderer.builder((b) => {
          b.resource(CardResource.FIGHTER).or().titanium(1).asterix().br;
          b.resource(CardResource.SCIENCE).or().tr(1).asterix().br;
        }),
        description: 'Requires that 3 science tags. ' +
        'Put a fighter resource on a card you own, or gain 1 titanium if you have no suitable card. ' +
        'Put a science resource on a card you own, or gain 1 TR if you have no suitable card.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const fighterCards = player.getResourceCards(CardResource.FIGHTER);
    if (fighterCards.length > 0) {
      player.game.defer(new AddResourcesToCard(player, CardResource.FIGHTER));
    } else {
      player.game.log('${0} has no fighter resource cards and gained 1 titanium.', (b) => b.player(player));
      player.stock.titanium += 1;
    }
    const scienceCards = player.getResourceCards(CardResource.SCIENCE);
    if (scienceCards.length > 0) {
      player.game.defer(new AddResourcesToCard(player, CardResource.SCIENCE));
    } else {
      player.game.log('${0} has no science cards and gained 1 TR.', (b) => b.player(player));
      player.increaseTerraformRating();
    }
    return undefined;
  }
}
