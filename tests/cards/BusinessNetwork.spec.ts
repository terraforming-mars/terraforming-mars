
import { expect } from "chai";
import { BusinessNetwork } from "../../src/cards/BusinessNetwork";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { IProjectCard } from "../../src/cards/IProjectCard";
import { Game } from "../../src/Game";
import { SelectCard } from "../../src/inputs/SelectCard";
import { SelectHowToPay } from "../../src/inputs/SelectHowToPay";
import { Resources } from '../../src/Resources';

describe("BusinessNetwork", function () {
    it("Should play", function () {
        const card = new BusinessNetwork();
        const player = new Player("test", Color.BLUE, false);
        card.play(player);
        expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    });
    it("Can't play", function () {
        const card = new BusinessNetwork();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canPlay(player)).to.eq(true);
        player.setProduction(Resources.MEGACREDITS,-5);
        expect(card.canPlay(player)).to.eq(false);
    });
    it("Can act", function () {
        const card = new BusinessNetwork();
        const player = new Player("test", Color.BLUE, false);
        expect(card.canAct(player)).to.eq(false);
        player.megaCredits = 3;
        expect(card.canAct(player)).to.eq(true);
    });
    it("Should action as not helion", function () {
        const card = new BusinessNetwork();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.megaCredits = 3;
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectCard).to.eq(true);
        (action! as SelectCard<IProjectCard>).cb([]);
        expect(game.dealer.discarded.length).to.eq(1);
        expect(player.megaCredits).to.eq(3);
        player.megaCredits = 3;
        (action as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]);
        expect(player.megaCredits).to.eq(0);
        expect(player.cardsInHand.length).to.eq(1);
    });
    it("Should action as helion", function () {
        const card = new BusinessNetwork();
        const player = new Player("test", Color.BLUE, false);
        const game = new Game("foobar", [player,player], player);
        player.canUseHeatAsMegaCredits = true;
        player.heat = 1;
        player.megaCredits = 3;
        const action = card.action(player, game);
        expect(action).not.to.eq(undefined);
        expect(action instanceof SelectCard).to.eq(true);
        const subAction: SelectHowToPay = (action as SelectCard<IProjectCard>).cb([(action as SelectCard<IProjectCard>).cards[0]]) as SelectHowToPay;
        expect(subAction).not.to.eq(undefined);
        expect(subAction.canUseHeat).to.eq(true);
        expect(function () { subAction.cb({heat: 0, megaCredits: 0, steel: 0, titanium: 0, microbes: 0 }); }).to.throw();
        subAction.cb({heat: 1, megaCredits: 2, steel: 0, titanium: 0, microbes: 0 });
        expect(player.cardsInHand.length).to.eq(1);
        expect(player.heat).to.eq(0);
        expect(player.megaCredits).to.eq(1);
    });
});
