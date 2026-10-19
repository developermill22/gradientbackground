"""Generates the Langflow flow files in flows/ from the step prompts below.

Run with Langflow's own Python:
    ~/.langflow/.langflow-venv/bin/python workflow/build_flows.py [--project-dir PATH]
"""

import argparse
import importlib.util
import json
import sys
from pathlib import Path

from lfx.components.input_output import ChatInput, ChatOutput, TextInputComponent
from lfx.graph import Graph

HERE = Path(__file__).resolve().parent
COMPONENT_FILE = HERE / "components" / "claude_code_step.py"


def load_step_class():
    spec = importlib.util.spec_from_file_location("claude_code_step", COMPONENT_FILE)
    module = importlib.util.module_from_spec(spec)
    sys.modules["claude_code_step"] = module
    spec.loader.exec_module(module)
    return module.ClaudeCodeStep


ClaudeCodeStep = load_step_class()

READ_TOOLS = "Read,Glob,Grep,Bash(ls:*),Bash(cat:*),Bash(git status:*),Bash(git diff:*),Bash(git log:*)"

# Each step: (display name, instructions, allowed tools, permission mode, continue previous session)
STEPS = {
    "build": (
        "Build Component",
        """Build this as an Expo component in this project: {input}

If I gave an image path, read the image first and match it.
Before writing code, read the versioned Expo docs for every package you use (see AGENTS.md).
Put data in src/constants, components in src/components, and keep App.js as a small demo screen.
Use only built-in Animated with useNativeDriver unless you need something else, and say so if you do.
Install packages with `npx expo install` so versions match the SDK.
When finished, run `npx expo export --platform ios --output-dir /tmp/expo-export-check` to prove it bundles.
Reply with the files you created and the export result.""",
        READ_TOOLS + ",Edit,Write,WebFetch,Bash(mkdir:*),Bash(npx expo install:*),Bash(npx expo export:*)",
        "acceptEdits",
        False,
    ),
    "native": (
        "Native iOS Build",
        """Build the app for the iOS simulator with `npx expo run:ios --no-bundler 2>&1 | tail -200`.
If it succeeds, say so and name the simulator it installed on.
If it fails, report the exact error lines and the file and line they point to.
Do not fix anything in this step.""",
        READ_TOOLS + ",Bash(npx expo run:ios:*),Bash(tail:*),Bash(grep:*),Bash(xcrun simctl:*)",
        "default",
        True,
    ),
    "review": (
        "Code Review",
        """Run the code-review skill at high effort on the uncommitted changes.
Then check the component at phone width, with reduced motion on, and on Android.
List anything that would feel wrong on a real device.
Do not edit files. Report findings ranked by severity, then the native build result from the previous step.""",
        READ_TOOLS + ",Skill",
        "default",
        True,
    ),
    "fix": (
        "Fix Build Error",
        """The iOS build failed. Extra context from me: {input}

Pull the real errors from the build output (rerun `npx expo run:ios --no-bundler 2>&1 | tail -200` if you need it).
Before proposing any fix, reproduce the error in a minimal standalone test outside Xcode so each theory can be checked in seconds.
Show which theories you ruled out and why.
If the fix touches node_modules, make it durable with patch-package and document why it is safe in patches/README.md.
Finish by rebuilding and reporting whether it succeeded.""",
        READ_TOOLS
        + ",Edit,Write,WebFetch,WebSearch,Bash(npx:*),Bash(npm install:*),Bash(xcrun:*),Bash(swiftc:*),"
        "Bash(tail:*),Bash(grep:*),Bash(sed:*),Bash(mkdir:*),Bash(cp:*),Bash(rm -rf node_modules/expo-modules-jsi/apple/Products:*)",
        "acceptEdits",
        True,
    ),
    "writeup": (
        "Write-up for developermill.com",
        """Write this component up for developermill.com. Notes from my device testing: {input}

Cover what it does, the one core technique with the real code, the component API table, install and usage, and any build gotchas.
Save it as docs/developermill.md.
If the Artifact tool is available, also publish it as an artifact with a live demo and give me the link.""",
        READ_TOOLS + ",Edit,Write,Skill,Artifact,Bash(mkdir:*)",
        "acceptEdits",
        True,
    ),
    "commit": (
        "Commit and Update CLAUDE.md",
        """Commit the work with a clear message. Do not push.
Then add to CLAUDE.md anything a future component in this series should know: versions, patches, conventions we settled on.
Keep CLAUDE.md short and update existing lines instead of duplicating them. Commit that change too.
Reply with the commit hashes and what you added to CLAUDE.md.""",
        READ_TOOLS + ",Edit,Write,Bash(git add:*),Bash(git commit:*)",
        "acceptEdits",
        True,
    ),
}


def step(key, project_folder, upstream):
    name, instructions, tools, mode, cont = STEPS[key]
    node = ClaudeCodeStep(_id=f"ClaudeCodeStep-{key}")
    node.display_name = name
    node.set(
        input_value=upstream,
        project_dir=project_folder.text_response,
        instructions=instructions,
        allowed_tools=tools,
        permission_mode=mode,
        continue_session=cont,
    )
    return node


def chain(steps, project_dir, placeholder):
    chat_input = ChatInput(_id="ChatInput-start")
    chat_input.set(input_value=placeholder)
    folder = TextInputComponent(_id="TextInput-project")
    folder.display_name = "Project Folder"
    folder.set(input_value=project_dir)

    upstream = chat_input.message_response
    for key in steps:
        upstream = step(key, folder, upstream).run_step

    chat_output = ChatOutput(_id="ChatOutput-end")
    chat_output.set(input_value=upstream)
    return Graph(start=chat_input, end=chat_output)


FLOWS = [
    (
        "1 Build and Review",
        "Morning run: builds the component from your request, runs the native iOS build, then reviews the code.",
        ["build", "native", "review"],
        "A gradient background grid like the reference at /path/to/reference.png",
    ),
    (
        "2 Fix Build Error",
        "On demand: finds the cause of a failed native build with a minimal reproduction, patches it, and rebuilds.",
        ["fix"],
        "Paste the error here, or leave as is to read it from a fresh build.",
    ),
    (
        "3 Ship",
        "After device testing: writes the developermill.com post, commits, and records lessons in CLAUDE.md.",
        ["writeup", "commit"],
        "Device testing notes: feels smooth on iPhone, haptics OK.",
    ),
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--project-dir", default=str(HERE.parent), help="Expo project the flows work in")
    args = parser.parse_args()

    out_dir = HERE / "flows"
    out_dir.mkdir(exist_ok=True)
    for name, description, steps, placeholder in FLOWS:
        graph = chain(steps, args.project_dir, placeholder)
        dump = graph.dump(name=name, description=description)
        path = out_dir / f"{name.replace(' ', '_')}.json"
        path.write_text(json.dumps(dump, indent=2))
        print(f"wrote {path.relative_to(HERE.parent)}  ({len(dump['data']['nodes'])} nodes, {len(dump['data']['edges'])} edges)")


if __name__ == "__main__":
    main()
