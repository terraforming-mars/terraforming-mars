import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Turmoil} from '../../turmoil/Turmoil';

export class EventAnalysts extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.EVENT_ANALYSTS,
      tags: [Tags.SCIENCE],
      cost: 5,

      requirements: CardRequirements.builder((b) => b.party(PartyName.SCIENTISTS)),
      metadata: {
        description: 'Requires that Scientists are ruling or that you have 2 delegates there.',
        cardNumber: 'T05',
        renderData: CardRenderer.builder((b) => b.effect('You have +1 influence.', (be) => {
          be.startEffect.influence();
        })),
      },
    });
  }

  public play(player: Player) {
    Turmoil.getTurmoil(player.game).addInfluenceBonus(player);
    return undefined;
  }
}
