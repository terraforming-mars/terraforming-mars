import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import LogPanel from '@/client/components/logpanel/LogPanel.vue';
import {fakeViewModel} from '../testHelpers';

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
        color: 'blue',
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('restores the selected generation and scroll position after remount', async () => {
    const panel = installScrollablePanel();
    const baseViewModel = fakeViewModel({id: 'p-log-reader' as any});
    const viewModel = {...baseViewModel, game: {...baseViewModel.game, generation: 3}};
    const first = shallowMount(LogPanel, {
      ...globalConfig,
      props: {viewModel, color: 'blue'},
    });
    await flushLogs(first);

    (first.vm as any).selectedGeneration = 1;
    panel.setScrollTop(120);
    first.unmount();

    const second = shallowMount(LogPanel, {
      ...globalConfig,
      props: {viewModel, color: 'blue'},
    });
    await flushLogs(second);

    expect((second.vm as any).selectedGeneration).eq(1);
    expect(fetchCalls[fetchCalls.length - 1]).includes('generation=1');
    expect(panel.getScrollTop()).eq(120);
  });

  it('continues following the end after remount when already at the bottom', async () => {
    const panel = installScrollablePanel();
    const viewModel = fakeViewModel({id: 'p-log-follower' as any});
    const first = shallowMount(LogPanel, {
      ...globalConfig,
      props: {viewModel, color: 'blue'},
    });
    await flushLogs(first);

    panel.setScrollTop(320);
    first.unmount();
    panel.setScrollHeight(640);

    const second = shallowMount(LogPanel, {
      ...globalConfig,
      props: {viewModel, color: 'blue'},
    });
    await flushLogs(second);

    expect(panel.getScrollTop()).eq(640);
  });

  it('shows the scroll button only when away from the bottom', async () => {
    const panel = installScrollablePanel();
    const wrapper = shallowMount(LogPanel, {
      ...globalConfig,
      props: {viewModel: fakeViewModel(), color: 'blue'},
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
      props: {viewModel, color: 'blue'},
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
});
