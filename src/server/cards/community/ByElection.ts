import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {Turmoil} from '../../turmoil/Turmoil';
import {ChooseRulingPartyDeferred} from '../../turmoil/ChooseRulingPartyDeferred';
import {CardRenderer} from '../render/CardRenderer';

export class ByElection extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.BY_ELECTION,
      tags: [Tag.WILD],

      metadata: {
        cardNumber: 'Y02',
        renderData: CardRenderer.builder((b) => {
          b.rulingParty().plus().influence();
          b.br;
          b.plainText('Set the ruling party to one of your choice. Gain 1 influence.'),
          b.br;
          b.plainText('After being played, when you perform an action, the wild tag counts as any tag of your choice.');
        }),
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
