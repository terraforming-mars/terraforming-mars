import {expect} from 'chai';
import {ToolWithTheFirstOrder} from '../../../src/server/cards/starwars/ToolWithTheFirstOrder';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {doWait, runAllActions} from '../../TestingUtils';
import {Phase} from '../../../src/common/Phase';
import {Ants} from '../../../src/server/cards/base/Ants';
import {BactoviralResearch} from '../../../src/server/cards/promo/BactoviralResearch';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';
import {PlayerInput} from '../../../src/server/PlayerInput';
import {Payment} from '../../../src/common/inputs/Payment';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast} from '../../../src/common/utils/utils';

describe('ToolWithTheFirstOrder', () => {
  let card: ToolWithTheFirstOrder;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ToolWithTheFirstOrder();
    [game, player, player2] = testGame(2);
  });

  function findOption(pi: PlayerInput, title: string) {
    return cast(pi, OrOptions).options.find((option) => option.title === title)!;
  }

  it('play', () => {
    game.phase = Phase.ACTION;
    player.setTerraformRating(20);
    const ants = new Ants();
    const bactoviralResearch = new BactoviralResearch();
    player.cardsInHand = [ants, bactoviralResearch, card];

    expect(player.actionsTakenThisRound).eq(0);
    expect(game.activePlayer.id).eq(player.id);

    player.megaCredits = card.cost;
    player.takeAction();
    doWait(player, OrOptions, (orOptions) => {
      const playProjectCard = findOption(orOptions, 'Play project card');
      cast(playProjectCard, SelectProjectCardToPlay).payAndPlay(card, Payment.of({megacredits: 5}));
    });
    runAllActions(game);

    expect(player.terraformRating).eq(21);

    expect(player.actionsTakenThisRound).eq(1);
    expect(game.activePlayer.id).eq(player.id);

    player.takeAction();
    doWait(player, OrOptions, (orOptions) => {
      const patents = cast(findOption(orOptions, 'Sell patents'), SelectCard);
      patents.cb([player.cardsInHand[0]]);
    });

    expect(player.actionsTakenThisRound).eq(2);
    expect(game.activePlayer.id).eq(player.id);

    doWait(player, OrOptions, (orOptions) => {
      const patents = cast(findOption(orOptions, 'Sell patents'), SelectCard);
      patents.cb([player.cardsInHand[0]]);
    });

    expect(game.activePlayer.id).eq(player2.id);
  });
});
