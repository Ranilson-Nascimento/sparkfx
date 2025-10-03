import { describe, expect, it } from 'vitest';
import { parseFx } from '../parseFx';

describe('parseFx', () => {
  it('divide efeitos usando | e normaliza nomes', () => {
    const result = parseFx('Bounce(s=0.8)|ripple(op=0.2)|fly(cart)');
    expect(result).toEqual([
      { name: 'bounce', args: { s: 0.8 } },
      { name: 'ripple', args: { op: 0.2 } },
      { name: 'fly', args: { cart: true } }
    ]);
  });

  it('interpreta números, strings e booleanos', () => {
    const result = parseFx("toast(text='Ok', t=2000, vibrate)");
    expect(result[0]).toEqual({
      name: 'toast',
      args: { text: 'Ok', t: 2000, vibrate: true }
    });
  });

  it('ignora entradas inválidas sem quebrar', () => {
    const result = parseFx('bounce()|??');
    expect(result).toEqual([{ name: 'bounce', args: {} }]);
  });
});
