import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Arklight extends Card implements CorporationCard, IResourceCard {
  constructor() {
    super({
      name: CardName.ARKLIGHT,
      tags: [Tags.ANIMAL],
      startingMegaCredits: 45,
      resourceType: ResourceType.ANIMAL,
      cardType: CardType.CORPORATION,

      metadata: {
        cardNumber: 'R04',
        description: 'You start with 45 MC. Increase your MC production 2 steps. 1 VP per 2 animals on this card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(45).nbsp.production((pb) => pb.megacredits(2));
          b.corpBox('effect', (ce) => {
            ce.effect('When you play an animal or plant tag, including this, add 1 animal to this card.', (eb) => {
              eb.animals(1).played.slash().plants(1).played.startEffect.animals(1);
            });
            ce.vSpace(); // to offset the description to the top a bit so it can be readable
          });
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 2),
      },
    });
  }

    public resourceCount = 0;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);
      player.addResourceTo(this);
      return undefined;
    }

    public onCardPlayed(player: Player, card: IProjectCard): void {
      if (player.isCorporation(CardName.ARKLIGHT)) {
        player.addResourceTo(this, card.tags.filter((cardTag) => cardTag === Tags.ANIMAL || cardTag === Tags.PLANT).length);
      }
    }

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }
}
