import { OahPage } from './app.po';

describe('oah App', () => {
  let page: OahPage;

  beforeEach(() => {
    page = new OahPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
