import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ImprovedMoonConcrete implements IProjectCard {
  public cost = 12;
  public tags = [];
  public cardType = CardType.AUTOMATED;
  public name = CardName.IMPROVED_MOON_CONCRETE;

  public canPlay(): boolean {
    return true;
  }

  public play() {
    return undefined;
  }

  public readonly metadata: CardMetadata = {
    description: 'Effect: When you build a mine on the Moon, you spend 1 steel less. / Spend 2 steel. Raise Mining Rate 1 step.',
    cardNumber: 'M37',
    renderData: CardRenderer.builder((_b) => {}),
  };
}
