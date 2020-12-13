import {expect} from 'chai';
import {PoliticalAlliance} from '../../../src/cards/turmoil/PoliticalAlliance';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('PoliticalAlliance', function() {
  let card : PoliticalAlliance; let player : Player; let game : Game; let turmoil: Turmoil;

  beforeEach(function() {
    card = new PoliticalAlliance();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    game = new Game('foobar', [player, redPlayer], player, gameOptions);
    turmoil = game.turmoil!;
  });

  it('Can\'t play', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    greens.partyLeader = player.id;
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    const reds = turmoil.getPartyByName(PartyName.REDS)!;
    greens.partyLeader = player.id;
    reds.partyLeader = player.id;
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
