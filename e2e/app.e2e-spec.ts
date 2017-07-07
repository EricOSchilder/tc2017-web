import { Tc2017WebPage } from './app.po';

describe('tc2017-web App', () => {
  let page: Tc2017WebPage;

  beforeEach(() => {
    page = new Tc2017WebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
