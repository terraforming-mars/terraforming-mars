
import { setup } from "../utils/Vue";

setup();
// import Vue from "vue";

import { createLocalVue, mount } from "@vue/test-utils";

import { expect } from "chai";
import { Award } from "../../src/components/Award";
import { FundedAwardModel } from "../../src/models/FundedAwardModel";


describe.only("Award", function () {
    const mockAward: FundedAwardModel = {
        award: {
            name: "test",
            description: "a test",
            getScore: () => 0
        },
        player_name: "foo",
        player_color: "blue",
        scores: []
    };
    it.only("getNameCss", function () {
        const localVue = createLocalVue();
        console.log(mount({
            template: '<p>{{ msg }}</p>',
            props: ['msg']
        }, { localVue: localVue, attachTo: document.body, propsData: { msg: "Hello World" } }));

        const d = mount(Award, {
            localVue: localVue,
            propsData: {
                awards_list: []
            }
        });
        console.log(d);
        expect((Award as any).methods.getNameCss("foo Bar foO")).to.eq("ma-name ma-name--foo-bar-foo");
    });
    it("sets up data", function () {
        const awards_list: Array<FundedAwardModel> = [mockAward];
        expect((Award as any).data.call({
            awards_list
        })).to.deep.eq({
            showList: true,
            showDescription: {
                test: false
            }
        });
    });
    it("shouldShow", function () {
        const scope = { showDescription: { test: true } };
        expect((Award as any).methods.shouldShow.call(scope, mockAward)).is.true;
    });
    it("shouldShowList", function () {
        const scope = { showList: true };
        expect((Award as any).methods.shouldShowList.call(scope)).is.true;
    });
    it("toggle", function () {
        const scope = { showDescription: { test: false } };
        (Award as any).methods.toggle.call(scope, mockAward);
        expect(scope.showDescription.test).is.true;
    });
    it("toggleList", function () {
        const scope = { showList: false };
        (Award as any).methods.toggleList.call(scope);
        expect(scope.showList).is.true;
    });
});
