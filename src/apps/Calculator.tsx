import { useState } from 'react';
import { Sound } from '../os/sound';
import type { AppProps } from '../os/types';

const ops = ['+', '-', '×', '÷'];

export default function Calculator({ windowId }: AppProps) {
  const [expr, setExpr] = useState('');
  const [res, setRes] = useState('0');
  void windowId;

  const press = (v: string) => {
    Sound.click();
    if (v === 'C') {
      setExpr('');
      setRes('0');
      return;
    }
    if (v === '=') {
      try {
        const cleaned = expr
          .replace(/×/g, '*')
          .replace(/÷/g, '/');
        const val = Function(`"use strict"; return (${cleaned})`)();
        setRes(String(round(val)));
        setExpr('');
      } catch {
        setRes('Schwifty ERR');
        setExpr('');
      }
      return;
    }
    if (v === '⌫') {
      setExpr((e) => e.slice(0, -1));
      return;
    }
    setExpr((e) => e + v);
  };

  const round = (n: number) => Math.round(n * 1e8) / 1e8;

  const btn = (label: string, cls = '') => (
    <button className={`calc-btn ${cls}`} onClick={() => press(label)}>{label}</button>
  );

  return (
    <div className="calc">
      <div className="calc-screen">
        <div className="calc-expr">{expr || ' '}</div>
        <div className="calc-res">{res}</div>
      </div>
      <div className="calc-grid">
        {btn('C', 'calc-ac')}
        {btn('(', 'calc-op')}{btn(')', 'calc-op')}{btn('⌫', 'calc-op')}
        {btn('7')}{btn('8')}{btn('9')}{btn('÷', 'calc-op')}
        {btn('4')}{btn('5')}{btn('6')}{btn('×', 'calc-op')}
        {btn('1')}{btn('2')}{btn('3')}{btn('-', 'calc-op')}
        {btn('.')}{btn('0')}{btn('+', 'calc-op')}{btn('=', 'calc-eq')}
      </div>
      <p className="calc-hint">Enter a value. Don&apos;t hurt yourself in the whiteboard dimension.</p>
    </div>
  );
}