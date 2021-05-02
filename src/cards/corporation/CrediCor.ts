import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../StandardProjectCard';

export class CrediCor extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.CREDICOR,
      startingMegaCredits: 57,

      metadata: {
        cardNumber: 'R08',
        description: 'You start with 57 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(57);
          b.corpBox('effect', (ce) => {
            ce.effect('After you pay for a card or standard project with a basic cost of 20M€ or more, you gain 4 M€.', (eb) => {
              eb.minus().megacredits(20).startEffect.megacredits(4);
            });
          });
        }),
      },
    });
  }
  private effect(player: Player, card: IProjectCard | StandardProjectCard): void {
    if (player.corporationCard !== undefined && player.corporationCard.name === this.name && card.cost >= 20) {
      player.megaCredits += 4;
    }
  }
  public onCardPlayed(player: Player, card: IProjectCard) {
    this.effect(player, card);
  }
  public onStandardProject(player: Player, project: StandardProjectCard) {
    this.effect(player, project);
  }
  public play() {
    return undefined;
  }
}
