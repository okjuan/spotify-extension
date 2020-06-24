/**
 * @jest-environment jsdom
 */
import { Storage } from '../lib/storage';
import { stub } from 'sinon';

describe('', () => {
  let getFunc;
  let setFunc;
  const originalLocalStorage = window.localStorage;

  beforeEach(() => {
    getFunc = stub();
    setFunc = stub();

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: getFunc,
        setItem: setFunc,
      },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        ...originalLocalStorage,
      },
      writable: true,
    });
  });

  it('should return a valid object', () => {
    getFunc.returns('{"foo": "bar"}');
    expect(Storage.get('foo')).toEqual({ foo: 'bar' });
    expect(getFunc.called).toBeTruthy();
  });

  it('should return undefined', () => {
    getFunc.onCall('{"foo": ""}');
    expect(Storage.get('foo')).toEqual(undefined);
  });

  it('should call set method', () => {
    Storage.set('foo', 'bar');
    expect(setFunc.called).toBeTruthy();
  });
});
