import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Modal } from "./modal.tsx";

describe("Modal", () => {
  it("should open and close", () => {
    render(
      <Modal
        open={false}
        onClose={() => undefined}
        setModalOpen={function (): void {
          throw new Error("Function not implemented.");
        }}
      >
        Closed modal
      </Modal>,
    );
    expect(screen.queryByText("Closed modal")).toBeFalsy();

    render(
      <Modal
        open
        onClose={() => undefined}
        setModalOpen={function (): void {
          throw new Error("Function not implemented.");
        }}
      >
        <div>Open modal</div>
      </Modal>,
    );
    expect(screen.getByText("Open modal")).toBeTruthy();
  });
});
