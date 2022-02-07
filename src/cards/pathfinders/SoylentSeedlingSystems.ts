import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tags} from '../../common/cards/Tags';
import {Size} from '../render/Size';
import {played} from '../Options';
import {CorporationCard} from '../corporation/CorporationCard';
import {ResourceType} from '../../common/ResourceType';
import {ISpace} from '../../boards/ISpace';
import {Board} from '../../boards/Board';

export class SoylentSeedlingSystems extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.SOYLENT_SEEDLING_SYSTEMS,
      tags: [Tags.SCIENCE, Tags.PLANT],
      startingMegaCredits: 38,
      resourceType: ResourceType.SEED,

      metadata: {
        cardNumber: 'PfC8',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(38).seed().seed().br;
          b.effect('When you place a greenery tile, add 1 seed resource to this card.', (eb) => {
            eb.greenery().startEffect.seed();
          }).br;
          b.effect('When paying for a plant card, or the STANDARD GREENERY PROJECT, seeds here may be used as 5 M€ each.', (eb) => {
            eb.plants(1, {played}).slash().greenery(Size.MEDIUM, true).startEffect.seed().equals().megacredits(5);
          }).br;
        }),
        description: 'You starrt with 38M€ and 2 seeds on this card.',
      },
    });
  }

  public override resourceCount = 0;

  public play() {
    this.resourceCount += 2;
    return undefined;
  }

  public onTilePlaced(cardOwner: Player, activePlayer: Player, space: ISpace) {
    if (cardOwner.id !== activePlayer.id) {
      return;
    }
    if (Board.isGreenerySpace(space)) {
      cardOwner.addResourceTo(this, {log: true});
    }
  }
}

