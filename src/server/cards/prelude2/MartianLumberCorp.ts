import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {SelectCard} from '../../inputs/SelectCard';
import {ICard} from '../ICard';
import {CardRequirements} from '../requirements/CardRequirements';

export class MartianLumberCorp extends Card {
  constructor() {
    super({
      name: CardName.MARTIAN_LUMBER_CORP,
      type: CardType.ACTIVE,
      tags: [Tag.BUILDING, Tag.PLANT],
      cost: 6,

      behavior: {
        production: {plants: 1},
      },

      requirements: CardRequirements.builder((b) => b.greeneries(2)),

      /*
https://discord.com/channels/737945098695999559/742826825922904225/1153319755458031658
      Requires that you have 2 greenery tiles. Increase plant production 1 step.
      Effect: Plants may be spent for buliding tags, 3 MC.
      b.building({played}).startEffect.plants(1).equals().megaCredits(3)
      */
      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you trade, first increase that colony tile track 2 steps.', (eb) =>
            eb.trade().startEffect.text('+2')).br;
          b.text('3').diverseTag().asterix().br;
          b.plainText('(Add a resource to 3 different cards.').br;
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer): PlayerInput | undefined {
    function addResources(cards: ReadonlyArray<ICard>): void {
      for (const card of cards) {
        player.addResourceTo(card, {qty: 1, log: true});
      }
    }

    const cards = player.getResourceCards();
    if (cards.length <= 3) {
      addResources(cards);
      return undefined;
    }

    return new SelectCard('Select 3 cards to gain 1 resource each', 'Add Resources', cards, (cards) => {
      addResources(cards);
      return undefined;
    }, {min: 3, max: 3});
  }
}
