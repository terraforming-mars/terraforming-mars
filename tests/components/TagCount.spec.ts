
import { setup } from "../utils/Vue";

setup();

import { expect } from "chai";
import { TagCount } from "../../src/components/TagCount";

describe("TagCount", function () {
    it("getClasses", function () {
        expect((TagCount as any).methods.getClasses.call({
            count: 0
        })).to.eq("tag-display tag-no-show");
        expect((TagCount as any).methods.getClasses.call({
            count: 1
        })).to.eq("tag-display");
    });
    it("getCountClasses", function () {
        expect((TagCount as any).methods.getCountClasses.call({
            count: 0
        })).to.eq("tag-count-display tag-count-no-show");
        expect((TagCount as any).methods.getCountClasses.call({
            count: 1
        })).to.eq("tag-count-display");
    });
    it("getCount", function () {
        expect((TagCount as any).methods.getCount.call({
            count: 1,
            hideCount: true
        })).to.eq("?");
        expect((TagCount as any).methods.getCount.call({
            count: 1
        })).to.eq(1);
    });
});
