# 📘 React Redux Refresh

A structured React + TypeScript learning project focused on mastering:

* Modern React fundamentals
* Performance optimization
* Custom hooks
* Feature-based architecture
* Tailwind CSS
* Preparing for Redux Toolkit integration

This repository is part of my structured refresh journey toward building production-ready React applications.

---

# 🚀 Tech Stack

* React 18
* TypeScript
* Vite
* Tailwind CSS (v3)
* React Router
* ESLint

---

# 🎯 Project Goals

This project is not just a task app.

It is designed to practice:

* Clean architecture
* Reusable components
* Performance optimization (React.memo, useMemo, useCallback)
* Custom hooks
* Separation of concerns
* Scalable folder structure

---

# 📂 Project Structure

```text
src/
│
├── app/                 # Application root
│   └── App.tsx
│
├── features/
│   └── tasks/           # Tasks feature module
│       ├── components/
│       │   ├── TaskForm.tsx
│       │   ├── TaskFilters.tsx
│       │   ├── TaskItem.tsx
│       │   └── TaskList.tsx
│       │
│       ├── taskUtils.ts
│       ├── types.ts
│       └── TasksPage.tsx
│
├── shared/
│   ├── components/      # Reusable UI components
│   │   └── Button.tsx
│   │
│   └── hooks/           # Reusable custom hooks
│       └── useLocalStorageState.ts
│
├── main.tsx
└── index.css
```

Architecture style: **Feature-Based Structure**

---

# ✨ Features Implemented (Day 1 & Day 2)

## Day 1

* React + TypeScript setup
* Routing with React Router
* Tasks MVP
* Local state management
* Controlled inputs
* Basic persistence with localStorage

## Day 2

* Tailwind CSS integration
* Custom hook (`useLocalStorageState`)
* Derived state using `useMemo`
* Memoized components using `React.memo`
* Stable callbacks using `useCallback`
* Reusable Button component
* Improved feature-based architecture
* Performance optimization techniques

---

# 🧠 Performance Techniques Used

* `React.memo` to prevent unnecessary child re-renders
* `useMemo` to memoize derived values
* `useCallback` to maintain stable function references
* Separation of business logic into utility functions
* Avoiding derived state duplication

---

# 🔥 Key Concepts Practiced

* Component composition
* State lifting
* Derived state
* Custom hooks
* Memoization strategies
* Virtual DOM understanding
* Reconciliation basics
* Clean folder architecture

---

# 🛠 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/react-redux-refresh.git
cd react-redux-refresh
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

---

# 🎨 Tailwind Setup

This project uses Tailwind CSS v3 with PostCSS configuration via:

* `tailwind.config.cjs`
* `postcss.config.cjs`

If styling issues occur, ensure:

* Both config files exist
* No duplicate `.js` versions are present

---

# 📈 Upcoming Improvements

* Redux Toolkit integration
* Global state management
* Async thunks
* Middleware understanding
* Advanced performance patterns
* Testing (React Testing Library)
* Production-level optimization patterns

---

# 🎓 Purpose

This repository is part of a structured React refresh journey aimed at:

* Strengthening fundamentals
* Preparing for technical interviews
* Building scalable production-level architecture
* Improving performance optimization skills

---

# 📌 Status

Currently completed:

* Day 1 ✅
* Day 2 ✅

Next:

* Day 3: Redux Toolkit Integration 🚀

---

# 🤝 Contributing

This is a learning-focused repository, but suggestions and improvements are welcome.

---

# 📄 License

MIT License
