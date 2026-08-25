# Center for Children and Families: Attendance Tracker

## Introduction
This project is partnered with the Center for Children and Familes at UTD, and our focus is on building an attendance tracker for the Play With Me Program. The Play With Me program is a program targeted at children ages 0-3 and their parents, and aims to foster strong parent-child relationships through semi-structured play.

## Conceptual Overview

The purpose of this project is 
- Provide a streamlined way to track attendance of interns and families
- Integrate with their existing database to automate updates

## User Roles

### Student Interns
Student Interns are UTD students who support program delivery on-site.

**Interns can:**

- Clock in and clock out for their own shifts.
- View their own attendance history and total hours.
- Check in and check out participants during program sessions at their assigned site.
- View participant and family information needed during active work hours.
- check in participant and families during workhours.
- Submit absence requests for upcoming shifts.

### Site Manager
Site Managers oversee day-to-day operations at a specific site.

Site Managers can:

- Do everything a Student Worker can do at their assigned site.
- View live attendance status for all interns, student workers, and participants at their site.
- Review attendance history and patterns (for example, repeated absences).
- Approve or deny intern and student worker absence requests.
- Receive alerts when participants miss required days or when interns are late or absent.
- View and track which parent or guardian dropped off a participant each day.

### Admin
Admins are CCF staff who manage the overall system and all sites.

**Admins can:**
- Do everything a Site Manager can do across all sites.
- Create, edit, and deactivate user accounts (interns, student workers, site managers, admins).
- Assign roles and site placements for interns and student workers.
- View participant and family information across all sites when required for coordination.
- Configure site-level settings such as schedules, program times, and alert rules.
- Access system-wide attendance summaries and reports for program evaluation.

## Page Functional Requirements

### Login Page

- Should allow users with a UTD account to login using UTD SSO

### Student Intern Attendance Page

- Should allow interns to check in and check out
- Should calculate hours worked and log them
- Should provide calendar component with view of scheduled days and previous days
- Calendar should show if day is upcoming, attended, or missed
- Should allow users to request days off using calendar component

### Participant Checkin Page

- Should allow interns to checkin a participating family for that day and location
- Should dynamically display expected participants according to location
- Should allow interns to submit form information for participant:
    - Which family members participated
    - Was an additional child not affiliated with Play With Me brought
    - The name of an external agency if one joined that session
    - Additional notes

### Site Overview Page

- Should display intern attendance info according to site: intern checkin status, intern checkin time
- Should be accessible only to site manager and admin users
- Site managers should only have access to information about the site they manage
- Admins should have access to all site info
- Should allow intern specific stats to be shown: Attendance history, email, number, etc.
- Should allow daily checkin code for any specific site to be displayed
- Should display broad statistics for attendance at that site

### Intern Directory Page

- Should display a list of all interns and their assigned locations
- Should be able to filter interns by location or locations
- Should allow intern information to be edited by admin
- Should be accessible only by admins
- Should be capable of searching for interns by name or netid

### Alerts Page

- Should display relevant alerts based on role
    - Alert interns about status of their absence requests
    - Alert interns about changes in locations
    - Alert site managers about missed attendance for interns
    - Alert site managers when participants have missed a set number of days (confirm days with Adriana)
    - Alert site managers about absence requests from interns
- Should be able to filter alerts by type and status: Unread, Warning, Requests, All


## Third-Party Integrations
 
No third-party integrations are currently active. Future teams will integrate university SSO and third-party providers.

## Tech Stack

### Frontend
- **Nuxt 4**  
  Core framework used for building the application.
- **Vue 3 (Composition API)**  
  Frontend component system.
- **TailwindCSS**  
  Utility-first styling framework.
- **Vite**  
  Dev server and bundler used by Nuxt for fast HMR.

---

### Backend (In Development)
- **Nuxt Nitro Server**  
  Server engine behind API routes and backend logic.
- **Prisma ORM**  
  For modeling schema and interacting with the database. Backend queries are still being developed.

---

### Database
- **SQLite (dev.db)**  
  Temporary development-only database file included in development branches. Not currently connected to the running app.

---

### Tooling
- **Node.js 24+**  
- **Git**  
- **VS Code + Volar extension**

---

### Planned Integrations
- OAuth / SSO authentication  


# Development Environment Setup

## Prerequisites
Install the following:

- **Node.js 24 or later**  
  https://nodejs.org/en
- **Prisma 7 or later**
- **Git**

---

## 1. Clone the Repository

```bash
git clone https://github.com/UTDallasEPICS/Center-for-Children-and-Families-Attendance-Tracker.git &&
cd Center-for-Children-and-Families-Attendance-Tracker
```

---

## 2. Install Dependencies

```bash
npm install
```

This installs all Nuxt dependencies and prepares the project for local development.

---

## 3. Copy .env.example to .env

```bash
cp .env.example .env
```

You can also just copy it using your editor's tools

---

## 4. Instantiate Database and Prisma Client

```bash
npx prisma generate &&
npx prisma migrate dev
```

This instantiates the prisma client and database

---

## 5. Start the Development Server

```bash
npm run dev
```

Nuxt will automatically select another port if **3000** is in use.

Example output:

```
Local: http://localhost:3005/
```

To expose development server to network for viewing on other devices

```bash
npm run dev -- --host
```

---

## Recommended Tools

- **Visual Studio Code**
- **Volar extension** (Vue/Nuxt)
- **Nuxt Documentation**  
  https://nuxt.com/docs
- **Vue Documentation**
  https://vuejs.org/guide

---

## Authentication Status (Spring 2026)

Authentication is not yet connected to a backend identity system.

- UI components for login and role-based flows exist, but external authentication providers are not configured.
- No environment variables, OAuth settings, or callback URLs are required for local development.
- Future teams will integrate university SSO and third‑party providers (Google, Microsoft, Facebook) and document the setup process.

---

