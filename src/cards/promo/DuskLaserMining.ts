import { IProjectCard } from '../IProjectCard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { Resources } from '../../Resources';

export class DuskLaserMining implements IProjectCard {
    public name: CardName = CardName.DUSK_LASER_MINING;
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 2 && player.getProduction(Resources.ENERGY) >= 1;
    }

    public play(player: Player) {
        player.setProduction(Resources.ENERGY, -1);
        player.setProduction(Resources.TITANIUM);
        player.titanium += 4;
        return undefined;
    }

}
