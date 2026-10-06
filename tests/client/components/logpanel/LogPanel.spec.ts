import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import LogPanel from '@/client/components/logpanel/LogPanel.vue';
import LogMessageComponent from '@/client/components/logpanel/LogMessageComponent.vue';
import {fakeViewModel} from '../testHelpers';
import {LogMessage} from '@/common/logs/LogMessage';
import {LogMessageType} from '@/common/logs/LogMessageType';
import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {SpaceId} from '@/common/Types';

describe('LogPanel', () => {
  let originalFetch: any;
  let originalGetElementById: typeof document.getElementById;
  let fetchCalls: Array<string>;

  function installScrollablePanel() {
    let scrollTop = 0;
    let scrollHeight = 520;
    const panel = {
      get scrollTop() {
        return scrollTop;
      },
      set scrollTop(value: number) {
        scrollTop = value;
      },
      get scrollHeight() {
        return scrollHeight;
      },
      clientHeight: 200,
    } as HTMLElement;
    document.getElementById = ((id: string) => id === 'logpanel-scrollable' ? panel : null) as typeof document.getElementById;
    return {
      getScrollTop: () => scrollTop,
      setScrollTop: (value: number) => {
        scrollTop = value;
      },
      setScrollHeight: (value: number) => {
        scrollHeight = value;
      },
    };
  }

  async function flushLogs(wrapper: ReturnType<typeof shallowMount>) {
    await Promise.resolve();
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();
  }

  beforeEach(() => {
    originalFetch = (global as any).fetch;
    originalGetElementById = document.getElementById.bind(document);
    fetchCalls = [];
    (global as any).fetch = (url: string) => {
      fetchCalls.push(url);
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    };
  });

  afterEach(() => {
    (global as any).fetch = originalFetch;
    document.getElementById = originalGetElementById;
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(LogPanel, {
      ...globalConfig,
      props: {
        viewModel: fakeViewModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('emits spaceClicked when a log message emits spaceClicked', async () => {
    const wrapper = shallowMount(LogPanel, {
      ...globalConfig,
      props: {viewModel: fakeViewModel()},
    });
    await flushLogs(wrapper);

    const message = new LogMessage(LogMessageType.DEFAULT, '${0}', [
      {type: LogMessageDataType.SPACE, value: '05' as SpaceId},
    ]);
    (wrapper.vm as any).messages.push(message);
    await wrapper.vm.$nextTick();

    await wrapper.findComponent(LogMessageComponent).vm.$emit('spaceClicked', '05');

    expect(wrapper.emitted('spaceClicked')).to.deep.eq([['05']]);
  });

  it('shows the scroll button only when away from the bottom', async () => {
    const panel = installScrollablePanel();
    const wrapper = shallowMount(LogPanel, {
      ...globalConfig,
      props: {viewModel: fakeViewModel()},
    });
    await flushLogs(wrapper);

    expect((wrapper.vm as any).showScrollToBottomButton).is.false;

    panel.setScrollTop(100);
    await wrapper.find('#logpanel-scrollable').trigger('scroll');
    expect((wrapper.vm as any).showScrollToBottomButton).is.true;

    panel.setScrollTop(320);
    await wrapper.find('#logpanel-scrollable').trigger('scroll');
    expect((wrapper.vm as any).showScrollToBottomButton).is.false;
  });

  it('returns to the current generation and the end of the log', async () => {
    const panel = installScrollablePanel();
    const baseViewModel = fakeViewModel({id: 'p-latest-reader' as any});
    const viewModel = {...baseViewModel, game: {...baseViewModel.game, generation: 3}};
    const wrapper = shallowMount(LogPanel, {
      ...globalConfig,
      props: {viewModel},
    });
    await flushLogs(wrapper);

    (wrapper.vm as any).selectedGeneration = 1;
    panel.setScrollTop(80);
    await wrapper.find('[data-test="log-latest"]').trigger('click');
    await flushLogs(wrapper);

    expect((wrapper.vm as any).selectedGeneration).eq(3);
    expect(fetchCalls[fetchCalls.length - 1]).includes('generation=3');
    expect(panel.getScrollTop()).eq(520);
  });

  it('follows the newest generation when the view model updates while following', async () => {
    const panel = installScrollablePanel();
    const baseViewModel = fakeViewModel({id: 'p-in-place-follower' as any});
    const viewModel = {...baseViewModel, game: {...baseViewModel.game, generation: 2}};
    const wrapper = shallowMount(LogPanel, {
      ...globalConfig,
      props: {viewModel},
    });
    await flushLogs(wrapper);
    (wrapper.vm as any).showLatestLogs();
    await flushLogs(wrapper);
    fetchCalls.length = 0;
    panel.setScrollHeight(640);

    await wrapper.setProps({viewModel: {...viewModel, game: {...viewModel.game, generation: 3}}});
    await flushLogs(wrapper);

    expect((wrapper.vm as any).selectedGeneration).eq(3);
    expect(fetchCalls).has.length(1);
    expect(fetchCalls[0]).includes('generation=3');
    expect(panel.getScrollTop()).eq(640);
  });

  it('refetches the current generation when the view model updates within a generation', async () => {
    const baseViewModel = fakeViewModel({id: 'p-in-place-same-gen' as any});
    const viewModel = {...baseViewModel, game: {...baseViewModel.game, generation: 2}};
    const wrapper = shallowMount(LogPanel, {
      ...globalConfig,
      props: {viewModel},
    });
    await flushLogs(wrapper);
    (wrapper.vm as any).showLatestLogs();
    await flushLogs(wrapper);
    fetchCalls.length = 0;

    await wrapper.setProps({viewModel: {...viewModel}});
    await flushLogs(wrapper);

    expect(fetchCalls).has.length(1);
    expect(fetchCalls[0]).includes('generation=2');
  });

  it('stays on an earlier generation when the view model updates after the player navigates away', async () => {
    const baseViewModel = fakeViewModel({id: 'p-in-place-history' as any});
    const viewModel = {...baseViewModel, game: {...baseViewModel.game, generation: 3}};
    const wrapper = shallowMount(LogPanel, {
      ...globalConfig,
      props: {viewModel},
    });
    await flushLogs(wrapper);
    (wrapper.vm as any).selectGeneration(1);
    await flushLogs(wrapper);
    fetchCalls.length = 0;

    await wrapper.setProps({viewModel: {...viewModel, game: {...viewModel.game, generation: 4}}});
    await flushLogs(wrapper);

    expect((wrapper.vm as any).selectedGeneration).eq(1);
    expect(fetchCalls).is.empty;
  });
});
