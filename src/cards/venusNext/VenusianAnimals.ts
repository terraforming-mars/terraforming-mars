import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {GlobalParameter} from '../../GlobalParameter';
import {Card} from '../Card';

export class VenusianAnimals extends Card implements IResourceCard {
  constructor() {
    super({
      name: CardName.VENUSIAN_ANIMALS,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS, Tags.ANIMAL, Tags.SCIENCE],
      cost: 15,
      resourceType: ResourceType.ANIMAL,

      requirements: CardRequirements.builder((b) => b.venus(18)),
      metadata: {
        cardNumber: '259',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Science tag, including this, add 1 Animal to this card.', (eb)=> {
            eb.science().played.startEffect.animals(1);
          }).br;
          b.vpText('1 VP per Animal on this card.');
        }),
        description: 'Requires Venus 18%',
        victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 1),
      },
    });
  };
  public resourceCount: number = 0;
  public canPlay(player: Player): boolean {
    return player.game.checkMinRequirements(player, GlobalParameter.VENUS, 18);
  }
  public play() {
    return undefined;
  }
  public onCardPlayed(player: Player, card: IProjectCard): void {
    player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.SCIENCE).length);
  }
  public getVictoryPoints(): number {
    return this.resourceCount;
  }
}
