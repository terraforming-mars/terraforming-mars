import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {GlobalParameter} from '../../GlobalParameter';

export class ColonizerTrainingCamp extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.COLONIZER_TRAINING_CAMP,
      tags: [Tags.JOVIAN, Tags.BUILDING],
      cost: 8,

      metadata: {
        description: 'Oxygen must be 5% or less.',
        cardNumber: '001',
        requirements: CardRequirements.builder((b) => b.oxygen(5).max()),
        victoryPoints: 2,
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMaxRequirements(player, GlobalParameter.OXYGEN, 5);
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }
}
