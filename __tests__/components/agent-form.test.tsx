// TODO: Tests for the agent creation/edit form component
// This component does not exist yet. Tests are skipped and ready to activate
// once the form component is implemented.

import { describe, it } from "vitest";

describe("Agent form component", () => {
  it.skip("should render name input field", () => {
    // render(<AgentForm />);
    // expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it.skip("should render description input field", () => {
    // render(<AgentForm />);
    // expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it.skip("should render skills input", () => {
    // render(<AgentForm />);
    // expect(screen.getByLabelText(/skills/i)).toBeInTheDocument();
  });

  it.skip("should render submit button", () => {
    // render(<AgentForm />);
    // expect(screen.getByRole("button", { name: /submit|create|save/i })).toBeInTheDocument();
  });

  it.skip("should show validation error when name is empty on submit", () => {
    // render(<AgentForm />);
    // const submitBtn = screen.getByRole("button", { name: /submit|create|save/i });
    // await userEvent.click(submitBtn);
    // expect(screen.getByText(/name.*required/i)).toBeInTheDocument();
  });

  it.skip("should show validation error when description is empty on submit", () => {
    // render(<AgentForm />);
    // await userEvent.type(screen.getByLabelText(/name/i), "Agent");
    // const submitBtn = screen.getByRole("button", { name: /submit|create|save/i });
    // await userEvent.click(submitBtn);
    // expect(screen.getByText(/description.*required/i)).toBeInTheDocument();
  });

  it.skip("should call onSubmit with form data when valid", () => {
    // const onSubmit = vi.fn();
    // render(<AgentForm onSubmit={onSubmit} />);
    // await userEvent.type(screen.getByLabelText(/name/i), "Test Agent");
    // await userEvent.type(screen.getByLabelText(/description/i), "Does things");
    // await userEvent.click(screen.getByRole("button", { name: /submit|create|save/i }));
    // expect(onSubmit).toHaveBeenCalledWith({
    //   name: "Test Agent",
    //   description: "Does things",
    //   skills: [],
    // });
  });

  it.skip("should pre-fill form when editing an existing agent", () => {
    // const agent = createMockAgent({ name: "Existing", description: "Already here" });
    // render(<AgentForm agent={agent} />);
    // expect(screen.getByLabelText(/name/i)).toHaveValue("Existing");
    // expect(screen.getByLabelText(/description/i)).toHaveValue("Already here");
  });
});
