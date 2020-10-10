import { IProjectCard } from '../IProjectCard';
import { Tags } from '../Tags';
import { CardType } from '../CardType';
import { Player } from '../../Player';
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class MiningQuota implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.MINING_QUOTA;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      return  player.checkMultipleTagPresence([Tags.VENUS, Tags.EARTH, Tags.JOVIAN]);
    }
    
    public play(player: Player) {
      player.addProduction(Resources.STEEL, 2);
      return undefined;
    }
}
