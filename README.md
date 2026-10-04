# TokenBuddy - Local AI Prompt & Token Optimization Assistant

<div align="center">

![TokenBuddy](https://img.shields.io/badge/TokenBuddy-AI%20Optimization-purple)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss)
![Ollama](https://img.shields.io/badge/Ollama-Local%20AI-black)
![Gemma](https://img.shields.io/badge/Gemma-Open%20Weight-orange)
![License](https://img.shields.io/badge/License-MIT-green)

**Save tokens. Save context. Keep your AI private.**

[Demo User](#-demo-user) • [Features](#-features) • [How It Works](#%EF%B8%8F-how-it-works) • [Getting Started](#-getting-started)

</div>

---

## 🎯 Overview

**TokenBuddy** is a local-first AI prompt optimization assistant designed for people who use AI frequently and want to reduce unnecessary prompt length, token usage, and estimated AI costs.

Modern AI applications often send long prompts containing unnecessary words, repeated instructions, conversational filler, and redundant formatting. These extra tokens can increase cost, latency, and context usage.

TokenBuddy addresses this problem by optimizing prompts before they are sent to an AI model.

The project can use an open-weight **Gemma model running locally through Ollama**, allowing prompt optimization to happen on the user's own machine.

When local AI inference is unavailable, TokenBuddy automatically uses a deterministic fallback optimizer so the application can continue working.

### Core Idea

```text
User Prompt
     ↓
TokenBuddy
     ↓
Analyze Prompt
     ↓
Local Gemma AI
     │
     ├── Available → AI-powered optimization
     │
     └── Unavailable → Deterministic fallback
     ↓
Optimized Prompt
     ↓
Token & Cost Comparison
```

---

## 🌟 Why TokenBuddy?

AI usage is becoming part of everyday development, education, research, and productivity.

However, users often:

* Send unnecessarily long prompts
* Repeat the same instructions
* Use expensive models for simple tasks
* Have little visibility into prompt size
* Waste context window space
* Send private information to cloud services unnecessarily

TokenBuddy provides a simple layer between the user and their AI workflow.

Instead of immediately sending a large prompt:

```text
Original Prompt
       ↓
   TokenBuddy
       ↓
Optimized Prompt
       ↓
      LLM
```

This makes prompts shorter, clearer, and potentially cheaper.

---

# ✨ Features

## 🏠 Landing Page

TokenBuddy provides a simple landing page explaining the problem and solution.

### Features

* TokenBuddy branding
* Local AI messaging
* Privacy-first positioning
* Prompt optimization explanation
* Feature highlights
* Demo User access
* Responsive interface
* Modern dashboard-style design

---

# 👤 Demo User

TokenBuddy is designed for quick demonstration without requiring account creation.

### Demo Flow

```text
Landing Page
     ↓
Demo User
     ↓
Dashboard
```

There is no requirement for:

* Email
* Password
* Registration
* External authentication
* Backend account creation

This makes the application easy to demonstrate during hackathons and presentations.

---

# 📊 Dashboard

The TokenBuddy dashboard provides a central place to access the optimization workflow.

### Dashboard Features

* Token usage overview
* Optimization statistics
* Estimated savings
* Prompt optimization access
* Model-related information
* Analytics
* Quick navigation
* Responsive layout

The dashboard is designed to give the user a quick understanding of their AI prompt usage.

---

# ✨ Prompt Optimizer

The **Prompt Optimizer** is the main feature of TokenBuddy.

Users can enter any AI prompt and generate a more concise version.

### Workflow

```text
Enter Prompt
     ↓
Analyze Prompt
     ↓
Choose Optimization Mode
     ↓
Optimize
     ↓
Compare Results
     ↓
Copy Optimized Prompt
```

### Features

* Enter or paste prompts
* Local Gemma optimization
* Deterministic fallback optimization
* Before/after comparison
* Token estimation
* Token reduction percentage
* Estimated cost comparison
* Copy optimized prompt
* Multiple optimization modes
* Optimization quality indicator

---

# 🧠 Optimization Modes

TokenBuddy provides different levels of prompt compression.

## 1. Lean Mode

Designed for normal everyday prompt optimization.

It removes:

* Conversational filler
* Unnecessary phrases
* Redundant wording
* Excessive whitespace
* Unnecessary punctuation

### Example

**Before**

```text
Could you please explain to me in a very detailed way
what artificial intelligence is and how it is used today?
```

**After**

```text
Explain artificial intelligence and its current applications.
```

---

## 2. Structured Mode

Designed for prompts containing multiple instructions.

It attempts to preserve the logical structure while removing unnecessary wording.

### Example

**Original**

```text
Please analyze the following text carefully and provide
a detailed explanation of the main points. Also make sure
to include examples wherever possible.
```

**Optimized**

```text
Analyze the text. Explain the main points with examples.
```

---

## 3. Ultra-Short Mode

Designed for maximum compression.

It removes non-essential language while attempting to preserve the main intent.

### Example

**Original**

```text
Can you please give me a simple explanation of machine learning?
```

**Ultra-Short**

```text
Explain machine learning simply.
```

---

# 🤖 Local Gemma AI

TokenBuddy can use an open-weight **Gemma model through Ollama** as its local AI engine.

The application communicates with the local Ollama API:

```text
http://127.0.0.1:11434/api/generate
```

The request flow is:

```text
TokenBuddy UI
      ↓
Next.js API Route
      ↓
Local Ollama
      ↓
Gemma
      ↓
Optimized Prompt
      ↓
TokenBuddy UI
```

Because Ollama runs locally, the prompt does not need to be sent to a third-party cloud AI provider for the optimization step.

---

# 🔐 Privacy-First Design

Privacy is one of the main ideas behind TokenBuddy.

Traditional AI workflows may look like:

```text
User
 ↓
Cloud Application
 ↓
Cloud LLM
 ↓
Response
```

TokenBuddy can instead use:

```text
User
 ↓
TokenBuddy
 ↓
Local Ollama
 ↓
Local Gemma
 ↓
Optimized Prompt
```

This provides a local option for users who do not want prompt content unnecessarily transmitted to external AI services.

### Benefits

* Local inference
* Reduced dependency on cloud AI APIs
* Better control over prompt data
* Suitable for offline/local workflows
* No external AI API key required for Gemma inference
* Open-weight model support

---

# 🛡️ Deterministic Fallback Optimizer

TokenBuddy does not completely depend on the local AI model.

If Ollama or Gemma is unavailable, the application automatically falls back to a deterministic optimization engine.

```text
              ┌───────────────┐
              │ User Prompt   │
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │ TokenBuddy API│
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │ Ollama/Gemma? │
              └───────┬───────┘
                YES   │   NO
                 ↓    │    ↓
              Gemma   │  Fallback
                 │    │    │
                 └────┴────┘
                      ↓
              Optimized Prompt
```

This improves reliability during:

* Ollama downtime
* Model startup delays
* Local inference errors
* Network-independent usage
* Demonstrations where Gemma is not available

---

# 🧮 Token Estimation

TokenBuddy provides before-and-after token estimates.

For example:

```text
Original Prompt
Tokens:       120

Optimized Prompt
Tokens:        72

Reduction:     40%
```

The application also estimates the potential cost difference.

```text
Original Estimated Cost
        ↓
Optimized Estimated Cost
        ↓
Potential Savings
```

> TokenBuddy's token calculation is an estimation mechanism and should not be treated as an exact tokenizer for every commercial or open-weight model.

---

# 💰 Cost Optimization

Longer prompts can consume more input tokens.

TokenBuddy helps users understand how prompt compression can affect estimated usage.

### Example

```text
Original
───────────────
120 tokens
$0.0040

       ↓

Optimized
───────────────
72 tokens
$0.0024

Potential reduction
───────────────
40%
```

Actual savings depend on the model, provider, pricing, and output length.

---

# 🧩 Architecture

TokenBuddy follows a lightweight Next.js architecture.

```text
┌───────────────────────────────────────────┐
│              TokenBuddy UI                │
│                                           │
│ Landing │ Dashboard │ Optimizer │ Charts  │
└──────────────────────┬────────────────────┘
                       │
                       ↓
┌───────────────────────────────────────────┐
│             Next.js Application           │
│                                           │
│ React + TypeScript + App Router           │
└──────────────────────┬────────────────────┘
                       │
                       ↓
                /api/optimize
                       │
              ┌────────┴────────┐
              │                 │
              ↓                 ↓
       Local Ollama       Fallback Engine
              │                 │
              ↓                 │
            Gemma               │
              │                 │
              └────────┬────────┘
                       ↓
              Optimized Prompt
```

---

# ⚙️ How It Works

## Step 1 — User enters a prompt

Example:

```text
Can you please explain in detail what cloud computing is
and provide some examples that a beginner can understand?
```

## Step 2 — TokenBuddy analyzes the prompt

The application estimates:

* Prompt length
* Token count
* Potential optimization
* Estimated cost

## Step 3 — Local AI optimization

If Ollama is available:

```text
TokenBuddy → Ollama → Gemma
```

Gemma generates a concise version.

## Step 4 — Fallback if required

If Ollama is unavailable:

```text
TokenBuddy → Deterministic Optimizer
```

## Step 5 — Results

The interface displays:

* Original prompt
* Optimized prompt
* Token count
* Percentage saved
* Estimated cost
* Optimization mode
* Optimization source

---

# 🔌 API

TokenBuddy includes an optimization API route.

## Endpoint

```text
POST /api/optimize
```

### Request

```json
{
  "prompt": "Explain artificial intelligence in simple terms.",
  "mode": "lean"
}
```

### Processing

```text
POST /api/optimize
        ↓
Validate prompt
        ↓
Try local Ollama
        ↓
Gemma optimization
        ↓
Calculate metrics
        ↓
Return result
```

If local inference fails, the route falls back to the deterministic optimizer.

---

# 📦 Technology Stack

## Frontend

| Technology                       | Purpose                 |
| -------------------------------- | ----------------------- |
| Next.js 16                       | Application framework   |
| React 19                         | UI                      |
| TypeScript                       | Type-safe development   |
| Tailwind CSS                     | Styling                 |
| Base UI / Radix-style components | UI primitives           |
| Lucide React                     | Icons                   |
| Recharts                         | Charts and analytics    |
| Zustand                          | Client state management |

## AI

| Technology              | Purpose                    |
| ----------------------- | -------------------------- |
| Gemma                   | Open-weight local AI model |
| Ollama                  | Local model runtime        |
| Deterministic Optimizer | Fallback optimization      |

## Development

| Tool                  | Purpose                          |
| --------------------- | -------------------------------- |
| npm                   | Package management               |
| Git                   | Version control                  |
| GitHub                | Source control and collaboration |
| VS Code / Antigravity | Development environment          |

---

# 📁 Project Structure

```text
tokenbuddy/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (auth)/
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── prompt-optimizer/
│   │       │   └── page.tsx
│   │       ├── playground/
│   │       ├── analytics/
│   │       ├── model-router/
│   │       └── settings/
│   │
│   ├── api/
│   │   └── optimize/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── ...
│
├── lib/
│   ├── token-optimizer.ts
│   ├── constants.ts
│   ├── mock-data.ts
│   └── ...
│
├── public/
│   └── ...
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── README.md
└── ...
```

---

# 🚀 Getting Started

## Prerequisites

Install the following:

* Node.js 18+
* npm
* Git
* Ollama
* Gemma model

---

## 1. Clone the Repository

```bash
git clone https://github.com/sathvi1234/sathvi1234-tokenbuddy.git
```

Move into the project:

```bash
cd sathvi1234-tokenbuddy
```

---

## 2. Install Dependencies

```bash
npm install
```

---

# 🤖 Install Ollama

Download and install Ollama for your operating system.

After installation, verify:

```bash
ollama --version
```

---

# 🧠 Install Gemma

Pull the Gemma model:

```bash
ollama pull gemma2
```

Verify the installed model:

```bash
ollama list
```

You should see the Gemma model listed.

---

# ▶️ Run Gemma

You can test Gemma directly:

```bash
ollama run gemma2
```

Try:

```text
Optimize this prompt:
Explain artificial intelligence in simple terms.
```

If Gemma responds, local inference is working.

---

# ▶️ Run TokenBuddy

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧪 Test the Application

## Test 1 — Landing Page

Open:

```text
http://localhost:3000
```

Verify:

* TokenBuddy branding
* Features
* Demo User button
* Local AI messaging

---

## Test 2 — Demo User

Click:

```text
Demo User
```

Verify that you can directly access the dashboard without entering credentials.

---

## Test 3 — Prompt Optimizer

Navigate to:

```text
Dashboard → Prompt Optimizer
```

Enter:

```text
Can you please explain to me in detail what artificial intelligence is and give me some examples that are easy for beginners to understand?
```

Click:

```text
Optimize
```

---

## Test 4 — Local Gemma

If Ollama is running correctly, the result should indicate:

```text
Local Gemma
```

This confirms that the optimization request was processed using local Gemma.

---

## Test 5 — Fallback

If Ollama is unavailable, TokenBuddy should still optimize the prompt using:

```text
Fallback Optimizer
```

The application should continue functioning instead of failing completely.

---

# 🔍 Checking Ollama Manually

To check whether Ollama is running:

```powershell
Invoke-RestMethod http://127.0.0.1:11434/api/tags
```

You can also run:

```powershell
ollama list
```

If Gemma is installed, it should appear in the model list.

---

# 🧪 Development Commands

## Start development server

```bash
npm run dev
```

## Create production build

```bash
npm run build
```

## Start production server

```bash
npm start
```

## Type checking

```bash
npx tsc --noEmit
```

---

# 🔒 Privacy & Security

TokenBuddy is designed around local-first AI usage.

### Local inference

When configured with Ollama:

```text
User Prompt
     ↓
TokenBuddy
     ↓
Local Ollama
     ↓
Local Gemma
```

The prompt optimization request can remain on the user's machine.

### No required cloud AI API key

Gemma inference through Ollama does not require an OpenAI, Gemini, or other commercial cloud API key.

### No account requirement

The demo workflow does not require:

* Email
* Password
* Registration
* External authentication

---

# 🌍 Why Open Innovation Matters

TokenBuddy demonstrates how open-weight AI can make useful AI functionality more accessible.

With a local model, developers can:

* Run AI on their own machine
* Keep sensitive prompts local
* Experiment without depending on a single cloud provider
* Swap models
* Modify the application behavior
* Build offline-capable workflows
* Reduce recurring API costs for experimentation
* Understand and control the AI pipeline more directly

Instead of treating AI as a black-box cloud service, TokenBuddy treats the model as a component that can be run and controlled locally.

---

# 💡 Use Cases

TokenBuddy can be useful for:

### 👨‍💻 Developers

Reduce repetitive instructions in coding prompts.

### 🎓 Students

Create shorter prompts for assignments, learning, and research.

### 🧑‍💼 Professionals

Optimize prompts used repeatedly during daily work.

### 🤖 AI Builders

Experiment with local open-weight models.

### 🔐 Privacy-Conscious Users

Keep prompt optimization local when using Ollama.

### 💰 Budget-Conscious AI Users

Understand potential token and cost reductions before sending prompts to larger models.

---

# 📈 Example Workflow

### Before

```text
Could you please help me by explaining what machine learning
is in a simple and easy-to-understand way because I am a beginner
and I would also appreciate it if you could provide a few practical
examples so that I can understand the concept better?
```

### After

```text
Explain machine learning simply with practical beginner examples.
```

### Result

```text
Original Tokens
      ↓
     60

Optimized Tokens
      ↓
     12

Potential Reduction
      ↓
     80%
```

> Token counts shown by TokenBuddy are estimates and may differ from the exact tokenizer used by a particular model.

---

# 🧠 Design Philosophy

TokenBuddy follows four principles.

## 1. Local First

Prefer local AI inference whenever practical.

## 2. Simple

Users should not need to understand AI infrastructure to optimize a prompt.

## 3. Transparent

Show users what changed instead of silently modifying their prompts.

## 4. Resilient

The application should remain useful even when local AI inference is unavailable.

---

# 🏗️ Current Implementation

TokenBuddy currently contains:

* Next.js application
* React-based UI
* TypeScript
* Prompt Optimizer
* Multiple optimization modes
* Local Ollama integration
* Gemma integration path
* Deterministic fallback optimizer
* Token estimation
* Cost estimation
* Before/after comparison
* Demo User workflow
* Dashboard
* Analytics interface
* Responsive UI
* Local API route

---

# 🔮 Future Roadmap

Possible future improvements include:

### AI Improvements

* Support additional open-weight models
* Llama-family models
* Qwen models
* Mistral models
* Automatic model selection
* Local model benchmarking
* Prompt quality scoring

### Token Optimization

* Model-specific tokenizers
* More advanced semantic compression
* Context-aware optimization
* Prompt templates
* Reusable prompt library
* Batch optimization

### Cost Intelligence

* More provider pricing models
* Model cost comparison
* Monthly budget tracking
* Usage forecasting
* Cost alerts

### Privacy

* Fully offline mode
* Local history
* Encrypted local storage
* Configurable data retention

### Developer Features

* CLI support
* Browser extension
* VS Code extension
* API access
* Prompt optimization middleware

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

Fork the project on GitHub, then clone your fork:

```bash
git clone https://github.com/<your-username>/sathvi1234-tokenbuddy.git
```

### 2. Create a branch

```bash
git checkout -b feature/my-feature
```

### 3. Make your changes

### 4. Run checks

```bash
npx tsc --noEmit
npm run build
```

### 5. Commit

```bash
git add .
git commit -m "feat: improve prompt optimization"
```

### 6. Push

```bash
git push origin feature/my-feature
```

### 7. Open a Pull Request

Explain:

* What you changed
* Why you changed it
* How you tested it

---

# 🧪 Reliability

TokenBuddy uses a two-level optimization strategy:

```text
              Prompt
                 │
                 ↓
        ┌──────────────────┐
        │ Local Gemma      │
        │ via Ollama       │
        └────────┬─────────┘
                 │
        ┌────────┴────────┐
        │                 │
    Available         Unavailable
        │                 │
        ↓                 ↓
     Gemma          Fallback Engine
        │                 │
        └────────┬────────┘
                 ↓
        Optimized Prompt
```

This means the application can continue providing optimization even when local AI inference is unavailable.

---

# 🛠️ Troubleshooting

## Ollama command not found

If you see:

```text
ollama is not recognized
```

Install Ollama and restart your terminal.

Then verify:

```bash
ollama --version
```

---

## Gemma is not installed

Run:

```bash
ollama pull gemma2
```

Then:

```bash
ollama list
```

---

## Ollama is not responding

Check:

```powershell
Invoke-RestMethod http://127.0.0.1:11434/api/tags
```

If necessary, start Ollama and retry.

---

## TokenBuddy shows Fallback Optimizer

This normally means local Gemma could not be reached.

Check:

```bash
ollama list
```

Then:

```bash
ollama run gemma2
```

Keep Ollama available and retry the optimization.

---

## Port 3000 is already in use

Start Next.js on another port:

```bash
npm run dev -- -p 3001
```

Then open:

```text
http://localhost:3001
```

---

## TypeScript errors

Run:

```bash
npx tsc --noEmit
```

Fix reported errors before creating a production build.

---

# 📊 Project Goals

TokenBuddy aims to demonstrate that useful AI applications do not always need to depend entirely on remote proprietary APIs.

The project combines:

```text
Open-Weight AI
       +
Local Inference
       +
Prompt Optimization
       +
Token Awareness
       +
Privacy
       +
Fallback Reliability
```

into a single practical workflow.

---

# 🎯 The Problem in One Sentence

> AI users often spend unnecessary tokens sending prompts that could be shorter, clearer, and more efficient.

# 💡 The Solution in One Sentence

> TokenBuddy uses local open-weight AI and deterministic optimization to make prompts shorter while showing users the potential token and cost savings.

---

# 🚀 TokenBuddy in One Diagram

```text
                    ┌─────────────────┐
                    │      USER       │
                    └────────┬────────┘
                             │
                             ↓
                  ┌────────────────────┐
                  │     TokenBuddy     │
                  │                    │
                  │ Prompt Optimizer   │
                  │ Token Estimator    │
                  │ Cost Estimator     │
                  │ Comparison         │
                  └─────────┬──────────┘
                            │
                  ┌─────────┴─────────┐
                  │                   │
                  ↓                   ↓
        ┌──────────────────┐  ┌──────────────────┐
        │ Ollama + Gemma   │  │ Fallback Engine  │
        │                  │  │                  │
        │ Local AI         │  │ Deterministic    │
        │ Open-weight      │  │ Optimization     │
        └────────┬─────────┘  └────────┬─────────┘
                 │                     │
                 └──────────┬──────────┘
                            ↓
                  ┌────────────────────┐
                  │ Optimized Prompt   │
                  │                    │
                  │ ↓ Tokens           │
                  │ ↓ Estimated Cost   │
                  │ ↑ Efficiency       │
                  └────────────────────┘
```

---

# 📜 License

This project is licensed under the **MIT License**.

You are free to:

* Use the project
* Modify the project
* Distribute the project
* Build upon the project

See the `LICENSE` file for details.

---

# 👩‍💻 Author

**Ch V Sathvika**

Computer Science Engineering Student
AI / Full-Stack Developer & Open-Source Contributor

GitHub: [https://github.com/sathvi1234](https://github.com/sathvi1234)

Project: [https://github.com/sathvi1234/sathvi1234-tokenbuddy](https://github.com/sathvi1234/sathvi1234-tokenbuddy)

---

# ❤️ Built for a Friend

TokenBuddy was created around a simple idea:

> Don't build AI just because you can. Build something that makes someone's everyday problem easier.

**Built for [Friend's Name], [who they are, e.g. a student developer] who frequently uses AI but was frustrated by [their real problem, e.g. long prompts and unnecessary token usage].**

The goal was to take a real person's frustration with AI usage and turn it into a small, practical tool that they can actually use.

---

<div align="center">

### TokenBuddy

**Save tokens. Save context. Keep your AI private.**

Built with ❤️ using Next.js, TypeScript, Ollama, and Gemma.

</div>
