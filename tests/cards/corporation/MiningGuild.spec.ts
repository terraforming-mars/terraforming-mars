
import { expect } from "chai";
import { MiningGuild } from "../../../src/cards/corporation/MiningGuild";
import { Color } from "../../../src/Color";
import { Player } from "../../../src/Player";
import { SpaceBonus } from "../../../src/SpaceBonus";
import { SpaceType } from "../../../src/SpaceType";
import { Resources } from '../../../src/Resources';

describe("MiningGuild", function () {
    it("Should play", function () {
        const card = new MiningGuild();
        const player = new Player("test", Color.BLUE, false);
        const player2 = new Player("test2", Color.RED, false);
        player.corporationCard = card;
        const action = card.play(player);
        expect(action).to.eq(undefined);
        expect(player.steel).to.eq(5);
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
        card.onTilePlaced(player, { player, spaceType: SpaceType.LAND, x: 0, y: 0, id: "foobar", bonus: [] });
        expect(player.getProduction(Resources.STEEL)).to.eq(1);
        card.onTilePlaced(player, { player, spaceType: SpaceType.LAND, x: 0, y: 0, id: "foobar", bonus: [SpaceBonus.STEEL, SpaceBonus.TITANIUM] });
        expect(player.getProduction(Resources.STEEL)).to.eq(2);
        card.onTilePlaced(player, { player, spaceType: SpaceType.LAND, x: 0, y: 0, id: "foobar", bonus: [SpaceBonus.STEEL] });
        expect(player.getProduction(Resources.STEEL)).to.eq(3);
        card.onTilePlaced(player, { player, spaceType: SpaceType.LAND, x: 0, y: 0, id: "foobar", bonus: [SpaceBonus.TITANIUM] });
        expect(player.getProduction(Resources.STEEL)).to.eq(4);
        card.onTilePlaced(player2, { player, spaceType: SpaceType.LAND, x: 0, y: 0, id: "foobar", bonus: [SpaceBonus.TITANIUM] });
        expect(player.getProduction(Resources.STEEL)).to.eq(4);
        expect(player2.getProduction(Resources.STEEL)).to.eq(0);
    });
});
