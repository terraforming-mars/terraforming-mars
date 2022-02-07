import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {ResourceType} from '../../common/ResourceType';
import {CardName} from '../../common/cards/CardName';
import {Priority} from '../../deferredActions/DeferredAction';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {IResourceCard} from '../ICard';
import {Board} from '../../boards/Board';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {all} from '../Options';

export class Pets extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PETS,
      tags: [Tags.EARTH, Tags.ANIMAL],
      cost: 10,
      resourceType: ResourceType.ANIMAL,

      victoryPoints: VictoryPoints.resource(1, 2),

      metadata: {
        cardNumber: '172',
        renderData: CardRenderer.builder((b) => {
          b.effect('When any City tile is placed, add an Animal to this card.', (eb) => {
            eb.city({size: Size.SMALL, all}).startEffect.animals(1);
          }).br;
          b.animals(1).br;
          b.text('Animals may not be removed from this card', Size.SMALL, true).br;
          b.vpText('1 VP per 2 Animals here.');
        }),
        description: {text: 'Add 1 Animal to this card.', align: 'left'},
      },
    });
  }

  public override resourceCount: number = 0;

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (Board.isCitySpace(space)) {
      cardOwner.game.defer(
        new AddResourcesToCard(cardOwner, ResourceType.ANIMAL, {filter: (c) => c.name === this.name}),
        cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : undefined,
      );
    }
  }

  public play(player: Player) {
    player.addResourceTo(this);
    return undefined;
  }
}
