import { StoreSeedAppPage } from './app.po';

describe('store-seed-app App', () => {
  let page: StoreSeedAppPage;

  beforeEach(() => {
    page = new StoreSeedAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
