import { pen, eraser } from './Tools';

const  colors = {
    main: '#000000',
    extra: '#8080ff',
  };

describe('Pen',() => {
    it('Pen tool should be instance of Function', () => {
        expect(pen).toBeInstanceOf(Function);
    })
    it('Pen tool works correctly', () => {
        const resultFrame = Array.from(Array(32).fill([0, 0, 0, 0]), () => new Array(32).fill([0, 0, 0, 0]));
        resultFrame[15][15] = [0, 0, 0, 1];
        const event = {
            nativeEvent: {
                buttons: 1,
            },
        }
        const result = Array.from(Array(32).fill([0, 0, 0, 0]), () => new Array(32).fill([0, 0, 0, 0]));
        pen(event, 15, 15, result, colors);
        expect(result).toEqual(resultFrame);
    });
});

describe('eraser',() => {
    it('eraser tool should be instance of Function', () => {
        expect(pen).toBeInstanceOf(Function);
    })
    it('Pen tool works correctly', () => {
        const resultFrame = Array.from(Array(32).fill([255, 255, 255, 0]), () => new Array(32).fill([255, 255, 255, 0]));
        resultFrame[15][15] = [0, 0, 0, 0];
        const result = Array.from(Array(32).fill([255, 255, 255, 0]), () => new Array(32).fill([255, 255, 255, 0]));
        eraser(15, 15, result);
        expect(result).toEqual(resultFrame);
    });
});

