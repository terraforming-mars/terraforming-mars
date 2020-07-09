import { IProjectCard } from '../IProjectCard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { Game } from '../../Game';

export class MagneticShield implements IProjectCard {
    public name: CardName = CardName.MAGNETIC_SHIELD;
    public cost: number = 26;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.ENERGY) >= 2;
    }

    public play(player: Player, game: Game) {
        player.increaseTerraformRatingSteps(4, game);
        return undefined;
    }
}
