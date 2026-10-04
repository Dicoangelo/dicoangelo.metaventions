import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ContactSection } from "../sections/ContactSection";

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

function fillForm() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "A Visitor" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "visitor@example.com" } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Let's discuss a project." } });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
}

describe("contact form", () => {
  it("shows both contact emails", () => {
    render(<ContactSection isLight={false} />);
    expect(screen.getByRole("link", { name: "dicoangelo@metaventionsai.com" })).toHaveAttribute("href", "mailto:dicoangelo@metaventionsai.com");
    expect(screen.getByRole("link", { name: "dico.angelo97@gmail.com" })).toHaveAttribute("href", "mailto:dico.angelo97@gmail.com");
  });

  it("shows success only after the API confirms acceptance", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    render(<ContactSection isLight={false} />);
    fillForm();
    expect(await screen.findByRole("status")).toHaveTextContent("Message sent.");
  });

  it("retains the message and shows a useful error after a delivery failure", async () => {
    fetchMock.mockResolvedValue({ ok: false, json: async () => ({ error: "Please wait a minute before trying again." }) });
    render(<ContactSection isLight={true} />);
    fillForm();
    expect(await screen.findByRole("alert")).toHaveTextContent("Please wait a minute before trying again.");
    expect(screen.getByLabelText("Message")).toHaveValue("Let's discuss a project.");
    expect(screen.queryByText("Message sent.")).not.toBeInTheDocument();
  });

  it("does not show success for an unexpected successful HTTP response", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    render(<ContactSection isLight={false} />);
    fillForm();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Failed to send."));
    expect(screen.queryByText("Message sent.")).not.toBeInTheDocument();
  });
});
