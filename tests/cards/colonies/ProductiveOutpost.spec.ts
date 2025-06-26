import {expect} from 'chai';
import {ProductiveOutpost} from '../../../src/server/cards/colonies/ProductiveOutpost';
import {Luna} from '../../../src/server/colonies/Luna';
import {Triton} from '../../../src/server/colonies/Triton';
import {cast, runAllActions, testGame} from '../../TestingUtils';
import {Titania} from '../../../src/server/cards/community/Titania';
import {Leavitt} from '../../../src/server/cards/community/Leavitt';
import {inplaceShuffle} from '../../../src/server/utils/shuffle';
import {UnseededRandom} from '../../../src/common/utils/Random';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('ProductiveOutpost', () => {
  it('Should play', () => {
    const card = new ProductiveOutpost();
    const [game, player/* , player2 */] = testGame(2);
    const luna = new Luna();
    const triton = new Triton();

    game.colonies.push(luna, triton);
    game.colonies.forEach((colony) => colony.colonies.push(player.id));

    card.play(player);
    runAllActions(game);
    expect(player.megaCredits).to.eq(2);
    expect(player.titanium).to.eq(1);
  });

  it('order is somewhat deterministic', () => {
    const card = new ProductiveOutpost();
    const [game, player/* , player2 */] = testGame(2);
    const titania = new Titania();
    const luna = new Luna();
    const leavitt = new Leavitt();

    player.megaCredits = 1;
    game.colonies.push(titania, luna, leavitt);
    inplaceShuffle(game.colonies, new UnseededRandom());
    game.colonies.forEach((colony) => colony.colonies.push(player.id));

    card.play(player);
    runAllActions(game);

    expect(player.megaCredits).eq(2);
    cast(player.popWaitingFor(), SelectCard);
  });
});
