import {expect} from 'chai';
import {IndenturedWorkers} from '../../../src/cards/base/IndenturedWorkers';
import {ICard} from '../../../src/cards/ICard';
import {DeuteriumExport} from '../../../src/cards/venusNext/DeuteriumExport';
import {Dirigibles} from '../../../src/cards/venusNext/Dirigibles';
import {ExtractorBalloons} from '../../../src/cards/venusNext/ExtractorBalloons';
import {StratosphericBirds} from '../../../src/cards/venusNext/StratosphericBirds';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('StratosphericBirds', () => {
  let card : StratosphericBirds; let player : Player; let game : Game; let deuteriumExport: DeuteriumExport;

  beforeEach(() => {
    card = new StratosphericBirds();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
    deuteriumExport = new DeuteriumExport();
  });

  it('Cannot play if Venus requirement not met', () => {
    player.playedCards.push(deuteriumExport);
    player.addResourceTo(deuteriumExport, 1);
    (game as any).venusScaleLevel = 10;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Cannot play if no floater', () => {
    (game as any).venusScaleLevel = 12;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', () => {
    player.playedCards.push(deuteriumExport);
    player.addResourceTo(deuteriumExport, 1);
    (game as any).venusScaleLevel = 12;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', () => {
    player.playedCards.push(deuteriumExport);
    player.addResourceTo(deuteriumExport, 1);
    (game as any).venusScaleLevel = 12;
    expect(player.canPlayIgnoringCost(card)).is.true;
    player.playedCards.push(card);

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);
    expect(game.deferredActions.pop()!.execute()).is.undefined;
  });

  it('Should act', () => {
    player.playedCards.push(card);
    card.action(player);
    expect(player.getResourcesOnCard(card)).to.eq(1);

    player.addResourceTo(card, 7);
    expect(card.getVictoryPoints()).to.eq(8);
  });

  it('Allows to choose card to remove floater from', () => {
    const extractorBalloons = new ExtractorBalloons();

    // Add cards to remove floater from
    player.playedCards.push(deuteriumExport, extractorBalloons);
    player.addResourceTo(deuteriumExport, 1);
    player.addResourceTo(extractorBalloons, 1);

    card.play(player);
    const selectCard = game.deferredActions.pop()!.execute() as SelectCard<ICard>;
    expect(selectCard.cards).has.lengthOf(2);

    selectCard.cb([deuteriumExport]);
    expect(player.getResourcesOnCard(deuteriumExport)).to.eq(0);
    expect(player.getResourcesOnCard(extractorBalloons)).to.eq(1);
  });

  it('Edge case: Dirigibles with no other floater cards', () => {
    // Add dirigibles with 1 floater
    const dirigibles = new Dirigibles();
    player.playedCards.push(dirigibles);
    player.addResourceTo(dirigibles, 1);

    (game as any).venusScaleLevel = 12;
    player.megaCredits = 9;

    // 9 M€ + 1 Dirigibles floater: Cannot play
    expect(player.canPlayIgnoringCost(card)).is.not.true;


    // 12 M€ + 1 Dirigibles floater: Card is playable
    player.megaCredits = 12;
    const selectHowToPayForProjectCard = player.playProjectCard();
    expect(player.canPlayIgnoringCost(card)).is.true;

    // Try to spend floater to pay for card: Throw an error
    expect(() => {
      selectHowToPayForProjectCard.cb(card, {steel: 0, heat: 0, titanium: 0, megaCredits: 9, microbes: 0, floaters: 1});
    }).to.throw('Cannot spend all floaters to play Stratospheric Birds');

    // Pay with MC only: Can play
    selectHowToPayForProjectCard.cb(card, {steel: 0, heat: 0, titanium: 0, megaCredits: 12, microbes: 0, floaters: 0});
        game.deferredActions.pop()!.execute(); // Remove floater
        expect(dirigibles.resourceCount).to.eq(0);
  });

  it('Allow spending all floaters from Dirigibles if there\'s at least one other card with a floater', () => {
    const dirigibles = new Dirigibles();
    player.playedCards.push(deuteriumExport, dirigibles);
    player.addResourceTo(deuteriumExport, 1);
    player.addResourceTo(dirigibles, 3);

    (game as any).venusScaleLevel = 12;
    player.megaCredits = 3;

    const selectHowToPayForCard = player.playProjectCard();
    expect(player.canPlayIgnoringCost(card)).is.true;

    // Spend all 3 floaters from Dirigibles to pay for the card
    selectHowToPayForCard.cb(card, {steel: 0, heat: 0, titanium: 0, megaCredits: 3, microbes: 0, floaters: 3});
        game.deferredActions.pop()!.execute(); // Remove floater
        expect(player.getResourcesOnCard(dirigibles)).to.eq(0);
        expect(player.getResourcesOnCard(deuteriumExport)).to.eq(0);
        expect(player.megaCredits).to.eq(0);
  });

  it('Can play with discounts and single Dirigibles floater', () => {
    const dirigibles = new Dirigibles();
    player.playedCards.push(dirigibles);
    player.addResourceTo(dirigibles, 1);
    player.megaCredits = 4;
    (game as any).venusScaleLevel = 12;

    const indentured = new IndenturedWorkers();
    player.playCard(indentured);
    card.play(player);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });
});
