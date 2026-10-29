"use client";

import type { DragEvent, ReactNode } from "react";

export function DraggableLinkList({ children }: { children: ReactNode }) {
  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    const item = (event.target as HTMLElement).closest<HTMLElement>("[data-drag-id]");
    if (!item) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", item.dataset.dragId ?? "");
    item.dataset.dragging = "true";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    const list = event.currentTarget;
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-drag-id]");
    if (!target || target.parentElement !== list || target.dataset.dragging === "true") return;

    const bounds = target.getBoundingClientRect();
    const insertAfter = event.clientY > bounds.top + bounds.height / 2;
    const indicator = list.querySelector<HTMLElement>("[data-drop-indicator]") ?? document.createElement("div");
    if (!indicator.hasAttribute("data-drop-indicator")) {
      indicator.dataset.dropIndicator = "true";
      indicator.setAttribute("aria-hidden", "true");
      indicator.className = "pointer-events-none h-0.5 rounded-full bg-[var(--accent)] shadow-[0_0_0_2px_white]";
    }

    const positionIsCurrent = insertAfter
      ? indicator.previousElementSibling === target
      : indicator.nextElementSibling === target;
    if (!positionIsCurrent) list.insertBefore(indicator, insertAfter ? target.nextSibling : target);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const list = event.currentTarget;
    const draggedId = event.dataTransfer.getData("text/plain");
    const dragged = Array.from(list.children).find(
      (child) => (child as HTMLElement).dataset.dragId === draggedId,
    );
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-drag-id]");
    const indicator = list.querySelector<HTMLElement>("[data-drop-indicator]");
    if (!dragged || dragged === target || dragged.parentElement !== list) return;

    if (indicator) {
      list.insertBefore(dragged, indicator);
      indicator.remove();
    } else {
      if (!target || target.parentElement !== list) return;
      const bounds = target.getBoundingClientRect();
      const insertAfter = event.clientY > bounds.top + bounds.height / 2;
      list.insertBefore(dragged, insertAfter ? target.nextSibling : target);
    }
    delete (dragged as HTMLElement).dataset.dragging;
  }

  function handleDragEnd(event: DragEvent<HTMLDivElement>) {
    const item = (event.target as HTMLElement).closest<HTMLElement>("[data-drag-id]");
    if (item) delete item.dataset.dragging;
    event.currentTarget.querySelector("[data-drop-indicator]")?.remove();
  }

  return (
    <div
      className="space-y-3"
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      {children}
    </div>
  );
}
