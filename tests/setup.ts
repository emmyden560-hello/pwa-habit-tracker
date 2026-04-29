import '@testing-library/jest-dom';

// Fix system date for deterministic streak tests (TRD tests expect 2024-04-25)
const MOCK_NOW = new Date('2024-04-25T12:00:00Z').getTime();
const RealDate = Date;

class MockDate extends RealDate {
  constructor(...args: any[]) {
    if (args.length === 0) {
      super(MOCK_NOW);
    } else {
      super(...(args as any[]));
    }
  }
  static now() {
    return MOCK_NOW;
  }
}

(globalThis as any).Date = MockDate;

// Optional: setup globals or other mocks
if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0) as unknown as number;
}
