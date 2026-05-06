import '@testing-library/jest-dom';
import { renderHook, act, cleanup } from  '@testing-library/react';
import { useDebounce } from './useDebounce';

afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
});

it("Should return initial value immediately", () => {
    const { result, unmount } = renderHook(() => useDebounce("pikachu"));

    expect(result.current).toBe("pikachu");
    unmount();
});

it("Should update the value after the specified delay", () => {
    jest.useFakeTimers();

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {initialProps: {value: "pikachu", delay: 500}});

    rerender({value: "ditto", delay: 500});
    expect(result.current).toBe("pikachu");

    act(() => {
        jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("ditto");
});