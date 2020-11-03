
import { createLocalVue, mount } from "@vue/test-utils";

import { expect } from "chai";
import { TagCount } from "../../src/components/TagCount";

describe("TagCount", function () {
    function getLocalVue() {
        const localVue = createLocalVue();
        return localVue;
    }
    it("renders with no count", function () {
        const tagCount = mount(TagCount, {
            localVue: getLocalVue(),
            propsData: {
                count: 0
            }
        });
        expect(tagCount.find("div[class=\"tag-display tag-no-show\"]").exists()).to.eq(true);
        expect(tagCount.find("span[class=\"tag-count-display tag-count-no-show\"]").exists()).to.eq(true);
    });
    it("renders with count", function () {
        const tagCount = mount(TagCount, {
            localVue: getLocalVue(),
            propsData: {
                count: 2
            }
        });
        expect(tagCount.find("div[class=\"tag-display\"]").exists()).to.eq(true);
        expect(tagCount.find("span[class=\"tag-count-display\"]").exists()).to.eq(true);
    });
});
