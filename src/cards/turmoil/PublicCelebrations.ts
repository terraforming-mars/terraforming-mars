import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class PublicCelebrations extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 8,
      tags: [],
      name: CardName.PUBLIC_CELEBRATIONS,
      cardType: CardType.EVENT,

      requirements: CardRequirements.builder((b) => b.chairman()),
      metadata: {
        description: 'Requires that you are Chairman.',
        cardNumber: 'T10',
        victoryPoints: 2,
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (player.game.turmoil !== undefined) {
      return player.game.turmoil.chairman === player.id;
    }
    return false;
  }

  public play() {
    return undefined;
  }

  public getVictoryPoints() {
    return 2;
  }
}
