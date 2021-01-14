import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';


export class MeatIndustry implements IProjectCard {
    public cost = 5;
    public tags = [Tags.BUILDING];
    public name = CardName.MEAT_INDUSTRY;
    public cardType = CardType.ACTIVE;

    public play() {
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'X30',
      renderData: CardRenderer.builder((b) => {
        b.effect('When you gain an animal to ANY CARD, gain 2MC.', (eb) => {
          eb.animals(1).asterix().startEffect.megacredits(2);
        });
      }),
    }
}
