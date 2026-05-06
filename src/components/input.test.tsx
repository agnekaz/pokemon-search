import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Input from "./input";

it("Should have the correct input value and placeholder", () => {
  render(<Input value="pikachu" onChange={() => {}} />);

  const inputElement = screen.getByPlaceholderText(/Type pokemon name or id/i);

  expect(inputElement).toBeInTheDocument();
  expect(inputElement).toHaveValue("pikachu");
});

it("Should call onChange when user types", async () => {
  const mockOnChange = jest.fn();

  render(<Input value="p" onChange={mockOnChange}/>);

  const inputElement = screen.getByRole("textbox");

  await userEvent.type(inputElement, "p");

  expect(mockOnChange).toHaveBeenCalled();
  expect(mockOnChange).toHaveBeenCalledTimes(1);
  expect(inputElement).toHaveValue("p");
});