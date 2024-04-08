import {expect} from 'chai';
import {PoliticalAlliance} from '../../../src/server/cards/turmoil/PoliticalAlliance';
import {Game} from '../../../src/server/Game';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';

describe('PoliticalAlliance', function() {
  let card: PoliticalAlliance;
  let player: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new PoliticalAlliance();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player, {turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('Can not play', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS);
    greens.partyLeader = player;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS);
    const reds = turmoil.getPartyByName(PartyName.REDS);
    greens.partyLeader = player;
    reds.partyLeader = player;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
