import {CardRenderItemType} from './CardRenderItemType';
import {CardRenderItem} from './CardRenderItem';

export class CardRenderDynamicVictoryPoints {
  public targetOneOrMore: boolean = false; // marking target to be one or more res (Search for Life)
  constructor(public item: CardRenderItem, public points: number = 1, public target: number = 1) {
    if (this.points > this.target) {
      throw new Error(`Illegal victory points setup. Target points have to be greater or equal points and not: ${this.points}/${this.target}`);
    }
  }

  public getPointsHtml(): string {
    if (this.target === this.points) return `${this.target}/`;
    return `${this.points}/${this.target}`;
  }
  public static asteroids(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.ASTEROIDS), points, target);
  }

  public static microbes(points: number, target: number): CardRenderDynamicVictoryPoints {
    return new CardRenderDynamicVictoryPoints(new CardRenderItem(CardRenderItemType.MICROBES), points, target);
  }
}

