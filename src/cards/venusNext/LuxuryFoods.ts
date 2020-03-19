import { IProjectCard } from '../IProjectCard';
import { Tags } from '../Tags';
import { CardType } from '../CardType';
import { Player } from '../../Player';
import { CardName } from '../../CardName';

export class LuxuryFoods implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.LUXURY_FOODS;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.VENUS) >= 1 && player.getTagCount(Tags.EARTH) >= 1 && player.getTagCount(Tags.JOVIAN) >= 1;
    }

    public play() {
      return undefined;
    }
    
    public getVictoryPoints() {
      return 2;
    }
}
