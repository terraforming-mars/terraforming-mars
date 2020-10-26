
import { setup } from "../utils/Vue";

setup();

import { expect } from "chai";
import { Milestone } from "../../src/components/Milestone";
import { ClaimedMilestoneModel } from "../../src/models/ClaimedMilestoneModel";

describe("Milestone", function () {
    const mockMilestone: ClaimedMilestoneModel = {
        milestone: {
            name: "test",
            description: "a test",
            canClaim: () => true,
            getScore: () => 0
        },
        player_name: "foo",
        player_color: "blue",
        scores: []
    };
    it("getNameCss", function () {
        expect((Milestone as any).methods.getNameCss("foo Bar foO")).to.eq("ma-name ma-name--foo-bar-foo");
    });
    it("sets up data", function () {
        const milestones_list: Array<ClaimedMilestoneModel> = [mockMilestone];
        expect((Milestone as any).data.call({
            milestones_list
        })).to.deep.eq({
            showList: true,
            showDescription: {
                test: false
            }
        });
    });
    it("shouldShow", function () {
        const scope = { showDescription: { test: true } };
        expect((Milestone as any).methods.shouldShow.call(scope, mockMilestone)).is.true;
    });
    it("shouldShowList", function () {
        const scope = { showList: true };
        expect((Milestone as any).methods.shouldShowList.call(scope)).is.true;
    });
    it("toggle", function () {
        const scope = { showDescription: { test: false } };
        (Milestone as any).methods.toggle.call(scope, mockMilestone);
        expect(scope.showDescription.test).is.true;
    });
    it("toggleList", function () {
        const scope = { showList: false };
        (Milestone as any).methods.toggleList.call(scope);
        expect(scope.showList).is.true;
    });
});
