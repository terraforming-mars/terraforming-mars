import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {ALL_PARTIES} from '../../turmoil/Turmoil';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {PoliticalAgendas} from '../../turmoil/PoliticalAgendas';

export class ByElection extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.BY_ELECTION,
      tags: [Tags.WILDCARD],

      metadata: {
        cardNumber: 'Y02',
        renderData: CardRenderer.builder((b) => {
          b.text('set ruling party', CardRenderItemSize.SMALL, true).br;
          b.plus().influence(1);
        }),
        description: 'Set the ruling party to one of your choice. Gain 1 influence.',
      },
    });
  }
  public canPlay(_player: Player, game: Game) {
    return game.turmoil !== undefined;
  }
  public play(player: Player, game: Game) {
    const turmoil = game.turmoil;
    if (turmoil === undefined) {
      return;
    }
    turmoil.addInfluenceBonus(player);
    const setRulingParty = new OrOptions();

    setRulingParty.title = 'Select new ruling party';
    setRulingParty.options = [...ALL_PARTIES.map((p) => new SelectOption(
      p.partyName, 'Select', () => {
        turmoil.rulingParty = turmoil.getPartyByName(p.partyName);
        PoliticalAgendas.setNextAgenda(turmoil, game);

        return undefined;
      }),
    )];

    game.defer(new DeferredAction(
      player,
      () => setRulingParty,
    ));

    return undefined;
  }
}
