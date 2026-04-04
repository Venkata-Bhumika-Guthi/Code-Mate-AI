from dotenv import load_dotenv
from langchain_core.globals import set_verbose, set_debug
from langchain_groq.chat_models import ChatGroq
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import create_react_agent

from agent.prompts import *
from agent.states import *
from agent.tools import write_file, read_file, get_current_directory, list_files

# Load env
load_dotenv()

set_debug(True)
set_verbose(True)

# LLM
llm = ChatGroq(model="openai/gpt-oss-120b")


# ---------------------------
# Planner Agent
# ---------------------------
def planner_agent(state: dict) -> dict:
    user_prompt = state["user_prompt"]

    resp = llm.with_structured_output(Plan).invoke(
        planner_prompt(user_prompt)
    )

    if resp is None:
        raise ValueError("Planner did not return a valid response.")

    return {"plan": resp}


# ---------------------------
# Architect Agent
# ---------------------------
def architect_agent(state: dict) -> dict:
    plan: Plan = state["plan"]

    resp = llm.with_structured_output(TaskPlan).invoke(
        architect_prompt(plan=plan.model_dump_json())
    )

    if resp is None:
        raise ValueError("Architect did not return a valid response.")

    resp.plan = plan
    print("Task Plan:", resp.model_dump_json())

    return {"task_plan": resp}


# ---------------------------
# Coder Agent (looping agent)
# ---------------------------
def coder_agent(state: dict) -> dict:
    coder_state: CoderState = state.get("coder_state")

    if coder_state is None:
        coder_state = CoderState(
            task_plan=state["task_plan"],
            current_step_idx=0
        )

    steps = coder_state.task_plan.implementation_steps

    # ✅ Stop condition
    if coder_state.current_step_idx >= len(steps):
        return {
            "coder_state": coder_state,
            "status": "DONE"
        }

    current_task = steps[coder_state.current_step_idx]

    # Read existing file
    existing_content = read_file.run(current_task.filepath)

    system_prompt = coder_system_prompt()

    user_prompt = (
        f"Task: {current_task.task_description}\n"
        f"File: {current_task.filepath}\n"
        f"Existing content:\n{existing_content}\n\n"
        "Write or update the file using write_file(path, content)."
    )

    coder_tools = [read_file, write_file, list_files, get_current_directory]

    react_agent = create_react_agent(llm, coder_tools)

    # Execute tool-based coding
    react_agent.invoke({
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    })

    # Move to next step
    coder_state.current_step_idx += 1

    return {"coder_state": coder_state}


# ---------------------------
# Graph Definition
# ---------------------------
graph = StateGraph(dict)

graph.add_node("planner", planner_agent)
graph.add_node("architect", architect_agent)
graph.add_node("coder", coder_agent)

# Flow
graph.set_entry_point("planner")

graph.add_edge("planner", "architect")
graph.add_edge("architect", "coder")

# ✅ Modern looping pattern (no Command)
graph.add_conditional_edges(
    "coder",
    lambda s: END if s.get("status") == "DONE" else "coder"
)

# Compile
agent = graph.compile()


# ---------------------------
# Run
# ---------------------------
if __name__ == "__main__":
    result = agent.invoke(
        {"user_prompt": "Build a colourful modern todo app in html css and js"},
        {"recursion_limit": 100}
    )
    print("Final State:", result)