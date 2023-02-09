import {ICorporationCard} from '../corporation/ICorporationCard';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';
import {CardResource} from '../../../common/CardResource';
import {IProjectCard} from '../IProjectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {digit, played} from '../Options';

export class Recyclon extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.RECYCLON,
      tags: [Tag.MICROBE, Tag.BUILDING],
      startingMegaCredits: 38,
      resourceType: CardResource.MICROBE,

      behavior: {
        production: {steel: 1},
        addResources: 1,
      },

      metadata: {
        cardNumber: 'R26',
        description: 'You start with 38 M€ and 1 steel production.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(38).nbsp.production((pb) => pb.steel(1));
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a building tag, including this, gain 1 microbe to this card, or remove 2 microbes here and raise your plant production 1 step.', (eb) => {
              eb.building(1, {played}).colon().microbes(1).or();
              eb.microbes(2, {digit}).startEffect.production((pb) => pb.plants(1));
            });
          });
        }),
      },
    });
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    if (card.tags.includes(Tag.BUILDING) === false || !player.isCorporation(this.name)) {
      return undefined;
    }
    if (this.resourceCount < 2) {
      player.addResourceTo(this);
      return undefined;
    }

    const addResource = new SelectOption('Add a microbe resource to this card', 'Add microbe', () => {
      player.addResourceTo(this);
      return undefined;
    });

    const spendResource = new SelectOption('Remove 2 microbes on this card and increase plant production 1 step', 'Remove microbes', () => {
      player.removeResourceFrom(this, 2);
      player.production.add(Resources.PLANTS, 1);
      return undefined;
    });
    return new OrOptions(spendResource, addResource);
  }
}
