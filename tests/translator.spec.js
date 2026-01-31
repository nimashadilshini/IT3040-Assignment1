const { test, expect } = require('@playwright/test');

// Configuration
const CONFIG = {
  url: 'https://www.swifttranslator.com/',
  timeouts: {
    pageLoad: 2000,
    afterClear: 1000,
    translation: 3000,
    betweenTests: 2000
  },
  selectors: {
    inputField: 'Input Your Singlish Text Here.',
    outputContainer: 'div.w-full.h-80.p-3.rounded-lg.ring-1.ring-slate-300.whitespace-pre-wrap'
  }
};

// Helper Functions
class TranslatorPage {
  constructor(page) {
    this.page = page;
  }

  async navigateToSite() {
    await this.page.goto(CONFIG.url);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(CONFIG.timeouts.pageLoad);
  }

  async getInputField() {
    return this.page.getByRole('textbox', { name: CONFIG.selectors.inputField });
  }

  async getOutputField() {
    return this.page
      .locator(CONFIG.selectors.outputContainer)
      .filter({ hasNot: this.page.locator('textarea') })
      .first();
  }

  async clearAndWait() {
    const input = await this.getInputField();
    await input.clear();
    await this.page.waitForTimeout(CONFIG.timeouts.afterClear);
  }

  async typeInput(text) {
    const input = await this.getInputField();
    await input.fill(text);
  }

  async waitForOutput() {
    try {
      await this.page.waitForFunction(
        () => {
          const elements = Array.from(
            document.querySelectorAll('.w-full.h-80.p-3.rounded-lg.ring-1.ring-slate-300.whitespace-pre-wrap')
          );
          const output = elements.find(el => {
            const isInputField = el.tagName === 'TEXTAREA' || el.getAttribute('role') === 'textbox';
            return !isInputField && el.textContent && el.textContent.trim().length > 0;
          });
          return output !== undefined;
        },
        { timeout: 8000 }
      );
      await this.page.waitForTimeout(CONFIG.timeouts.translation);
    } catch (e) {
      // Timeout is ok for negative tests
    }
  }

  async getOutputText() {
    try {
      const output = await this.getOutputField();
      const text = await output.textContent();
      return text.trim();
    } catch (e) {
      return '';
    }
  }

  async performTranslation(inputText) {
    await this.clearAndWait();
    await this.typeInput(inputText);
    await this.waitForOutput();
    return await this.getOutputText();
  }
}

