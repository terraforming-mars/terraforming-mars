import { IProjectCard } from '../IProjectCard';
import { Tags } from '../Tags';
import { CardType } from '../CardType';
import { Player } from '../../Player';

export class Omnicourt implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = 'Omnicourt';
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.VENUS) >= 1 && player.getTagCount(Tags.EARTH) >= 1 && player.getTagCount(Tags.JOVIAN) >= 1;
    }
    
    public play(player: Player) {
      player.terraformRating += 2;
      return undefined;
    }
}
