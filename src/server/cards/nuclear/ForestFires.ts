import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import { max } from '../Options';
import { Player } from '../../Player';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import { RemoveGreeneryTile } from '../../deferredActions/RemoveGreeneryTile';
import {Size} from '../../../common/cards/render/Size';

export class ForestFires extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.FOREST_FIRES,
      type: CardType.ACTIVE,
      tags: [Tag.MICROBE],
      cost: 18,
      resourceType: CardResource.MICROBE,
      victoryPoints: {resourcesHere: {}, per: 2},

      behavior: {
        global: {oxygen: -1},
      },

      requirements: CardRequirements.builder((b) => b.oxygen(10, {max})),
      metadata: {
        cardNumber: 'N34',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to this card.', (eb)=> {
            eb.empty().startAction.microbes(1);
          }).br;
          b.minus().greenery(Size.MEDIUM, true, true).br;
          b.vpText('1 VP for every 2nd Microbe on this card.');
        }),
        description: {
          text:'Oxygen must be less than 10%. Remove any greenery tile from Mars and decrease oxygen 1 step.',
          align: 'left'}
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    player.game.defer(new AddResourcesToCard(player, CardResource.MICROBE, {filter: (c) => c.name === this.name}));
    player.game.log('${0} add a microbe to card ${1}.', (b) => b.player(player).card(this));
    return undefined;
  }

  public override bespokeCanPlay(player: Player): boolean {
    return player.game.canRemoveGreenery();
  }
  

  public override bespokePlay(player: Player) {
      player.game.defer(new RemoveGreeneryTile(player)), 'Remove Greenery Tile'
    return undefined;
  }

}
