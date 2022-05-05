import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../common/cards/CardName';
import {ALL_PARTIES, Turmoil} from '../../turmoil/Turmoil';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../common/cards/render/Size';
import {PoliticalAgendas} from '../../turmoil/PoliticalAgendas';

export class ByElection extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.BY_ELECTION,
      tags: [Tags.WILD],

      metadata: {
        cardNumber: 'Y02',
        renderData: CardRenderer.builder((b) => {
          b.text('set ruling party', Size.SMALL, true).br;
          b.plus().influence();
        }),
        description: 'Set the ruling party to one of your choice. Gain 1 influence.',
      },
    });
  }
  public override canPlay() {
    return true;
  }

  public play(player: Player) {
    const turmoil = Turmoil.getTurmoil(player.game);

    turmoil.addInfluenceBonus(player);
    const setRulingParty = new OrOptions();

    setRulingParty.title = 'Select new ruling party';
    setRulingParty.options = [...ALL_PARTIES.map((p) => new SelectOption(
      p.partyName, 'Select', () => {
        turmoil.rulingParty = turmoil.getPartyByName(p.partyName);
        PoliticalAgendas.setNextAgenda(turmoil, player.game);

        return undefined;
      }),
    )];

    player.game.defer(new SimpleDeferredAction(
      player,
      () => setRulingParty,
    ));

    return undefined;
  }
}
