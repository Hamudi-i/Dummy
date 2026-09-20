import { Extension } from "@tiptap/core";
import { yCursorPlugin, defaultSelectionBuilder } from "@tiptap/y-tiptap";

const awarenessStatesToArray = (states: Map<number, any>) => {
  return Array.from(states.entries()).map(([key, value]) => {
    return {
      clientId: key,
      ...value.user,
    };
  });
};

export interface CollaborationCursorOptions {
  provider: any;
  user: {
    name: string | null;
    color: string | null;
  };
  render?: (user: Record<string, any>) => HTMLElement;
}

export const CollaborationCursor = Extension.create<CollaborationCursorOptions>({
  name: "collaborationCursor",
  addOptions() {
    return {
      provider: null,
      user: {
        name: null,
        color: null,
      },
      render: (user: Record<string, any>) => {
        const cursor = document.createElement("span");
        cursor.classList.add("collaboration-cursor__caret");
        cursor.setAttribute("style", `border-color: ${user.color}`);

        const label = document.createElement("div");
        label.classList.add("collaboration-cursor__label");
        label.setAttribute("style", `background-color: ${user.color}`);
        label.insertBefore(document.createTextNode(user.name || "Collaborator"), null);
        cursor.insertBefore(label, null);

        return cursor;
      },
    };
  },

  addStorage() {
    return {
      users: [],
    };
  },

  addCommands() {
    return {
      updateUser:
        (attributes: Record<string, any>) =>
          () => {
            this.options.user = attributes as any;
            this.options.provider?.awareness?.setLocalStateField("user", this.options.user);
            return true;
          },
    } as any;
  },

  addProseMirrorPlugins() {
    if (!this.options.provider?.awareness) {
      return [];
    }

    const awareness = this.options.provider.awareness;

    return [
      yCursorPlugin(
        (() => {
          awareness.setLocalStateField("user", this.options.user);
          this.storage.users = awarenessStatesToArray(awareness.states);
          awareness.on("update", () => {
            this.storage.users = awarenessStatesToArray(awareness.states);
          });
          return awareness;
        })(),
        {
          cursorBuilder: this.options.render,
          selectionBuilder: defaultSelectionBuilder,
        }
      ),
    ];
  },
});

