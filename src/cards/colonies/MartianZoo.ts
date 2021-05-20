import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {IResourceCard} from '../ICard';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';

export class MartianZoo extends Card implements IProjectCard, IResourceCard {
  constructor() {
    super({
      cost: 12,
      tags: [Tags.ANIMAL, Tags.BUILDING],
      name: CardName.MARTIAN_ZOO,
      cardType: CardType.ACTIVE,
      resourceType: ResourceType.ANIMAL,

      requirements: CardRequirements.builder((b) => b.cities(2).any()),
      metadata: {
        cardNumber: 'C24',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play an Earth tag, place an animal here.', (eb) => {
            eb.earth().played.startEffect.animals(1);
          }).br;
          b.action('Gain 1M€ per animal here.', (eb) => {
            eb.empty().startAction.megacredits(1).slash().animals(1);
          });
        }),
        description: {
          text: 'Requires 2 city tiles in play.',
          align: 'left',
        },
        victoryPoints: 1,
      },
    });
  }

  public resourceCount: number = 0;

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

  public getVictoryPoints(): number {
    return 1;
  }
}
