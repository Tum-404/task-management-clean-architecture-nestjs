# 🧩 Task Management — Clean Architecture (POC)

This project is a **Proof of Concept (POC)** that demonstrates how to build a **framework-independent**, **cleanly-architected** backend application using **Domain-Driven Design (DDD)** and **Clean Architecture principles** — integrated with **NestJS** as the framework layer.

---

## 🎯 Project Goal

The main goal is to create a **scalable, testable, and framework-independent architecture** where the **core business logic** does not depend on any external frameworks, databases, or UI.  
This approach allows the project to easily switch frameworks (e.g., Express, Fastify) or databases (e.g., PostgreSQL, MongoDB) with minimal impact on the business logic.

---

## 🏗️ Architecture Overview

### Layers
```
core/
┣ domain/ # Entities, value objects, domain rules
┣ application/ # Use cases (business logic)
┗ shared/ # Shared types and utilities

src/
┣ infrastuctures/ # (Implementations of adapters and drivers)
┗ persistence/ # (Planned) Database implementation (PostgreSQL)

main.ts # Entry point
```
---

### Key Principles

- **Dependency Inversion** – Core logic does not depend on external frameworks.  
- **Separation of Concerns** – Each layer has a single responsibility.  
- **Testability** – Business logic can be tested without framework or database.  
- **Extensibility** – New frameworks or databases can be integrated easily.

---

## 🚀 Current Roadmap

| Status | Feature | Description |
|:-------|:---------|:-------------|
| ✅ | **Core Business Logic** | Implemented domain and use cases for task management |
| ✅ | **NestJS Integration** | Connected the clean architecture core to NestJS |
| ⬜ | **PostgreSQL Database** | Add persistence layer using TypeORM or Prisma |
| ⬜ | **API Documentation** | Generate OpenAPI (Swagger) docs |
| ⬜ | **Containerization** | Dockerize the project for deployment |

---

## 🧠 Core Concept Example

**Example: Task Use Case**

```ts
// core/application/use-cases/update-task.usecase.ts
export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: UpdateTaskInput): Promise<Task> {
    const task = await this.taskRepository.findById(input.id);
    task.updateDetails(input.title, input.description);
    return this.taskRepository.save(task);
  }
}
```
This use case doesn’t know anything about NestJS, HTTP, or databases — only pure business logic.

🧩 Technology Stack
Language: TypeScript

Framework: NestJS

Architecture: Clean Architecture / DDD

Testing: Jest

(Planned): PostgreSQL, Docker, Swagger

🏃 Getting Started
1. Clone the Repository
```bash
git clone https://github.com/Tum-404/task-management-clean-architecture-nestjs.git
cd task-management-clean-architecture-nestjs
```
2. Install Dependencies
```bash
npm install
```
3. Run the Project
```bash
npm run start:dev
```
4. Run Tests
```bash
npm run test
```
🧭 Future Vision
The end goal of this project is to provide a reusable architecture template for developers who want to:

Build framework-independent business logic

Apply DDD + Clean Architecture principles

Scale their project safely with clear boundaries

🧑‍💻 Author
Teeradach “Tum” Prichasongsaenglap
Software Developer — passionate about architecture, clean code, and building scalable systems.

🌐 GitHub Profile

📄 License
MIT License — feel free to use this as a base for your own clean architecture experiments.