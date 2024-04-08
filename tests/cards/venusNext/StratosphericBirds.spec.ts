import {expect} from 'chai';
import {IndenturedWorkers} from '../../../src/server/cards/base/IndenturedWorkers';
import {DeuteriumExport} from '../../../src/server/cards/venusNext/DeuteriumExport';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {ExtractorBalloons} from '../../../src/server/cards/venusNext/ExtractorBalloons';
import {StratosphericBirds} from '../../../src/server/cards/venusNext/StratosphericBirds';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {Payment} from '../../../src/common/inputs/Payment';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';
import {cast, runAllActions, setVenusScaleLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('StratosphericBirds', () => {
  let card: StratosphericBirds;
  let player: TestPlayer;
  let game: Game;
  let deuteriumExport: DeuteriumExport;

  beforeEach(() => {
    card = new StratosphericBirds();
    [game, player] = testGame(2);
    deuteriumExport = new DeuteriumExport();
    player.popWaitingFor();
  });

  it('Cannot play if Venus requirement not met', () => {
    player.playedCards.push(deuteriumExport);
    player.addResourceTo(deuteriumExport, 1);
    setVenusScaleLevel(game, 10);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if no floater', () => {
    setVenusScaleLevel(game, 12);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play', () => {
    player.playedCards.push(deuteriumExport);
    player.addResourceTo(deuteriumExport, 1);
    setVenusScaleLevel(game, 12);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    player.playedCards.push(deuteriumExport);
    player.addResourceTo(deuteriumExport, 1);
    setVenusScaleLevel(game, 12);
    expect(card.canPlay(player)).is.true;
    player.playedCards.push(card);

    card.play(player);
    runAllActions(game);
  });

  it('Should act', () => {
    player.playedCards.push(card);
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);

    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints(player)).to.eq(8);
  });

  it('Allows to choose card to remove floater from', () => {
    const extractorBalloons = new ExtractorBalloons();

    // Add cards to remove floater from
    player.playedCards.push(deuteriumExport, extractorBalloons);
    player.addResourceTo(deuteriumExport, 1);
    player.addResourceTo(extractorBalloons, 1);

    card.play(player);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).has.lengthOf(2);

    selectCard.cb([deuteriumExport]);
    expect(deuteriumExport.resourceCount).to.eq(0);
    expect(extractorBalloons.resourceCount).to.eq(1);
  });

  it('Edge case: only one card has floaters, and it is not Dirigibles', () => {
    const aerialMappers = new AerialMappers();
    aerialMappers.resourceCount = 1;
    player.playedCards.push(aerialMappers);

    setVenusScaleLevel(game, 12);
    player.megaCredits = 12;

    expect(card.canPlay(player)).is.true;

    const selectProjectCardToPlay = new SelectProjectCardToPlay(player);
    selectProjectCardToPlay.payAndPlay(card, {...Payment.EMPTY, megaCredits: 12});
    runAllActions(game); // Remove floater
    cast(player.popWaitingFor(), undefined);
    expect(aerialMappers.resourceCount).to.eq(0);
  });

  it('Edge case: Dirigibles with no other floater cards', () => {
    // Add dirigibles with 1 floater
    const dirigibles = new Dirigibles();
    player.playedCards.push(dirigibles);
    player.addResourceTo(dirigibles, 1);

    setVenusScaleLevel(game, 12);
    player.megaCredits = 9;

    // 9 M€ + 1 Dirigibles floater: Cannot play
    expect(card.canPlay(player)).is.not.true;


    // 12 M€ + 1 Dirigibles floater: Card is playable
    player.megaCredits = 12;
    expect(card.canPlay(player)).is.true;

    // Try to spend floater to pay for card: Throw an error
    expect(() => {
      const selectProjectCardToPlay = new SelectProjectCardToPlay(player);
      selectProjectCardToPlay.payAndPlay(card, {...Payment.EMPTY, megaCredits: 9, floaters: 1});
    }).to.throw('Cannot spend all floaters to play Stratospheric Birds');

    // Pay with MC only: Can play
    const selectProjectCardToPlay = new SelectProjectCardToPlay(player);
    selectProjectCardToPlay.payAndPlay(card, {...Payment.EMPTY, megaCredits: 12});
    game.deferredActions.pop()!.execute(); // Remove floater
    expect(dirigibles.resourceCount).to.eq(0);
  });

  it('Allow spending all floaters from Dirigibles if there is at least one other card with a floater', () => {
    const dirigibles = new Dirigibles();
    player.playedCards.push(deuteriumExport, dirigibles);
    player.addResourceTo(deuteriumExport, 1);
    player.addResourceTo(dirigibles, 3);

    setVenusScaleLevel(game, 12);
    player.megaCredits = 3;

    expect(card.canPlay(player)).is.true;

    // Spend all 3 floaters from Dirigibles to pay for the card
    const selectProjectCardToPlay = new SelectProjectCardToPlay(player);
    selectProjectCardToPlay.payAndPlay(card, {...Payment.EMPTY, megaCredits: 3, floaters: 3});
    game.deferredActions.pop()!.execute(); // Remove floater
    expect(dirigibles.resourceCount).to.eq(0);
    expect(deuteriumExport.resourceCount).to.eq(0);
    expect(player.megaCredits).to.eq(0);
  });

  it('Can play with discounts and single Dirigibles floater', () => {
    const dirigibles = new Dirigibles();
    player.playedCards.push(dirigibles);
    player.addResourceTo(dirigibles, 1);
    player.megaCredits = 4;
    setVenusScaleLevel(game, 12);

    const indentured = new IndenturedWorkers();
    player.playCard(indentured);
    card.play(player);
    expect(card.canPlay(player)).is.true;
  });
});
