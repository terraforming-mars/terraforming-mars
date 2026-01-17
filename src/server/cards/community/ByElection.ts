import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';
import {PreludeCard} from '@/server/cards/prelude/PreludeCard';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardName} from '@/common/cards/CardName';
import {Turmoil} from '@/server/turmoil/Turmoil';
import {ChooseRulingPartyDeferred} from '@/server/turmoil/ChooseRulingPartyDeferred';
import {CardRenderer} from '@/server/cards/render/CardRenderer';

export class ByElection extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.BY_ELECTION,
      tags: [Tag.WILD],

      metadata: {
        cardNumber: 'Y02',
        renderData: CardRenderer.builder((b) => {
          b.rulingParty().plus().influence();
        }),
        description: 'Set the ruling party to one of your choice. Gain 1 influence.',
      },
    });
  }
  public override bespokePlay(player: IPlayer) {
    Turmoil.ifTurmoil((player.game), (turmoil) => {
      turmoil.addInfluenceBonus(player);
      player.game.defer(new ChooseRulingPartyDeferred(player, turmoil));
    });

    return undefined;
  }
}
