// eslint-disable-next-line import/extensions
import Keyboard from './Keyboard.js';

const btnOrder = [
  ['Backtick', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Dash', 'Backspace'],
  ['Tab', 'BtnQ', 'BtnW', 'BtnE', 'BtnR', 'BtnT', 'BtnY', 'BtnU', 'BtnI', 'BtnO', 'BtnP', 'BracketLeft', 'BracketRight', 'BackSlash', 'Delete'],
  ['CapsLock', 'BtnA', 'BtnS', 'BtnD', 'BtnF', 'BtnG', 'BtnH', 'BtnJ', 'BtnK', 'BtnL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'BtnZ', 'BtnX', 'BtnC', 'BtnV', 'BtnB', 'BtnN', 'BtnM', 'Comma', 'Point', 'Slash', 'ArrowUp', 'ShiftRight'],
  ['CtrlLeft', 'Win', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'CtrlRight', 'Point', 'Slash'],
];

new Keyboard(btnOrder).init().generateKeys('eng');
