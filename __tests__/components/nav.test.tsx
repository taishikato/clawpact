import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/__tests__/helpers/render";
import { Nav } from "@/components/nav";

// Mock next/link to render a plain anchor
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("Nav", () => {
  it("should render the ClawPact brand name", () => {
    render(<Nav />);
    expect(screen.getByText("ClawPact")).toBeInTheDocument();
  });

  it("should render a link to the home page", () => {
    render(<Nav />);
    const homeLink = screen.getByText("ClawPact").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should render a Dashboard link", () => {
    render(<Nav />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("should render a Sign in link", () => {
    render(<Nav />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("should link Dashboard to /dashboard", () => {
    render(<Nav />);
    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });

  it("should link Sign in to /login", () => {
    render(<Nav />);
    const signInLink = screen.getByText("Sign in").closest("a");
    expect(signInLink).toHaveAttribute("href", "/login");
  });
});
