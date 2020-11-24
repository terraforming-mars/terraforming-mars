import {expect} from 'chai';
import {VoteOfNoConfidence} from '../../../src/cards/turmoil/VoteOfNoConfidence';
import {Player} from '../../../src/Player';
import {Color} from '../../../src/Color';
import {GameOptions, Game} from '../../../src/Game';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';

describe('VoteOfNoConfidence', function() {
  it('Should play', function() {
    const card = new VoteOfNoConfidence();
    const player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions() as GameOptions;
    const game = new Game('foobar', [player], player, gameOptions);
    expect(card.canPlay(player, game)).is.not.true;

    game.turmoil!.chairman = 'NEUTRAL';
    expect(card.canPlay(player, game)).is.not.true;

    const greens = game.turmoil!.getPartyByName(PartyName.GREENS)!;
    greens.partyLeader = player.id;
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    expect(game.getPlayerById(game.turmoil!.chairman)).to.eq(player);
    expect(player.getTerraformRating()).to.eq(15);
  });
});
