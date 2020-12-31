import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {GlobalParameter} from '../../GlobalParameter';

export class ColonizerTrainingCamp implements IProjectCard {
    public cost = 8;
    public tags = [Tags.JOVIAN, Tags.BUILDING];
    public name = CardName.COLONIZER_TRAINING_CAMP;
    public cardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.checkMaxRequirements(player, GlobalParameter.OXYGEN, 5);
    }
    public play() {
      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
    public metadata: CardMetadata = {
      description: 'Oxygen must be 5% or less.',
      cardNumber: '001',
      requirements: CardRequirements.builder((b) => b.oxygen(5).max()),
      victoryPoints: 2,
    };
}
