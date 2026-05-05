import '@testing-library/jest-dom';
import { renderHook, act } from  '@testing-library/react';
import { useDebounce } from './useDebounce';

beforeEach(() => {
    jest.useFakeTimers();
});

it("Should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("pikachu"));

    expect(result.current).toBe("pikachu");
});

it("Should update the value after the specified delay", () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {initialProps: {value: "pikachu", delay: 500}});

    rerender({value: "ditto", delay: 500});
    expect(result.current).toBe("pikachu");

    act(() => {
        jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("ditto");
});