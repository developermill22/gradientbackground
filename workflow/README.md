# Component workflow in Langflow

Three Langflow flows that run the daily component workflow with Claude Code.
Each step is a **Claude Code Step** node that runs `claude -p` inside your project
folder, so Claude can read, edit and build the real project. Steps in a flow share
one Claude session (`--continue`), so later steps remember earlier ones.

| Flow | When | Steps |
|---|---|---|
| `1 Build and Review` | Start of the day | Build component → native iOS build → code review |
| `2 Fix Build Error` | Only if the build failed | Minimal reproduction → fix → rebuild |
| `3 Ship` | After you test on a phone | developermill.com write-up → commit + update CLAUDE.md |

Your own steps sit between the flows: check the review, then test on a real phone.

## One-time setup

1. Open **Langflow Desktop**.
2. On the Langflow home page, choose **Upload a flow** (or drag the files in) and add the three files in `workflow/flows/`.
3. Claude Code must be signed in on this Mac (`claude` in a terminal). No API key is needed; the steps use your Claude Code login.

## Every day

1. Start a project: `workflow/new-component.sh MyComponent`
   Creates `ComponentSeries/MyComponent` from the Expo SDK 57 bare template with CLAUDE.md, folders, and the Xcode 26.2 patch already applied.
2. In each flow, set the **Project Folder** node to the new project's path.
3. Run **1 Build and Review** from the Playground. Describe the component and give the reference image path, e.g.
   `A glowing analytics card grid like /Users/you/Desktop/ref.png`
4. Read the review. If the native build failed, run **2 Fix Build Error**.
5. Run `npx expo start --dev-client` and test on your phone.
6. Run **3 Ship** with your testing notes.

## What each step may do

Steps run unattended, so each one has an allowlist (the node's advanced **Allowed Tools**
setting). Anything outside it is refused, not asked about.

- Build: read and edit files, fetch Expo docs, `npx expo install`, `npx expo export`
- Native build and review: read only, plus `npx expo run:ios` and the code-review skill; review cannot edit
- Fix: edits, `npx`, `xcrun`, `swiftc` for minimal reproductions, web search
- Ship: edits, `git add`, `git commit`. Never `git push`

To loosen or tighten a step, edit its Allowed Tools in Langflow, or change `STEPS`
in `build_flows.py` and regenerate.

## Changing the flows

Prompts and permissions live in `build_flows.py`. Regenerate the JSON with
Langflow's Python, then re-upload:

```
~/.langflow/.langflow-venv/bin/python workflow/build_flows.py --project-dir /path/to/project
```

## Files

- `components/claude_code_step.py` — the custom Langflow node
- `build_flows.py` — step prompts and permissions; generates `flows/`
- `flows/` — the three importable flows
- `new-component.sh` — creates a new project with the conventions in place
- `templates/` — CLAUDE.md, AGENTS.md and patch notes copied into new projects
