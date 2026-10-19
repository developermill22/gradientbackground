import json
import os
import shutil
import subprocess

from lfx.custom.custom_component.component import Component
from lfx.io import BoolInput, DropdownInput, IntInput, MessageTextInput, MultilineInput, Output, StrInput
from lfx.schema.message import Message

# Langflow Desktop starts with a minimal PATH, so claude, node and npx may not resolve.
EXTRA_PATHS = ["/opt/homebrew/bin", "/usr/local/bin", os.path.expanduser("~/.local/bin")]


class ClaudeCodeStep(Component):
    display_name = "Claude Code Step"
    description = "Runs one workflow step with Claude Code (claude -p) inside a project folder."
    icon = "terminal"
    name = "ClaudeCodeStep"

    inputs = [
        MessageTextInput(
            name="input_value",
            display_name="Input",
            info="Text from the previous node. Inserted wherever {input} appears in Instructions.",
            value="",
        ),
        MultilineInput(
            name="instructions",
            display_name="Instructions",
            info="The prompt for this step. Use {input} to include the incoming text.",
            value="{input}",
        ),
        MessageTextInput(
            name="project_dir",
            display_name="Project Folder",
            info="Absolute path of the Expo project Claude works in. Connect the Project Folder node.",
            value="",
        ),
        BoolInput(
            name="continue_session",
            display_name="Continue Previous Session",
            info="Pass --continue so this step keeps the context of the last step in this folder.",
            value=True,
        ),
        DropdownInput(
            name="permission_mode",
            display_name="Permission Mode",
            options=["acceptEdits", "default", "plan"],
            value="acceptEdits",
            info="acceptEdits: file edits are approved; other tools must be in Allowed Tools.",
        ),
        StrInput(
            name="allowed_tools",
            display_name="Allowed Tools",
            info='Comma-separated, e.g. Read,Edit,Bash(npx expo export:*). Anything else is denied.',
            value="Read,Glob,Grep",
            advanced=True,
        ),
        StrInput(
            name="model",
            display_name="Model",
            info="Optional model alias or ID. Blank uses your Claude Code default.",
            value="",
            advanced=True,
        ),
        IntInput(
            name="timeout_minutes",
            display_name="Timeout (minutes)",
            value=30,
            advanced=True,
        ),
    ]

    outputs = [
        Output(display_name="Result", name="result", method="run_step"),
    ]

    def _claude_path(self) -> str:
        found = shutil.which("claude", path=os.pathsep.join([*EXTRA_PATHS, os.environ.get("PATH", "")]))
        if not found:
            msg = "Claude Code CLI not found. Install it, or check that `claude` is in /opt/homebrew/bin or ~/.local/bin."
            raise ValueError(msg)
        return found

    def run_step(self) -> Message:
        project_dir = os.path.expanduser(self.project_dir.strip())
        if not project_dir or not os.path.isdir(project_dir):
            msg = f"Project Folder does not exist: {project_dir!r}. Set it to your Expo project's absolute path."
            raise ValueError(msg)

        prompt = self.instructions.replace("{input}", self.input_value or "")
        cmd = [
            self._claude_path(),
            "-p",
            prompt,
            "--output-format",
            "json",
            "--permission-mode",
            self.permission_mode,
        ]
        tools = [t.strip() for t in self.allowed_tools.split(",") if t.strip()]
        if tools:
            cmd += ["--allowedTools", *tools]
        if self.continue_session:
            cmd.append("--continue")
        if self.model.strip():
            cmd += ["--model", self.model.strip()]

        env = {**os.environ, "PATH": os.pathsep.join([*EXTRA_PATHS, os.environ.get("PATH", "")])}
        try:
            proc = subprocess.run(  # noqa: S603
                cmd,
                cwd=project_dir,
                env=env,
                capture_output=True,
                text=True,
                timeout=self.timeout_minutes * 60,
                check=False,
            )
        except subprocess.TimeoutExpired as e:
            msg = f"Step stopped after {self.timeout_minutes} minutes. Raise Timeout in the node's advanced settings."
            raise ValueError(msg) from e

        try:
            payload = json.loads(proc.stdout)
        except json.JSONDecodeError as e:
            msg = f"Claude Code exited with code {proc.returncode}.\n{proc.stderr.strip() or proc.stdout.strip()}"
            raise ValueError(msg) from e

        result = payload.get("result", "")
        if payload.get("is_error") or proc.returncode != 0:
            msg = f"Claude Code reported an error:\n{result or proc.stderr.strip()}"
            raise ValueError(msg)

        cost = payload.get("total_cost_usd")
        footer = f"\n\n---\nsession {payload.get('session_id', '?')} · {payload.get('num_turns', '?')} turns"
        if cost is not None:
            footer += f" · ${cost:.2f}"
        self.status = result
        return Message(text=result + footer)
