
import { setup } from "../utils/Vue";

setup();

import { expect } from "chai";
import { OtherPlayer } from "../../src/components/OtherPlayer";

describe("OtherPlayer", function () {
    it("hideMe", function (done) {
        (OtherPlayer as any).methods.hideMe.call({
            '$root': {
                setVisibilityState: function (arg: string, arg1: boolean) {
                    expect(arg).to.eq("pinned_player_1");
                    expect(arg1).to.eq(false);
                    done();
                }
            },
            playerIndex: 1
        });
    });
    it("isVisible", function (done) {
        (OtherPlayer as any).methods.isVisible.call({
            '$root': {
                getVisibilityState: function (arg: string) {
                    expect(arg).to.eq("pinned_player_1");
                    done();
                }
            },
            playerIndex: 1
        });
    });
});
