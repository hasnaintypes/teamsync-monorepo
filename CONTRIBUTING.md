# Contributing to TeamSync

We are excited that you are interested in contributing to TeamSync!  
This document will guide you through the process of setting up your development environment, making changes, and submitting your contributions.  

We welcome all types of contributions, from bug fixes to new features and documentation improvements.  

> Please note that this project has a **Code of Conduct**. By participating, you are expected to uphold this code.

---

## How Can I Contribute?

There are many ways to contribute to the project, even if you are not a developer:

- **Report a Bug**:  
  If you find an issue, check the GitHub Issues to see if it has already been reported. If not, open a new issue with a clear title and detailed description.

- **Suggest a Feature**:  
  We welcome new ideas! Open an issue to propose a new feature, outlining its purpose and potential benefits.

- **Write Code**:  
  Fix a bug or implement a new feature. This guide will walk you through the process.

- **Improve Documentation**:  
  Help us make our documentation more clear and comprehensive. This includes improving this guide, the README.md files, and API documentation.

---

## Getting Started

Follow these steps to get your local development environment set up.

### 1. Fork and Clone the Repository

First, you need to fork the main repository to your personal GitHub account:

1. Navigate to the TeamSync repository.  
2. Click the **Fork** button in the top-right corner.  
3. Clone your forked repository to your local machine:

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/teamsync-server.git
cd teamsync-server
````

4. Add the main repository as an upstream remote to stay up to date:

```sh
git remote add upstream https://github.com/hasnaintype/teamsync-server.git
```

### 2. Set Up the Development Environment

TeamSync is a monorepo with a separate frontend and backend. You will need to set up both.

**Install Dependencies**
From the root of the repository, navigate to both the client and server directories to install their respective dependencies:

```sh
cd client
npm install
cd ../server
npm install
```

**Configure Environment Variables**

* In both the `client` and `server` directories, copy `.env.example` to `.env`.
* Fill in the required values for your MongoDB URI, API base URL, and other secrets as needed.

---

## Development Workflow

To work on a feature or bug fix, follow this standard workflow.

### 1. Create a New Branch

Create a new branch from `main` with a descriptive name. This helps keep the project history clean.

```sh
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

### 2. Run the Applications

You need to run both the frontend and backend servers concurrently. Open two separate terminal windows.

**Start Backend**:
In the `server` directory, run:

```sh
npm run dev
```

**Start Frontend**:
In the `client` directory, run:

```sh
npm run dev
```

### 3. Make Your Changes

Implement your feature or bug fix. As you work, keep the following in mind:

* **Coding Style**:
  We use ESLint and Prettier to maintain a consistent code style. Ensure your code is properly formatted by running the linting commands.

```sh
# In the client directory
npm run lint

# In the server directory
npm run lint
```

* **TypeScript**:
  The entire codebase is written in TypeScript. Always ensure your changes are type-safe.

```sh
# In the client directory
npm run type-check

# In the server directory (type check runs during build process)
```

* **Testing**:
  If you are adding a new feature, please add tests to cover your changes.
  If you are fixing a bug, consider adding a new test to ensure it doesn't reappear.

---

## Submitting a Pull Request

Once your changes are ready, follow these steps to submit a pull request for review.

### 1. Sync Your Branch

Before pushing, make sure your branch is up to date with the main branch to avoid conflicts.

```sh
git checkout feature/your-feature-name
git fetch upstream
git rebase upstream/main
```

### 2. Commit Your Changes

Write clear, concise commit messages that describe the purpose of your changes.
We follow a simple convention for commit messages:

```
fix: fixed a bug in task status updates
feat: added new workspace analytics dashboard
docs: updated contributing guide
refactor: refactored database queries for projects
```

### 3. Push and Create a Pull Request

Push your changes to your forked repository:

```sh
git push origin feature/your-feature-name
```

Then, go to the GitHub page for your fork and click the **Compare & pull request** button.

### 4. Fill Out the Pull Request Template

The repository has a pull request template. Please fill it out completely, providing a clear title and a detailed description of your changes.

Be sure to reference any related issues using `Closes #123` or `Fixes #123`.
This helps us understand your contribution and its purpose.

### 5. Request a Review

Once the PR is ready, our team will review your changes.
We may ask for modifications or clarification. Please be responsive to feedback, and we will work with you to merge your contribution.

---

## Thank You

Thank you for contributing to **TeamSync**! Your efforts help make the project better for everyone.