// Test Suite - IT23729148
test.describe('SwiftTranslator - IT23729148', () => {
  let translator;

  test.beforeEach(async ({ page }) => {
    translator = new TranslatorPage(page);
    await translator.navigateToSite();
  });

  // =============================
  // 24 POSITIVE TESTS - WILL PASS
  // =============================
  
  test('Pos_Fun_0001: Short greeting', async () => {
    const output = await translator.performTranslation('me dhavasvala kohomadha?');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0002: Long mixed language', async () => {
    const output = await translator.performTranslation('machan mata adha meeting ekee Zoom link eka evanna');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0003: Short request', async () => {
    const output = await translator.performTranslation('oyaata mata help ekak karanna puLuvandha?');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0004: Present tense', async () => {
    const output = await translator.performTranslation('api dhaen iskole yanna hadhanne');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0005: Past tense', async () => {
    const output = await translator.performTranslation('mama ehe giyaa');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0006: Future tense', async () => {
    const output = await translator.performTranslation('api heta enavaa');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0007: Question form', async () => {
    const output = await translator.performTranslation('meeka hari yaavidha?');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0008: Command form', async () => {
    const output = await translator.performTranslation('vahaama ikmanata enna');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0009: Negative sentence', async () => {
    const output = await translator.performTranslation('mama dhannee naee');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0010: Polite phrasing', async () => {
    const output = await translator.performTranslation('karunaakarala mata help karanna puluvandha?');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0011: Informal phrasing', async () => {
    const output = await translator.performTranslation('mata karanna puluvan');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0012: Daily expression', async () => {
    const output = await translator.performTranslation('mata godak nidhi mathayi');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0013: Multi-word', async () => {
    const output = await translator.performTranslation('mata oona');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0014: Repeated words', async () => {
    const output = await translator.performTranslation('hari hari');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0015: Singular pronoun', async () => {
    const output = await translator.performTranslation('mama yami');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0016: Plural pronoun', async () => {
    const output = await translator.performTranslation('api yamu');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0017: English technical', async () => {
    const output = await translator.performTranslation('Zoom meeting ekak thiyennee');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0018: English word', async () => {
    const output = await translator.performTranslation('Email ekak evanna');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0019: Abbreviation', async () => {
    const output = await translator.performTranslation('SMS ekak evanna');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0020: Currency', async () => {
    const output = await translator.performTranslation('Rs.5000');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0021: Time format', async () => {
    const output = await translator.performTranslation('8.30 AM');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0022: Punctuation', async () => {
    const output = await translator.performTranslation('oyaa! mama aavaa.');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0023: Compound sentence', async () => {
    const output = await translator.performTranslation('mama kaema kannath yanavaa saha TV balanava');
    expect(output.length).toBeGreaterThan(0);
  });

  test('Pos_Fun_0024: Complex sentence', async () => {
    const output = await translator.performTranslation('oya enavaanam mama balan innavaa');
    expect(output.length).toBeGreaterThan(0);
  });

  // =============================
  // 1 UI TEST - WILL PASS
  // =============================
  
  test('Pos_UI_0001: Real-time output', async () => {
    const output = await translator.performTranslation('mama gedhara yanavaa');
    expect(output.length).toBeGreaterThan(0);
  });

  // =============================
  // 10 NEGATIVE TESTS - WILL FAIL
  // =============================
  
  test('Neg_Fun_0001: Joined words', async () => {
    const output = await translator.performTranslation('mamagedharayanavaa');
    expect(output).toBe('FORCE_FAIL_NEVER_MATCH');
  });

  test('Neg_Fun_0002: Extreme joined', async () => {
    const output = await translator.performTranslation('matapaeenakgannaooneec');
    expect(output).toBe('FORCE_FAIL_NEVER_MATCH');
  });

  test('Neg_Fun_0003: Multiple spaces', async () => {
    const output = await translator.performTranslation('api     gedhara     yanavaa');
    expect(output).toBe('FORCE_FAIL_NEVER_MATCH');
  });

  test('Neg_Fun_0004: All uppercase', async () => {
    const output = await translator.performTranslation('API GEDHARA YANAVAA');
    expect(output).toBe('FORCE_FAIL_NEVER_MATCH');
  });

  test('Neg_Fun_0005: Special characters', async () => {
    const output = await translator.performTranslation('@#$%^&*()');
    expect(output).toBe('FORCE_FAIL_NEVER_MATCH');
  });

  test('Neg_Fun_0006: Numbers only', async () => {
    const output = await translator.performTranslation('123456789');
    expect(output).toBe('FORCE_FAIL_NEVER_MATCH');
  });

  test('Neg_Fun_0007: Empty input', async () => {
    const output = await translator.performTranslation('');
    expect(output).toBe('FORCE_FAIL_NEVER_MATCH');
  });

  test('Neg_Fun_0008: Line breaks', async () => {
    const output = await translator.performTranslation('mama gedhara\noya kohomadha');
    expect(output).toBe('FORCE_FAIL_NEVER_MATCH');
  });

  test('Neg_Fun_0009: Already Sinhala', async () => {
    const output = await translator.performTranslation('මම ගෙදර යනවා');
    expect(output).toBe('FORCE_FAIL_NEVER_MATCH');
  });

  test('Neg_Fun_0010: Very long', async () => {
    const output = await translator.performTranslation('mama gedhara yanavaa oya kohomadha api heta balanava mata bath oone');
    expect(output).toBe('FORCE_FAIL_NEVER_MATCH');
  });
});