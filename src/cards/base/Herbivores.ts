import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ISpace} from '../../boards/ISpace';
import {ResourceType} from '../../ResourceType';
import {TileType} from '../../TileType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';

export class Herbivores extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.HERBIVORES,
      tags: [Tags.ANIMAL],
      cost: 12,
      resourceType: ResourceType.ANIMAL,

      metadata: {
        cardNumber: '147',
        requirements: CardRequirements.builder((b) => b.oxygen(8)),
        renderData: CardRenderer.builder((b) => {
          b.effect('When you place a greenery tile, add an Animal to this card.', (eb) => {
            eb.greenery().startEffect.animals(1);
          }).br;
          b.vpText('1 VP per 2 Animals on this card.');
          b.animals(1).production((pb) => pb.minus().plants(1).any);
        }),
        description: {
        // TODO (chosta): revert the original description once a solution for description space is found
          text: 'Requires 8% oxygen. +1 animal to this card. -1 any plant production',
          align: 'left',
        },
        victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 2),
      },
    });
  }
    public resourceCount: number = 0;

    public canPlay(player: Player, game: Game): boolean {
      return game.checkMinRequirements(player, GlobalParameter.OXYGEN, 8) && game.someoneHasResourceProduction(Resources.PLANTS, 1);
    }

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }

    public onTilePlaced(cardOwner: Player, space: ISpace) {
      if (space.player === cardOwner && space.tile !== undefined && space.tile.tileType === TileType.GREENERY) {
        cardOwner.addResourceTo(this);
      }
    }
    public play(player: Player, game: Game) {
      player.addResourceTo(this);
      game.defer(new DecreaseAnyProduction(player, Resources.PLANTS, 1));
      return undefined;
    }
}
