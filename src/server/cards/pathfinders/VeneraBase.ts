import {IProjectCard} from '../IProjectCard';
import {IActionCard, VictoryPoints} from '../ICard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../../common/turmoil/PartyName';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../../common/boards/SpaceType';

export class VeneraBase extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.VENERA_BASE,
      cost: 21,
      tags: [Tag.VENUS, Tag.VENUS, Tag.CITY],

      requirements: CardRequirements.builder((b) => b.party(PartyName.UNITY)),
      victoryPoints: VictoryPoints.tags(Tag.VENUS, 1, 2),

      behavior: {
        production: {megacredits: 3},
        city: {space: SpaceName.VENERA_BASE, type: SpaceType.COLONY},
      },

      metadata: {
        cardNumber: 'Pf67',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to ANY Venus card', (ab) => ab.empty().startAction.floaters(1, {secondaryTag: Tag.VENUS}).asterix());
          b.br;
          b.production((pb) => pb.megacredits(3)).nbsp.city({secondaryTag: Tag.SPACE}).asterix();
          b.br;
          b.vpText('1 VP per 2 Venus tags you have.');
        }),
        description: 'Requires Unity is ruling or that you have 2 delegates there. Raise your M€ production 3 steps and place a city tile ON THE RESERVED AREA.',
      },
    });
  }

  public canAct(player: Player) {
    return player.getResourceCards(CardResource.FLOATER).some((card) => card.tags.includes(Tag.VENUS));
  }

  public action(player: Player) {
    player.game.defer(new AddResourcesToCard(player, CardResource.FLOATER, {restrictedTag: Tag.VENUS}));
    return undefined;
  }
}
