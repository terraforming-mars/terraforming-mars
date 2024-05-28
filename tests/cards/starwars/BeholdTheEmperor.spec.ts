import {expect} from 'chai';
import {BeholdTheEmperor} from '../../../src/server/cards/starwars/BeholdTheEmperor';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Phase} from '../../../src/common/Phase';
import {runAllActions} from '../../TestingUtils';

describe('BeholdTheEmperor', () => {
  let card: BeholdTheEmperor;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new BeholdTheEmperor();
    [game, player, player2] = testGame(2, {turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('Can play', () => {
    turmoil.chairman = 'NEUTRAL';

    expect(card.canPlay(player)).is.false;

    turmoil.chairman = player2;

    expect(card.canPlay(player)).is.false;

    turmoil.chairman = player;

    expect(card.canPlay(player)).is.true;
  });

  it('Correctly run end of generation', () => {
    player.setTerraformRating(20);
    player2.setTerraformRating(20);
    const kelvinists = turmoil.getPartyByName(PartyName.KELVINISTS);
    const reds = turmoil.getPartyByName(PartyName.REDS);
    const greens = turmoil.getPartyByName(PartyName.GREENS);

    turmoil.parties.forEach((party) => {
      party.delegates.clear();
    });

    turmoil.chairman = player;
    turmoil.rulingParty = kelvinists;

    turmoil.sendDelegateToParty(player2, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player2, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player2, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player2, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player2, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player, PartyName.REDS, game);
    turmoil.sendDelegateToParty(player, PartyName.GREENS, game);

    card.play(player);

    expect(kelvinists.delegates.size).eq(0);
    expect(reds.delegates.size).eq(6);
    expect(greens.delegates.size).eq(1);

    game.phase = Phase.SOLAR;
    turmoil.endGeneration(game);
    runAllActions(game);

    expect(turmoil.chairman).to.eq(player);
    expect(player.getTerraformRating()).to.eq(20);
    expect(player2.getTerraformRating()).to.eq(19);

    expect(turmoil.rulingParty).to.eq(kelvinists);
    expect(turmoil.dominantParty).to.eq(reds);
    // Using greaterThan to ameliorate the global events.
    expect(kelvinists.delegates.size).greaterThanOrEqual(0);
    expect(reds.delegates.size).greaterThanOrEqual(6);
    expect(greens.delegates.size).greaterThanOrEqual(1);

    expect(turmoil.delegateReserve.get(player)).to.equal(5);
    expect(turmoil.delegateReserve.get(player2)).to.equal(2);
  });
});
