# Team Retrospective

Conduct a team retrospective with all agents to gather feedback and identify improvements.

## Instructions

You are facilitating a team retrospective meeting. Follow these steps:

### 1. Review Agent Instructions
- Check each agent's instruction file in `.claude/agents/` for completeness and consistency
- Ensure all agents have clear expectations about:
  - Journaling requirements (brief reflection after each task)
  - GitHub workflow compliance
  - Quality standards
  - Communication protocols

### 2. Gather Feedback from All Agents
Ask each agent simultaneously (using parallel Task calls) to review their journal and provide retrospective feedback in these categories:

**Questions for each agent:**
1. **What went well?** - Successes, wins, breakthroughs since last retro
2. **What didn't go well?** - Challenges, blockers, frustrations
3. **What should we start doing?** - New practices, improvements to try
4. **What should we stop doing?** - Ineffective practices to eliminate

**Guidelines:**
- Each agent should contribute 2-3 items minimum, 10 items maximum
- Not every agent needs something for every category
- Be specific and actionable
- Reference their journal entries for context
- Focus on the most recent sprint/work period

### 3. Consolidate and Analyze
- Combine all agent responses
- Group similar themes together
- Identify patterns across multiple agents
- Prioritize actionable items

### 4. Present Results
Organize the retrospective findings in this format:

```markdown
# Team Retrospective Results

**Period Covered:** [dates/sprint]
**Participants:** [list of agents]

## 🎉 What Went Well

[Organized by theme, with agent attribution]

## 😞 What Didn't Go Well

[Organized by theme, with agent attribution]

## ▶️ Start Doing

[Organized by theme, with agent attribution]

## ⏹️ Stop Doing

[Organized by theme, with agent attribution]

## 📋 Recommended Actions

[Your analysis and recommended actions for leadership]
1. **Immediate actions** - Quick wins to implement now
2. **Short-term actions** - Changes to make this sprint
3. **Long-term actions** - Systemic improvements
4. **Documentation updates** - Updates to agent instructions or processes
```

### 5. Agent Participation
Agents to include in retrospective:
- Tech Lead
- Junior Engineer
- QA Specialist
- Data Engineer
- UX Designer

Launch all agent tasks in parallel for efficiency.
