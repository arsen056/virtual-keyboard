/* eslint-disable import/extensions */
import create from './create.js';
import ru from './ru.js';
import en from './en.js';

const main = create(
  'main',
  'main',
  [create('h1', 'title', 'RSS Virtual Keyaboard')],
);

const btnKeys = [];

export default class Keyboard {
  constructor(btnOrder) {
    this.btnOrder = btnOrder;
    this.isActiveCaps = false;
  }

  init() {
    this.textarea = create('textarea', 'textarea', '', main, ['placeholder', 'Start typing'], ['rows', 5], ['cols', 50], ['spellcheck', false], ['autocorrect', 'off']);
    this.container = create('div', 'keyboard', '', main, ['language', 'en']);
    document.body.prepend(main);
    return this;
  }

  generateKeys(lang) {
    this.lang = lang;
    this.textarea.focus();
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
          this.keyUpEn.classList.add('hidden');
        } else {
          this.keyRu.classList.add('hidden');
          this.keyUpEn.classList.add('hidden');
          this.keyUpRu.classList.add('hidden');
        }
        btnKeys.push(this.key);
      });
    });

    document.addEventListener('keyup', this.handleKeyEvent);
    document.addEventListener('keydown', this.handleKeyEvent);
    document.addEventListener('mousedown', this.handleMouseEvent);
    document.addEventListener('mouseup', this.handleMouseEvent);
  }

  handleKeyEvent = (event) => {
    if (event.stopPropagation) event.stopPropagation();
    event.preventDefault();
    this.textarea.focus();
    let cursor = this.textarea.selectionStart;
    const left = this.textarea.value.slice(0, cursor);
    const right = this.textarea.value.slice(cursor);
    const activeKey = btnKeys.find((e) => e.classList.contains(event.code));

    if (event.type === 'keydown') {
      activeKey.classList.add('active');
      if (event.type.match(/key/) && !event.code.match(/Alt|Control|Caps|Shift/)) {
        if (event.code.match(/Tab/)) {
          this.textarea.value = `${left}    ${right}`;
          cursor += 4;
        } else if (event.code.match(/ArrowLeft/)) {
          cursor = cursor - 1 >= 0 ? cursor - 1 : 0;
        } else if (event.code.match(/ArrowRight/)) {
          cursor += 1;
        } else if (event.code.match(/ArrowUp/)) {
          const posLeft = this.textarea.value.slice(0, cursor).match(/(\n).*$(?!\1)/g) || [[1]];
          cursor -= posLeft[0].length;
        } else if (event.code.match(/ArrowDown/)) {
          const posLeft = this.textarea.value.slice(0, cursor).match(/(\n).*$(?!\1)/g) || [[1]];
          cursor += posLeft[0].length;
        } else if (event.code.match(/Enter/)) {
          this.textarea.value = `${left}\n${right}`;
          cursor += 1;
        } else if (event.code.match(/Delete/)) {
          this.textarea.value = `${left}${right.slice(1)}`;
        } else if (event.code.match(/Backspace/)) {
          this.textarea.value = `${left.slice(0, -1)}${right}`;
          cursor -= 1;
        } else if (event.code.match(/Space/)) {
          this.textarea.value = `${left} ${right}`;
          cursor += 1;
        } else {
          cursor += 1;
          if (!event.code.match(/Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Del|Tab/)) {
            if (!activeKey.firstChild.classList.contains('hidden')) {
              if (!activeKey.firstChild.firstChild.classList.contains('hidden')) {
                this.textarea.value = `${left}${activeKey.firstChild.firstChild.innerHTML || ''}${right}`;
              } else {
                this.textarea.value = `${left}${activeKey.firstChild.lastChild.innerHTML || ''}${right}`;
              }
            } else if (!activeKey.lastChild.firstChild.classList.contains('hidden')) {
              this.textarea.value = `${left}${activeKey.lastChild.firstChild.innerHTML || ''}${right}`;
            } else {
              this.textarea.value = `${left}${activeKey.lastChild.lastChild.innerHTML || ''}${right}`;
            }
          }
        }
        this.textarea.setSelectionRange(cursor, cursor);
      }

      if (event.code.match(/Shift/)) {
        btnKeys.forEach((e) => {
          if (!e.className.match(/Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/)) {
            e.firstChild.firstChild.classList.add('hidden');
            e.lastChild.firstChild.classList.add('hidden');
            e.firstChild.lastChild.classList.remove('hidden');
            e.lastChild.lastChild.classList.remove('hidden');
          }
        });
      }

      // Keydown CapsLock
      if (event.code.match(/CapsLock/)) {
        if (!this.isActiveCaps) {
          activeKey.classList.add('caps-active');
          this.isActiveCaps = true;
          btnKeys.forEach((e) => {
            if (!e.className.match(/Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/)) {
              e.firstChild.firstChild.classList.add('hidden');
              e.lastChild.firstChild.classList.add('hidden');
              e.firstChild.lastChild.classList.remove('hidden');
              e.lastChild.lastChild.classList.remove('hidden');
            }
          });
        } else {
          activeKey.classList.remove('caps-active');
          this.isActiveCaps = false;
          btnKeys.forEach((e) => {
            if (!e.className.match(/Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/)) {
              e.firstChild.lastChild.classList.add('hidden');
              e.lastChild.lastChild.classList.add('hidden');
              e.firstChild.firstChild.classList.remove('hidden');
              e.lastChild.firstChild.classList.remove('hidden');
            }
          });
        }
      }

      // Switch lang
      if (event.code.match(/Control/)) this.ctrlKey = true;
      if (event.code.match(/Alt/)) this.AltKey = true;

      if (this.ctrlKey && this.AltKey) {
        btnKeys.forEach((e) => {
          if (e.firstChild.classList.contains('hidden')) {
            e.firstChild.classList.remove('hidden');
            e.lastChild.classList.add('hidden');
          } else {
            e.lastChild.classList.remove('hidden');
            e.firstChild.classList.add('hidden');
          }
        });
      }
    }

    if (event.type === 'keyup') {
      activeKey.classList.remove('active');
      if (event.code.match(/Control/)) this.ctrlKey = false;
      if (event.code.match(/Alt/)) this.AltKey = false;

      if (event.code.match(/Shift/)) {
        btnKeys.forEach((e) => {
          if (!e.className.match(/Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/)) {
            e.firstChild.lastChild.classList.add('hidden');
            e.lastChild.lastChild.classList.add('hidden');
            e.firstChild.firstChild.classList.remove('hidden');
            e.lastChild.firstChild.classList.remove('hidden');
          }
        });
      }
    }
  };

  handleMouseEvent = (event) => {
    let cursor = this.textarea.selectionStart;
    this.textarea.focus();
    const left = this.textarea.value.slice(0, cursor);
    const right = this.textarea.value.slice(cursor);
    const element = event.srcElement.closest('.key');
    if (element) {
      if (event.type === 'mousedown' && !element.className.match(/Alt|Control|Caps|Shift/)) {
        if (element.className.match(/Tab/)) {
          this.textarea.value = `${left}    ${right}`;
          cursor += 4;
        } else if (element.className.match(/ArrowLeft/)) {
          cursor = cursor - 1 >= 0 ? cursor - 1 : 0;
        } else if (element.className.match(/ArrowRight/)) {
          cursor += 1;
        } else if (element.className.match(/ArrowUp/)) {
          const posLeft = this.textarea.value.slice(0, cursor).match(/(\n).*$(?!\1)/g) || [[1]];
          cursor -= posLeft[0].length;
        } else if (element.className.match(/ArrowDown/)) {
          const posLeft = this.textarea.value.slice(0, cursor).match(/(\n).*$(?!\1)/g) || [[1]];
          cursor += posLeft[0].length;
        } else if (element.className.match(/Enter/)) {
          this.textarea.value = `${left}\n${right}`;
          cursor += 1;
        } else if (element.className.match(/Delete/)) {
          this.textarea.value = `${left}${right.slice(1)}`;
        } else if (element.className.match(/Backspace/)) {
          this.textarea.value = `${left.slice(0, -1)}${right}`;
          cursor -= 1;
        } else if (element.className.match(/Space/)) {
          this.textarea.value = `${left} ${right}`;
          cursor += 1;
        } else {
          cursor += 1;
          if (!element.className.match(/Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Del|Tab/)) {
            if (!element.firstChild.classList.contains('hidden')) {
              if (!element.firstChild.firstChild.classList.contains('hidden')) {
                this.textarea.value = `${left}${element.firstChild.firstChild.innerHTML || ''}${right}`;
              } else {
                this.textarea.value = `${left}${element.firstChild.lastChild.innerHTML || ''}${right}`;
              }
            } else if (!element.lastChild.firstChild.classList.contains('hidden')) {
              this.textarea.value = `${left}${element.lastChild.firstChild.innerHTML || ''}${right}`;
            } else {
              this.textarea.value = `${left}${element.lastChild.lastChild.innerHTML || ''}${right}`;
            }
          }
        }
        this.textarea.setSelectionRange(cursor, cursor);
      }

      if (event.type === 'mousedown' && element.className.match(/Shift/)) {
        element.classList.add('active');
        btnKeys.forEach((e) => {
          if (!e.className.match(/Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/)) {
            e.firstChild.firstChild.classList.add('hidden');
            e.lastChild.firstChild.classList.add('hidden');
            e.firstChild.lastChild.classList.remove('hidden');
            e.lastChild.lastChild.classList.remove('hidden');
          }
        });
      }

      if (event.type === 'mouseup' && element.className.match(/Shift/)) {
        element.classList.remove('active');
        btnKeys.forEach((e) => {
          if (!e.className.match(/Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/)) {
            e.firstChild.lastChild.classList.add('hidden');
            e.lastChild.lastChild.classList.add('hidden');
            e.firstChild.firstChild.classList.remove('hidden');
            e.lastChild.firstChild.classList.remove('hidden');
          }
        });
      }

      // Mousedown CapsLock
      if (event.type === 'mousedown' && element.className.match(/Caps/)) {
        if (!this.isActiveCaps) {
          element.classList.add('caps-active');
          this.isActiveCaps = true;
          btnKeys.forEach((e) => {
            if (!e.className.match(/Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/)) {
              e.firstChild.firstChild.classList.add('hidden');
              e.lastChild.firstChild.classList.add('hidden');
              e.firstChild.lastChild.classList.remove('hidden');
              e.lastChild.lastChild.classList.remove('hidden');
            }
          });
        } else {
          element.classList.remove('caps-active');
          this.isActiveCaps = false;
          btnKeys.forEach((e) => {
            if (!e.className.match(/Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/)) {
              e.firstChild.lastChild.classList.add('hidden');
              e.lastChild.lastChild.classList.add('hidden');
              e.firstChild.firstChild.classList.remove('hidden');
              e.lastChild.firstChild.classList.remove('hidden');
            }
          });
        }
      }
    }
  };
}
