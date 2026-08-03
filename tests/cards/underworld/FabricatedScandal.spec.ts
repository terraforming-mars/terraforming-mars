import {expect} from 'chai';
import {FabricatedScandal} from '../../../src/server/cards/underworld/FabricatedScandal';
import {testGame} from '../../TestGame';
import {cast} from '@/common/utils/utils';
import {runAllActions, setRulingParty} from '../../TestingUtils';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('FabricatedScandal', () => {
  it('Should play', () => {
    const card = new FabricatedScandal();
    const [/* game */, ...players] = testGame(4);

    players[0].setTerraformRating(20);
    players[1].setTerraformRating(18);
    players[2].setTerraformRating(22);
    players[3].setTerraformRating(23);

    const player = players[0];

    player.underworldData.corruption = 0;

    cast(card.play(player), undefined);

    expect(player.underworldData.corruption).to.eq(1);
    expect(players.map((p) => p.terraformRating)).deep.eq([20, 19, 22, 22]);
  });

  it('Reds: lowest-TR player gains TR based on their own ability to pay', () => {
    const card = new FabricatedScandal();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});

    setRulingParty(game, PartyName.REDS);

    player.setTerraformRating(22);
    player2.setTerraformRating(18);

    // The lowest-TR player (player2) can afford the Reds tax, but the card-playing
    // player cannot. The TR gain must depend on player2's funds, not the card player's.
    player.stock.megacredits = 0;
    player2.stock.megacredits = 3;

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.terraformRating).eq(21);
    expect(player2.terraformRating).eq(19);
    expect(player2.stock.megacredits).eq(0);
  });
});
