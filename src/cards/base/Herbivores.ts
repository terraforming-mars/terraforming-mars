import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../common/Resources';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {IResourceCard} from '../ICard';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Size} from '../../common/cards/render/Size';
import {all} from '../Options';
import {Board} from '../../boards/Board';

export class Herbivores extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.HERBIVORES,
      tags: [Tags.ANIMAL],
      cost: 12,

      resourceType: CardResource.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 2),
      requirements: CardRequirements.builder((b) => b.oxygen(8)),

      metadata: {
        cardNumber: '147',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you place a greenery tile, add an Animal to this card.', (eb) => {
            eb.greenery(Size.MEDIUM, false).startEffect.animals(1);
          }).br;
          b.vpText('1 VP per 2 Animals on this card.');
          b.animals(1).production((pb) => pb.minus().plants(1, {all}));
        }),
        description: {
        // TODO (chosta): revert the original description once a solution for description space is found
          text: 'Requires 8% oxygen. +1 animal to this card. -1 any plant production',
          align: 'left',
        },
      },
    });
  }
  public override resourceCount: number = 0;

  public override canPlay(player: Player): boolean {
    return player.game.someoneCanHaveProductionReduced(Resources.PLANTS, 1);
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (cardOwner.id === activePlayer.id && Board.isGreenerySpace(space)) {
      cardOwner.game.defer(new AddResourcesToCard(cardOwner, CardResource.ANIMAL, {filter: (c) => c.name === this.name}));
    }
  }

  public play(player: Player) {
    player.addResourceTo(this);
    player.game.defer(
      new DecreaseAnyProduction(player, Resources.PLANTS, {count: 1}));
    return undefined;
  }
}
