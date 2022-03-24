import {IProjectCard} from '../IProjectCard';
import {IActionCard, VictoryPoints} from '../ICard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {ResourceType} from '../../common/ResourceType';
import {Tags} from '../../common/cards/Tags';
import {CardRequirements} from '../CardRequirements';
import {PartyName} from '../../common/turmoil/PartyName';
import {Resources} from '../../common/Resources';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../common/boards/SpaceType';

export class VeneraBase extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.VENERA_BASE,
      cost: 21,
      tags: [Tags.VENUS, Tags.VENUS, Tags.CITY],

      requirements: CardRequirements.builder((b) => b.party(PartyName.UNITY)),
      victoryPoints: VictoryPoints.tags(Tags.VENUS, 1, 2),

      metadata: {
        cardNumber: 'Pf67',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to any Venus card', (ab) => ab.empty().startAction.floaters(1, {secondaryTag: Tags.VENUS}));
          b.br;
          b.production((pb) => pb.megacredits(3)).nbsp.city({secondaryTag: Tags.SPACE}).asterix();
          b.br;
          b.vpText('1 VP per 2 Venus tags you have.');
        }),
        description: 'Requires Unity is ruling or that you have 2 delegates there. Raise your M€ production 3 steps and place a city tile ON THE RESERVED AREA.',
      },
    });
  }

  public canAct(player: Player) {
    return player.getResourceCards(ResourceType.FLOATER).some((card) => card.tags.includes(Tags.VENUS));
  }

  public action(player: Player) {
    player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {restrictedTag: Tags.VENUS}));
    return undefined;
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 3);
    player.game.addCityTile(player, SpaceName.VENERA_BASE, SpaceType.COLONY);
    return undefined;
  }
}
