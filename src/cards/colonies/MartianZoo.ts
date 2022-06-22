import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardResource} from '../../common/CardResource';
import {IResourceCard} from '../ICard';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../common/Resources';
import {all, played} from '../Options';

export class MartianZoo extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 12,
      tags: [Tags.ANIMAL, Tags.BUILDING],
      name: CardName.MARTIAN_ZOO,
      cardType: CardType.ACTIVE,
      resourceType: CardResource.ANIMAL,
      requirements: CardRequirements.builder((b) => b.cities(2, {all})),
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C24',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play an Earth tag, place an animal here.', (eb) => {
            eb.earth(1, {played}).startEffect.animals(1);
          }).br;
          b.action('Gain 1M€ per animal here.', (eb) => {
            eb.empty().startAction.megacredits(1).slash().animals(1);
          });
        }),
        description: {
          text: 'Requires 2 city tiles in play.',
          align: 'left',
        },
      },
    });
  }

  public override resourceCount: number = 0;

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.tags.includes(Tags.EARTH)) {
      player.addResourceTo(this, card.tags.filter((tag) => tag === Tags.EARTH).length);
    }
  }

  public canAct(): boolean {
    return this.resourceCount > 0;
  }

  public action(player: Player) {
    player.addResource(Resources.MEGACREDITS, this.resourceCount, {log: true});
    return undefined;
  }

  public play() {
    return undefined;
  }
}
