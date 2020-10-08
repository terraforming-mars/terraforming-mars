import { expect } from "chai";
import { Database } from "../../src/database/Database";
import { Game } from "../../src/Game";
import { GameReloader } from "../../src/database/GameReloader";
import { Player } from "../../src/Player";

describe("GameReloader", function () {

    let expectedGameIds: Array<string> = [];
    const originalGenerateId = (Player as any).prototype.generateId;
    const originalGetInstance = (Database as any).getInstance;

    before(function () {
        (Player as any).prototype.generateId = function () {
            return "bar";
        };
        (Database as any).getInstance = function () {
            return {
                getGames: function (getInstanceCb: (err: unknown, allGames: Array<string>) => void) {
                    getInstanceCb(undefined, expectedGameIds);
                },
                restoreGameLastSave: function (__gameId: string, __gameToRebuild: Game, theCb: (err: unknown) => void) {
                    theCb(undefined);
                },
                saveGameState: function () {}
            };
        };
    });

    after(function () {
        (Player as any).prototype.generateId = originalGenerateId;
        (Database as any).getInstance = originalGetInstance;
    });

    it("loads game after loaded from database", function () {
        const expectedGameId = "foo";
        expectedGameIds = [expectedGameId];
        const reloader = new GameReloader();
        let actual: Game | undefined;
        reloader.getByGameId(expectedGameId, (game) => {
            actual = game;
        });
        expect(actual).to.eq(undefined);
        reloader.start();
        expect(actual).not.to.eq(undefined);
        expect(actual?.id).to.eq(expectedGameId);
        expect(reloader.getGameIds()).to.deep.eq(expectedGameIds);
    });

    it("loads game already loaded from database", function () {
        const expectedGameId = "foo";
        expectedGameIds = [expectedGameId];
        const reloader = new GameReloader();
        reloader.start();
        expect(reloader.getGameIds()).to.deep.eq(expectedGameIds);
        let actual: Game | undefined;
        reloader.getByGameId(expectedGameId, (game) => {
            actual = game;
        });
        expect(actual).not.to.eq(undefined);
        expect(actual?.id).to.eq(expectedGameId);
    });

    it("loads player after loaded from database", function () {
        const expectedGameId = "foo";
        const expectedPlayerId = "bar";
        expectedGameIds = [expectedGameId];
        const reloader = new GameReloader();
        let actual: Game | undefined;
        reloader.getByPlayerId(expectedPlayerId, (game) => {
            actual = game;
        });
        expect(actual).to.eq(undefined);
        reloader.start();
        expect(actual).not.to.eq(undefined);
        expect(actual?.id).to.eq(expectedGameId);
    });

    it("loads player already loaded from database", function () {
        const expectedGameId = "foo";
        const expectedPlayerId = "bar";
        expectedGameIds = [expectedGameId];
        const reloader = new GameReloader();
        reloader.start();
        expect(reloader.getGameIds()).to.deep.eq(expectedGameIds);
        let actual: Game | undefined;
        reloader.getByPlayerId(expectedPlayerId, (game) => {
            actual = game;
        });
        expect(actual).not.to.eq(undefined);
        expect(actual?.id).to.eq(expectedGameId);
    });

    it("provides undefined for players never found after loading", function () {
        const expectedGameId = "foo";
        const expectedPlayerId = "never";
        expectedGameIds = [expectedGameId];
        const reloader = new GameReloader();
        let actual: Game | string | undefined = "set";
        reloader.getByPlayerId(expectedPlayerId, (game) => {
            actual = game;
        });
        reloader.start();
        expect(actual).to.eq(undefined);
    });

    it("provides undefined for game never found after loading", function () {
        const expectedGameId = "foo";
        const expectedId = "never";
        expectedGameIds = [expectedGameId];
        const reloader = new GameReloader();
        let actual: Game | string | undefined = "set";
        reloader.getByGameId(expectedId, (game) => {
            actual = game;
        });
        reloader.start();
        expect(actual).to.eq(undefined);
    });
});
