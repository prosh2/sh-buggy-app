// src/__tests__/home.test.tsx
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Home from "../app/page"; // Adjust path if your file is somewhere else
import { useRouter } from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("motion/react", () => {
    const React = jest.requireActual("react");
    return {
        motion: {
            div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
            h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props}>{children}</h1>,
            button: ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
        },
        AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});


describe("Home Page", () => {
    let pushMock: jest.Mock;
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
            if (typeof msg === 'string' && msg.includes('React does not recognize the `whileTap` prop')) {
                return; // ignore this specific warning
            }
        });
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore();
    })

    beforeEach(() => {
        jest.useFakeTimers();


        pushMock = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ sessionId: "12345" }),
            })
        ) as jest.Mock;
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it("renders heading and button", () => {
        render(<Home />);
        expect(screen.getByText("Buggy")).toBeInTheDocument();
        expect(screen.getByText("Split your bills easy")).toBeInTheDocument();
        expect(screen.getByRole("button")).toHaveTextContent("Upload Receipt");
    });

    it("handles button click and navigates on success", async () => {
        render(<Home />);
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent("Upload Receipt");
        // Wrap the click and any async state updates in act()
        await act(async () => {
            fireEvent.click(button);
        })

        // Advance timers so setTimeout fires
        act(() => {
            jest.runAllTimers();
        });

        // Wait for success state
        await waitFor(() => {
            expect(button).toHaveTextContent("Success!");
        });

        // Wait for router.push
        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith("/session/12345");
        });
    });

    it("handles fetch failure gracefully", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
        render(<Home />);
        const button = screen.getByRole("button");
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent("Upload Receipt");

        // Wrap the click and any async state updates in act()
        await act(async () => {
            fireEvent.click(button);
        });
        // Wait for Loading state to appear
        await waitFor(() => {
            expect(screen.getByText("Uploading...")).toBeInTheDocument();
        });

        // Wait for state to finish (no success)
        await waitFor(() => {
            expect(button).not.toHaveTextContent("Success!");
        });

        // router.push should not be called
        expect(pushMock).not.toHaveBeenCalled();
    });
});
