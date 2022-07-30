import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../common/boards/SpaceType';
import {Resources} from '../../common/Resources';
import {IActionCard, ICard, IResourceCard} from '../ICard';
import {CardResource} from '../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';

export class Stratopolis extends Card implements IActionCard, IResourceCard {
  constructor() {
    super({
      name: CardName.STRATOPOLIS,
      cardType: CardType.ACTIVE,
      tags: [Tags.CITY, Tags.VENUS],
      cost: 22,

      resourceType: CardResource.FLOATER,
      victoryPoints: VictoryPoints.resource(1, 3),
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),

      metadata: {
        cardNumber: '248',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 2 floaters to ANY VENUS CARD.', (eb) => {
            eb.empty().startAction.floaters(2, {secondaryTag: Tags.VENUS});
          }).br;
          b.production((pb) => pb.megacredits(2)).city().asterix();
          b.vpText('1 VP for every 3rd Floater on this card.');
        }),
        description: {
          text: 'Requires 2 science tags. Increase your M€ production 2 steps. Place a City tile ON THE RESERVED AREA',
          align: 'left',
        },
      },
    });
  }
  public override resourceCount: number = 0;

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 2);
    player.game.addCityTile(player, SpaceName.STRATOPOLIS, SpaceType.COLONY);
    return undefined;
  }

  public getResCards(player: Player): ICard[] {
    const resourceCards = player.getResourceCards(CardResource.FLOATER);
    return resourceCards.filter((card) => card.tags.some((cardTag) => cardTag === Tags.VENUS));
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: Player) {
    const cards = this.getResCards(player);

    if (cards.length === 1) {
      player.addResourceTo(cards[0], {qty: 2, log: true});
      return undefined;
    }

    return new SelectCard(
      'Select card to add 2 floaters',
      'Add floater(s)',
      cards,
      ([card]) => {
        player.addResourceTo(card, {qty: 2, log: true});
        return undefined;
      },
    );
  }
}
