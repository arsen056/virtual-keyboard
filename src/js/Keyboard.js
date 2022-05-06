/* eslint-disable import/extensions */
// eslint-disable-next-line import/extensions
import create from './create.js';
import ru from './ru.js';
import en from './en.js';

const main = create(
  'main',
  'main',
  [create('h1', 'title', 'RSS Virtual Keyaboard')],
);

export default class Keyboard {
  constructor(btnOrder) {
    this.btnOrder = btnOrder;
  }

  init() {
    this.textarea = create('textarea', 'textarea', '', main, ['placeholder', 'Start typing'], ['rows', 5], ['cols', 50], ['spellcheck', false], ['autocorrect', 'off']);
    this.container = create('div', 'keyboard', '', main, ['language', 'en']);
    document.body.prepend(main);
    return this;
  }

  generateKeys(lang) {
    this.btnOrder.forEach((keys) => {
      this.row = create('div', 'row', '', this.container);
      keys.forEach((btn) => {
        this.key = create('div', `key ${btn}`, '', this.row);
        this.keyRu = create('span', 'rus', '', this.key);
        this.keyEng = create('span', 'eng', '', this.key);

        this.keyLowRu = create('span', 'lower', ru.find((e) => e.name === btn).lower, this.keyRu);
        this.keyLowEn = create('span', 'lower', en.find((e) => e.name === btn).lower, this.keyEng);
        this.keyUpRu = create('span', 'upper', ru.find((e) => e.name === btn).upper, this.keyRu);
        this.keyUpEn = create('span', 'upper', en.find((e) => e.name === btn).upper, this.keyEng);

        if (lang === 'ru') {
          this.keyEng.classList.add('hidden');
          this.keyUpRu.classList.add('hidden');
        } else {
          this.keyRu.classList.add('hidden');
          this.keyUpEn.classList.add('hidden');
        }
      });
    });
  }
}
