import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {played} from '../Options';

export class VenusianAnimals extends Card implements IResourceCard {
  constructor() {
    super({
      name: CardName.VENUSIAN_ANIMALS,
      cardType: CardType.ACTIVE,
      tags: [Tags.VENUS, Tags.ANIMAL, Tags.SCIENCE],
      cost: 15,
      resourceType: ResourceType.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 1),

      requirements: CardRequirements.builder((b) => b.venus(18)),
      metadata: {
        cardNumber: '259',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Science tag, including this, add 1 Animal to this card.', (eb)=> {
            eb.science(1, {played}).startEffect.animals(1);
          }).br;
          b.vpText('1 VP per Animal on this card.');
        }),
        description: 'Requires Venus 18%',
      },
    });
  };
  public override resourceCount: number = 0;
  public play() {
    return undefined;
  }
  public onCardPlayed(player: Player, card: IProjectCard): void {
    player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.SCIENCE).length);
  }
}
