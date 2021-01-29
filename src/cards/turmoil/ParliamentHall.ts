import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Resources} from '../../Resources';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class ParliamentHall extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PARLIAMENT_HALL,
      tags: [Tags.BUILDING],
      cost: 8,

      metadata: {
        cardNumber: 'T08',
        requirements: CardRequirements.builder((b) => b.party(PartyName.MARS)),
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.megacredits(1).slash().building(3).played;
          });
        }),
        description: 'Requires that Mars First are ruling or that you have 2 delegates there. Increase your MC production 1 step for every 3 Building tags you have, including this.',
        victoryPoints: 1,
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (player.game.turmoil !== undefined) {
      return player.game.turmoil.canPlay(player, PartyName.MARS);
    }
    return false;
  }

  public play(player: Player) {
    const amount = Math.floor((player.getTagCount(Tags.BUILDING) + 1) / 3);
    player.addProduction(Resources.MEGACREDITS, amount);
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
