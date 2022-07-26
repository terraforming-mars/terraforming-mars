import {expect} from 'chai';
import {PoliticalAlliance} from '../../../src/cards/turmoil/PoliticalAlliance';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('PoliticalAlliance', function() {
  let card: PoliticalAlliance;
  let player: Player;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new PoliticalAlliance();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('gameid', [player, redPlayer], player, gameOptions);
    turmoil = game.turmoil!;
  });

  it('Can not play', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    greens.partyLeader = player.id;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    const reds = turmoil.getPartyByName(PartyName.REDS)!;
    greens.partyLeader = player.id;
    reds.partyLeader = player.id;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getTerraformRating()).to.eq(21);
  });
});
