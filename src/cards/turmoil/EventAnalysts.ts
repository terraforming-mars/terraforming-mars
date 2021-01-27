import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class EventAnalysts extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.EVENT_ANALYSTS,
      cost: 5,
      tags: [Tags.SCIENCE],

      metadata: {
        description: 'Requires that Scientists are ruling or that you have 2 delegates there.',
        cardNumber: 'T05',
        requirements: CardRequirements.builder((b) => b.party(PartyName.SCIENTISTS)),
        renderData: CardRenderer.builder((b) => b.effect('You have +1 influence.', (be) => {
          be.startEffect.influence(1);
        })),
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (player.game.turmoil !== undefined) {
      return player.game.turmoil.canPlay(player, PartyName.SCIENTISTS);
    }
    return false;
  }

  public play(player: Player) {
    if (player.game.turmoil) {
      player.game.turmoil.addInfluenceBonus(player);
    }
    return undefined;
  }
}
