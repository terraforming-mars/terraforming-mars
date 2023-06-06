import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
//import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICard} from '../ICard';
//import {ITagCount} from '../../../common/cards/ITagCount';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {played} from '../Options';



export class JovianMegaReseachBay extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.JOVIAN_MEGA_RESEARCH_BAY,
      cost: 46,
      tags: [Tag.RADIATION, Tag.JOVIAN, Tag.SPACE],
      victoryPoints: 'special',

      behavior: {
        tr: 1,
      },

      action: {
        spend: {titanium: 1},
        drawCard: 1,
      },
      
      metadata: {
        cardNumber: 'N72',
        renderData: CardRenderer.builder((b) => {
          b.effect('Whenever you play a card with a radiation tag, including this, draw a card.', (eb) => {
            eb.radiation({amount: 1, played}).startEffect.cards(1);
          }).br;
          b.action('Spend 1 titanium to draw a card.', (eb) => {
            eb.titanium(1).startAction.cards(1);
        })
        }),
        description: 'Raise your TR 1 step. Score 1VP for every 2 radiation and 2 Jovian tags you have.',
        victoryPoints: CardRenderDynamicVictoryPoints.tag(Tag.JOVIAN,1,2,Tag.RADIATION,1,2),
      },
    });
  }

  public onCardPlayed(player: Player, card: ICard) {
    if (card.tags.includes(Tag.RADIATION)) {
      player.drawCard();
    }
  }

  public override getVictoryPoints(player: Player): number {
    const tags = player.tags.getAllTags();
    let radiationCount = 0;
    let jovianCount = 0;
  
    tags.forEach((tagData) => {
      if (tagData.tag === Tag.RADIATION) {
        radiationCount += tagData.count;
      } else if (tagData.tag === Tag.JOVIAN) {
        jovianCount += tagData.count;
      }
    });
  
    const radiationPoints = Math.floor(radiationCount / 2);
    const jovianPoints = Math.floor(jovianCount / 2);
  
    const Points = radiationPoints + jovianPoints;
  
    return Points;
}
}