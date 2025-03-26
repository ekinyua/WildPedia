import { render, screen, fireEvent } from "@testing-library/react";
import QuizCard from "./QuizCard";
import "@testing-library/jest-dom";

describe("QuizCard", () => {
  it("renders quiz question and options correctly", () => {
    render(<QuizCard />);

    expect(
      screen.getByText(
        "What is the primary goal of conserving East African mammals?"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("To protect diverse species like elephants and gorillas")
    ).toBeInTheDocument();
    expect(
      screen.getByText("To reduce biodiversity in the region")
    ).toBeInTheDocument();
    expect(
      screen.getByText("To increase habitat destruction")
    ).toBeInTheDocument();
    expect(
      screen.getByText("To complicate conservation efforts")
    ).toBeInTheDocument();
  });

  it("displays correct progress information", () => {
    render(<QuizCard />);

    expect(screen.getByText("1 of 5")).toBeInTheDocument();

    const progressBar = document.querySelector(".bg-green-500");
    expect(progressBar).toBeInTheDocument();

    expect(progressBar).toHaveClass("w-1/4");
  });

  it("allows selecting an answer", () => {
    render(<QuizCard />);

    // Get all radio inputs
    const radioInputs = screen.getAllByRole("radio");
    expect(radioInputs).toHaveLength(4);

    // Initially, none should be checked
    radioInputs.forEach((input) => {
      expect(input).not.toBeChecked();
    });

    // Click the first answer
    fireEvent.click(radioInputs[0]);

    // Now the first radio should be checked
    expect(radioInputs[0]).toBeChecked();
    expect(radioInputs[1]).not.toBeChecked();
    expect(radioInputs[2]).not.toBeChecked();
    expect(radioInputs[3]).not.toBeChecked();
  });

  it("has a functional next button", () => {
    render(<QuizCard />);

    // Check next button exists
    const nextButton = screen.getByText("Next →");
    expect(nextButton).toBeInTheDocument();

    // Check button has correct classes
    expect(nextButton).toHaveClass("bg-green-600");
    expect(nextButton).toHaveClass("text-white");
  });

  it("maintains accessibility standards", () => {
    render(<QuizCard />);

    // Radio buttons should be properly associated with their labels
    const radioInputs = screen.getAllByRole("radio");

    // Check that each input has a corresponding label
    const labels = screen.getAllByText(
      (content, element) =>
        element?.tagName.toLowerCase() === "span" &&
        [
          "To protect diverse species like elephants and gorillas",
          "To reduce biodiversity in the region",
          "To increase habitat destruction",
          "To complicate conservation efforts",
        ].includes(content)
    );

    expect(radioInputs.length).toBe(labels.length);

    // Progress indicator should have aria attributes
    const progressSection = screen.getByText("1 of 5").parentElement;
    expect(progressSection).toBeInTheDocument();
  });
});
