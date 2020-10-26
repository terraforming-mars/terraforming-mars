
import { setup } from "../utils/Vue";

setup();

import { expect } from "chai";
import { Tag } from "../../src/components/Tag";

describe("Tag", function () {
    it("getClasses", function () {
        expect((Tag as any).methods.getClasses.call({
            tag: "vp"
        })).to.eq("tag-count tag-vp");
        expect((Tag as any).methods.getClasses.call({
            tag: "vp",
            size: "big"
        })).to.eq("tag-count tag-vp tag-size-big");
        expect((Tag as any).methods.getClasses.call({
            tag: "vp",
            size: "big",
            type: "main"
        })).to.eq("tag-count tag-vp tag-size-big tag-type-main");
    });
});
