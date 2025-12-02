import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

beforeEach(() => {
  localStorage.clear();
  jest.spyOn(globalThis, "confirm").mockReturnValue(true);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Add/Remove questions", () => {
  test("adds a question when clicking 'Add Question +' and deletes a question when clicking 'x'", () => {
    render(<App />);
    expect(
      screen.queryByRole("heading", { name: /Question 1/i })
    ).not.toBeInTheDocument();

    const addButton = screen.getByRole("button", { name: /add question/i });
    fireEvent.click(addButton);

    expect(
      screen.getByRole("heading", { name: /Question 1/i })
    ).toBeInTheDocument();
    jest.spyOn(globalThis, "confirm").mockReturnValue(true);
    const deleteButton = screen.getByRole("button", {
      name: /Delete question/i,
    });
    fireEvent.click(deleteButton);
    expect(
      screen.queryByRole("heading", { name: /Question 1/i })
    ).not.toBeInTheDocument();
  });
});

describe("Validation blocks invalid quiz", () => {
  test("preview button is disabled when quiz is empty", () => {
    render(<App />);

    const previewButton = screen.getByRole("tab", { name: /preview/i });
    expect(previewButton).toHaveAttribute("aria-disabled", "true");
  });

  test("preview button is disabled when question text is empty", () => {
    render(<App />);

    const addButton = screen.getByRole("button", { name: /add question/i });
    fireEvent.click(addButton);

    const previewButton = screen.getByRole("tab", { name: /preview/i });
    expect(previewButton).toHaveAttribute("aria-disabled", "true");
  });

  test("preview button is enabled when quiz is valid", () => {
    render(<App />);

    const addButton = screen.getByRole("button", { name: /add question/i });
    fireEvent.click(addButton);

    let previewButton = screen.getByRole("tab", { name: /preview/i });
    expect(previewButton).toHaveAttribute("aria-disabled", "true");

    const questionInput = screen.getByPlaceholderText(/enter your question/i);
    fireEvent.input(questionInput, { target: { value: "What is 2+2?" } });

    previewButton = screen.getByRole("tab", { name: /preview/i });
    expect(previewButton).toHaveAttribute("aria-disabled", "false");
  });
});

describe("preview reflects builder", () => {
  test("question text appears in preview mode", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /add question/i }));
    const questionInput = screen.getByPlaceholderText(/enter your question/i);
    fireEvent.input(questionInput, {
      target: { value: "What is the capital of France?" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add question/i }));
    const questionInput2 =
      screen.queryAllByPlaceholderText(/enter your question/i)[1];

    fireEvent.input(questionInput2, {
      target: { value: "What is the capital of Japan?" },
    });

    expect(
      screen.getByDisplayValue("What is the capital of France?")
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("What is the capital of Japan?")
    ).toBeInTheDocument();

    const previewButton = screen.getByRole("tab", { name: /preview/i });
    fireEvent.click(previewButton);

    expect(
      screen.getByText("What is the capital of France?")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("What is the capital of Japan?")
    ).not.toBeInTheDocument();
  });

  test("answer options appear in preview mode", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /add question/i }));

    fireEvent.input(screen.getByPlaceholderText(/enter your question/i), {
      target: { value: "Test question" },
    });

    fireEvent.input(screen.getByDisplayValue("Option A"), {
      target: { value: "Test answer" },
    });

    fireEvent.click(screen.getByRole("tab", { name: /preview/i }));

    expect(screen.queryByDisplayValue("Option A")).not.toBeInTheDocument();
    expect(screen.getByText("Test answer")).toBeInTheDocument();
  });
});
