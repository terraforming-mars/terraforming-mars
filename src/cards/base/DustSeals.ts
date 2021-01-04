import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {GlobalParameter} from '../../GlobalParameter';

export class DustSeals extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.DUST_SEALS,
      cost: 2,

      metadata: {
        description: 'Requires 3 or less ocean tiles.',
        cardNumber: '119',
        requirements: CardRequirements.builder((b) => b.oceans(3).max()),
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMaxRequirements(player, GlobalParameter.OCEANS, 3);
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
