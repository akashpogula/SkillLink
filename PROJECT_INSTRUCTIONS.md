# PROJECT INSTRUCTIONS — MASTER SOURCE OF TRUTH

> **IMPORTANT**
>
> This document is the permanent source of truth for this project.
>
> Every AI developer/agent working on this project MUST read this document before making changes.
>
> The agent must preserve the product functionality and requirements defined here.
>
> The agent must not silently invent, remove, simplify, or change product behavior.
>
> Product decisions belong to the product owner.

---

# 1. PRODUCT VISION

## 1.1 Product Concept

This project is an India-focused service-connection platform connecting:

* Clients who need services
* Independent/local service providers who offer skills and services

The platform exists to make it easier for a client to:

1. Identify a service they need.
2. Discover relevant providers.
3. Evaluate providers.
4. Contact/request a provider.
5. Establish a connection.
6. Get the service completed.
7. Review the completed interaction.

A provider should be able to:

1. Present their skills and services.
2. Define where they operate.
3. Define their service radius.
4. Define availability.
5. Present experience and pricing.
6. Receive service requests.
7. Respond to requests.
8. Complete service connections.
9. Receive reviews.

The platform is fundamentally a **service connection platform**, not merely a directory, classifieds website, job board, social network, or generic marketplace.

## 1.2 Brand Concept

Primary brand idea:

> **Where skills meet opportunity.**

The experience should communicate:

**People → Skills → Services → Needs → Opportunities → Local Connections**

A supporting concept may be:

> **One connection can start something.**

The permanent brand name has not yet been finalized.

Therefore:

* Do not invent a permanent brand name.
* Use a configurable brand placeholder.
* Keep branding centralized so it can easily be replaced later.

---

# 2. PLATFORM DECISION

The initial product is a:

> **Responsive Web Application**

It must support:

* Desktop
* Laptop
* Tablet
* Mobile

A native mobile application is NOT part of the current development phase.

The responsive web application is the initial product because it provides one codebase and allows the product to be developed incrementally.

A native mobile application may be considered later.

---

# 3. CURRENT DEVELOPMENT PHASE

## FRONTEND ONLY

The current phase is strictly frontend-focused.

Allowed technologies:

* HTML
* CSS
* JavaScript
* Centralized mock data

Do NOT introduce the following during the current frontend phase unless explicitly requested:

* Backend
* Database
* Real authentication
* Authentication providers
* APIs
* Payment gateways
* Real transactions
* Real messaging infrastructure
* Real calling integrations
* Push notifications
* Maps APIs
* Routing APIs
* External service integrations
* Unnecessary frameworks
* Unnecessary dependencies
* Unnecessary infrastructure

The frontend must nevertheless behave like a realistic working application through centralized mock data and simulated state changes.

---

# 4. PRODUCT ROLES

There are two primary roles.

## 4.1 CLIENT

A client is a person who needs a service.

Client capabilities include:

* Profile
* Location
* Browse categories
* Search services
* Search skills/providers
* Filter results
* Discover relevant nearby providers
* View provider profiles
* Review provider information
* Submit service requests
* Monitor request status
* Communicate after appropriate connection
* Complete/cancel applicable requests
* Receive notifications
* Review providers after completed service
* View request/service history
* Manage settings

## 4.2 PROVIDER

A provider is a person who offers a service or skill.

Provider capabilities include:

* Profile
* Profile photo
* Multiple services/skills
* Categories
* Service location
* Service radius
* Availability
* Experience
* Pricing
* Portfolio/work photos
* Description
* Receive requests
* Inspect requests
* Accept requests
* Decline requests
* Respond to requests
* Manage request statuses
* Communicate after appropriate connection
* Mark applicable service as completed
* Receive client reviews
* Review clients after completed interaction
* Manage profile
* Manage services
* Manage availability
* Manage settings

---

# 5. SERVICE CATEGORIES

Initial categories:

## Construction & Labour

* General Labour
* Mason
* Painter
* Carpenter
* Plumber
* Electrician

## Household Services

* Cleaning
* Cooking
* Domestic Assistance

## Agriculture

* Farm Labour
* Harvesting
* Field Work

## Stitching & Clothing

* Tailor
* Alterations
* Stitching

## Repairs & Maintenance

* Appliance Repair
* Vehicle / Mechanical Work
* Electrical Repair

## Other

* Services that do not naturally fit another category

The category architecture MUST remain extensible.

Do not build the application architecture around only today's categories.

Categories and services must come from centralized data.

---

# 6. PROVIDER PROFILE

A provider profile should support:

* Name
* Profile photo
* Description/about
* Services
* Skills
* Category
* Location
* Service radius
* Availability
* Experience
* Pricing
* Portfolio/work photos
* Rating
* Reviews
* Relevant connection/contact information
* Current availability

The profile must have clear information hierarchy.

The selected provider must always correspond to the provider selected from the results.

Do not create disconnected fake provider profiles.

---

# 7. PROVIDER SERVICES

A provider may offer multiple services.

Each service may contain:

* Name
* Category
* Description
* Pricing
* Availability
* Location relevance

Provider identity and provider services must remain separate concepts in the data model.

---

# 8. LOCATION

Location is a core product concept.

Clients should discover providers relevant to their location.

Providers should specify:

* Service location
* Service radius

Conceptual radius choices may include:

* 2 km
* 5 km
* 10 km
* 20 km
* Custom radius

During the frontend phase, locations are mocked.

Do not implement real maps or location APIs.

The architecture should allow real location functionality to replace mock functionality later without requiring the UI to be rebuilt.

Location must be treated as a matching/relevance concept, not merely decorative information.

---

# 9. PROVIDER AVAILABILITY

Providers must have an availability concept.

Examples:

* Ready
* Off Duty

Availability may also include working/available hours.

Availability should affect:

* Provider presentation
* Filtering
* Request experience
* Provider dashboard

Availability must be understandable without relying only on color.

---

# 10. CLIENT DISCOVERY FLOW

The intended client journey is:

Landing Page
↓
Choose Client / Find a Service
↓
Client onboarding or login simulation
↓
Client Dashboard / Discovery
↓
Search or Category
↓
Location
↓
Provider Results
↓
Filters
↓
Provider Profile
↓
Service Request
↓
Request Confirmation
↓
Provider Response
↓
Connection / Communication
↓
Service
↓
Completion
↓
Review

Every stage must be connected.

No dead-end primary buttons.

---

# 11. CLIENT ONBOARDING

Client onboarding should collect only useful information.

Possible information:

* Name
* Profile information
* Location
* Relevant preferences

Do not create unnecessarily long forms.

The client should reach service discovery quickly.

Authentication is simulated during the frontend phase.

---

# 12. SEARCH

Search must operate against centralized mock data.

Search should support:

* Services
* Skills
* Provider types
* Relevant keywords

Search should support sensible matching rather than requiring exact string equality.

It should handle:

* Empty search
* Partial matches
* Capitalization differences
* Extra whitespace
* No results
* Invalid input

Search results must come from the same centralized provider/service data used throughout the application.

Do not create separate fake search datasets.

---

# 13. FILTERING

Provider filtering should support relevant criteria including:

* Service
* Category
* Location
* Distance/radius
* Availability
* Experience
* Pricing
* Rating
* Other relevant attributes when supported by the data

Filtering must operate against centralized mock data.

Users must be able to:

* Apply filters
* See active filters
* Reset filters
* Understand the result
* Handle zero matching results

On mobile, filters should use an appropriate interaction such as a drawer or bottom sheet.

---

# 14. PROVIDER MATCHING AND RESULT RELEVANCE

Provider relevance may consider:

* Service match
* Skill match
* Location
* Service radius
* Availability
* Experience
* Profile completeness
* Other directly relevant attributes

Do not create an unexplained ranking system.

If relevance is represented in the UI, it should be understandable.

Do not claim that a provider is objectively "best" unless the product owner explicitly defines such a rule.

---

# 15. PROVIDER RESULTS

Provider cards should communicate useful information immediately.

Potential information:

* Profile image
* Name
* Primary service
* Location
* Experience
* Rating
* Availability
* Indicative pricing

Do not overload cards.

Cards should naturally lead to the corresponding provider profile.

---

# 16. PROVIDER PROFILE VIEW

Provider profile hierarchy:

1. Identity
2. Services / skills
3. Availability
4. Location / service area
5. Experience
6. Pricing
7. Portfolio / work photos
8. Reviews
9. Primary request action

The primary action must be obvious.

---

# 17. SERVICE REQUEST SYSTEM

A client can initiate a service request.

A request should contain relevant information such as:

* Client
* Provider
* Requested service
* Location
* Requested timing/date
* Service details
* Additional information

The provider should be able to inspect the request before responding.

---

# 18. REQUEST STATES

Core request states include:

* REQUESTED
* ACCEPTED
* DECLINED
* RESPONDED

Additional lifecycle states may include:

* PENDING
* EXPIRED
* CANCELLED
* IN SERVICE
* COMPLETED

Where applicable, the interface should clearly communicate transitions between states.

Do not rely only on color to communicate status.

---

# 19. MULTIPLE REQUESTS

A client may contact multiple providers.

A provider may receive multiple requests.

The system must support:

* Multiple pending requests
* Multiple active requests
* One provider accepting while others remain pending
* Clear request identity
* Avoidance of ambiguous duplicates

Request history must not disappear merely because a request changes state.

---

# 20. PRIVACY AND CONTACT REVEAL

Provider contact/location information should not automatically be exposed everywhere.

The product should conceptually support appropriate information reveal through the request/connection process.

During the frontend phase this can be simulated.

Do not implement real contact integrations yet.

---

# 21. MESSAGING / COMMUNICATION

The broader product supports communication between connected parties.

This may include:

* Messaging
* Calling/contact representation

During the current frontend phase:

* Messaging is simulated.
* Calling/contact behavior is simulated.
* No real messaging backend.
* No real phone integration.

The UI should nevertheless represent the intended experience realistically.

---

# 22. LOCATION / ROUTING

The broader product may eventually support:

* Client location
* Provider location/service area
* Service destination
* Route/navigation

During the current phase:

* Use mock data.
* No real map integration.
* No real routing integration.

---

# 23. SERVICE COMPLETION

The intended lifecycle is:

REQUESTED
→ ACCEPTED
→ CONNECTION / SERVICE
→ COMPLETED

Completion must be clearly represented.

Reviews become available after a completed interaction.

---

# 24. REVIEWS

The platform should support two-way reviews:

### Client → Provider

After completed service, the client can provide:

* Rating
* Written review

### Provider → Client

After completed service, the provider can provide:

* Rating
* Written review

Reviews must not be available prematurely before a completed interaction.

Review history should be represented where appropriate.

---

# 25. CANCELLATION

Applicable parties may cancel requests depending on request state.

Cancellation must:

* Be clear
* Prevent accidental cancellation
* Communicate the resulting state
* Preserve request history

Do not silently erase cancelled requests.

---

# 26. NOTIFICATIONS

The broader application should support notifications for important events such as:

* New service request
* Request accepted
* Request declined
* Provider response
* Status changes
* Completion
* Review availability
* Other important account/request events

During the frontend phase, notifications are mocked/local.

No push-notification infrastructure should be implemented.

---

# 27. CLIENT DASHBOARD

The client dashboard should prioritize active tasks.

Possible sections:

* Welcome
* Search service
* Categories
* Active requests
* Request statuses
* Active connections
* Completed services
* Notifications
* Saved/relevant providers where supported
* Profile/settings
* Service history

Do not overload the dashboard.

The primary goal remains:

> Find and request a service.

---

# 28. PROVIDER DASHBOARD

The provider dashboard should prioritize:

* Incoming requests
* Pending requests
* Accepted requests
* Completed services
* Profile completion
* Services
* Availability
* Notifications
* Profile management
* Settings
* Quick actions

New incoming requests should be immediately understandable.

---

# 29. PROVIDER ONBOARDING

Provider onboarding should be a guided experience rather than one giant form.

Stages may include:

1. Basic identity
2. Services / skills
3. Location
4. Service radius
5. Experience
6. Availability
7. Pricing
8. Work photos
9. Description
10. Completion

Provide:

* Progress indicator
* Back
* Next
* Save/continue where useful
* Validation
* Error states
* Completion state

Do not request unnecessary information.

---

# 30. NAVIGATION

Core navigation concepts include:

* Home
* Discover / Search
* Categories
* Requests
* Dashboard
* Notifications
* Profile
* Settings

Navigation should adapt to user role.

Desktop and mobile navigation should be appropriate to the device.

The two major entry actions should remain easy to access:

* Find a Service
* Offer Your Service

---

# 31. LANDING PAGE

The landing page is a major part of the product experience.

It must:

* Clearly explain what the platform does.
* Explain who it is for.
* Communicate the problem.
* Communicate the connection between need and skill.
* Provide clear entry points.
* Establish the visual language for the application.

Core phrase:

> **Where skills meet opportunity.**

The landing page must not feel like a generic marketplace template.

It should feel like one continuous visual story.

---

# 32. LANDING PAGE VISUAL EXPERIENCE

Visual direction:

> **Modern + Premium + Human + Interactive**

The landing page should communicate:

**Need → Skill → Person → Connection → Opportunity**

The opening animation should not be merely decorative.

It should help the visitor understand the platform.

Possible visual elements:

* Animated cards
* People/profile representations
* Service icons
* Skill indicators
* Nodes
* Subtle connection lines
* Motion
* Contextual transitions
* Micro-interactions

Avoid:

* Excessive gradients
* Excessive glassmorphism
* Generic AI/SaaS styling
* Excessive floating cards
* Constant movement
* Unnecessary parallax
* Animation that blocks usability
* Visual clutter

---

# 33. LANDING PAGE HERO

Hero headline:

> **WHERE
> SKILLS
> MEET
> OPPORTUNITY.**

Supporting message:

> Connecting people who need a service with people who have the skills to provide it.

Primary CTA:

> **Find a Service**

Secondary CTA:

> **Offer Your Service**

The hero visual should represent the formation of a connection between need and skill.

Concept:

CLIENT / NEED
↕
PROVIDER / SKILL

The interaction should communicate:

> Need → Discovery → Compatibility → Connection

The animation must feel sophisticated rather than gimmicky.

---

# 34. HERO INTERACTION

The hero should respond to user intent.

When interacting with **Find a Service**, the visual system may emphasize:

* Services
* Categories
* Discovery
* Search
* Provider results

When interacting with **Offer Your Service**, it may emphasize:

* Provider profile
* Skills
* Experience
* Availability
* Services offered

The interaction should be subtle and premium.

The user should feel that the interface responds to their intention.

---

# 35. LANDING PAGE STORY SECTIONS

The landing page should form a continuous story.

## Section 1 — Hero

Introduce:

> Where skills meet opportunity.

Show the interactive connection concept.

## Section 2 — The Gap

Visually show:

**NEEDS**

"I need someone..."

and

**SKILLS**

"I can do this..."

Initially disconnected.

As the user scrolls, the two sides move toward one another.

Eventually:

> CONNECTED

## Section 3 — The Connection

Communicate:

> People with skills are everywhere. Finding the right connection shouldn't be difficult.

Keep this section focused and emotional rather than corporate.

## Section 4 — How It Works

Use an animated journey:

1. DISCOVER
2. EXPLORE
3. CONNECT
4. GET STARTED

The visual system should evolve as the user scrolls.

## Section 5 — Services

Introduce actual service categories.

Categories must come from centralized data.

## Section 6 — Two Worlds

Create a strong split CTA:

### NEED A SERVICE?

Find someone who can help.

**Find a Service**

### HAVE A SKILL?

Put your skills where people can find them.

**Offer Your Service**

## Section 7 — Closing

Use:

> **The connection starts here.**

Then provide:

* Find a Service
* Offer Your Service

The closing visual should echo the hero connection.

---

# 36. DESIGN SYSTEM

Establish a reusable design system before implementing the full application.

Define:

* Typography
* Font hierarchy
* Colors
* Spacing
* Buttons
* Inputs
* Cards
* Navigation
* Icons
* Borders
* Shadows
* Radius
* Status indicators
* Transitions
* Animation timing
* Responsive behavior
* Empty states
* Loading states
* Error states
* Success states

Use reusable components.

Do not randomly style individual pages.

---

# 37. TYPOGRAPHY

Typography should be modern and highly legible.

Use:

* Large display typography
* Clear body typography
* Strong hierarchy
* Controlled line lengths
* Generous spacing

Avoid overly decorative fonts.

Typography should feel premium without reducing readability.

Final font selection may be established during the design-system milestone.

---

# 38. COLOR SYSTEM

Use a restrained visual palette.

Define:

* Primary background
* Secondary background
* Primary text
* Secondary text
* Border
* Accent
* Success
* Warning
* Error

Use CSS variables/design tokens.

Do not scatter hard-coded colors throughout components.

Final brand colors may remain configurable until branding is finalized.

---

# 39. MOTION SYSTEM

Motion should support understanding and interaction.

Possible motion:

* Scroll reveals
* Subtle transforms
* Opacity transitions
* Connection lines
* Card movement
* Hover states
* Micro-interactions
* Page transitions
* Request-state transitions
* Loading animations

Animations must:

* Be smooth
* Not block interaction
* Not create layout instability
* Work on mobile
* Respect reduced-motion preferences
* Degrade gracefully

Do not animate everything.

---

# 40. RESPONSIVE DESIGN

Responsive behavior must be designed from the beginning.

Support:

* Desktop
* Laptop
* Tablet
* Mobile

Do not create desktop first and merely patch mobile afterward.

Check:

* Navigation
* Typography
* Hero
* Hero animation
* Forms
* Cards
* Grids
* Filters
* Dashboards
* Provider profiles
* CTA sections
* Touch targets
* Overflow

No accidental horizontal scrolling.

---

# 41. ACCESSIBILITY

Implement strong accessibility fundamentals.

Include:

* Semantic HTML
* Logical headings
* Labels
* Keyboard navigation
* Visible focus states
* Appropriate buttons
* Alt text
* Sufficient contrast
* Accessible forms
* Logical tab order
* Status communication
* Touch-friendly targets
* Reduced-motion support

Do not communicate important information through color alone.

---

# 42. UI STATES

Every important interaction should have appropriate states.

## Loading

Use realistic loading/skeleton states where appropriate.

## Empty

Examples:

* No providers
* No requests
* No notifications
* No completed services
* No reviews
* No search results

Every empty state should explain what happened and provide an appropriate next action.

## Error

Examples:

* Invalid input
* Missing required information
* Failed simulated action
* Invalid route
* Search failure
* No matching provider
* Incomplete profile

Explain the problem and provide a next step.

## Success

Examples:

* Registration completed
* Profile updated
* Request submitted
* Request accepted
* Request declined
* Availability updated
* Review submitted

---

# 43. CENTRALIZED MOCK DATA

All dynamic data must come from centralized mock data.

Suggested location:

`/js/mock-data.js`

The data model should contain concepts such as:

* Users
* Clients
* Providers
* Services
* Categories
* Locations
* Requests
* Notifications
* Reviews
* Availability

The same provider object must be used across:

Provider Results
→ Provider Profile
→ Request
→ Dashboard
→ Reviews

Do not create separate fake versions of the same entity.

---

# 44. FRONTEND STATE

Use lightweight state management appropriate for vanilla JavaScript.

Possible tools:

* JavaScript modules
* Centralized state objects
* localStorage where appropriate

State may include:

* Current user
* Current role
* Search query
* Selected category
* Location
* Filters
* Provider results
* Selected provider
* Requests
* Request statuses
* Notifications
* Availability
* Profile information

Do not introduce a large state-management framework.

Where practical, state should survive normal navigation and refresh.

---

# 45. FUTURE BACKEND COMPATIBILITY

Although no backend is allowed during the current phase, the frontend should be structured so that future backend integration is practical.

Where reasonable:

* Keep data access separate from presentation.
* Keep mock data centralized.
* Avoid deeply coupling UI components to mock-data implementation.
* Design interfaces that could later consume API data.

Do not build the backend now.

---

# 46. PRIVACY / SAFETY / REPORTING UX

The broader product should eventually account for:

* Reporting inappropriate behavior
* Privacy
* Safe communication
* Service disputes
* Account safety

During the frontend phase these may be represented through UI concepts or placeholders.

Do not build a real moderation backend.

---

# 47. PRICING / PAYMENTS

Provider pricing may be displayed.

The product may eventually include payment functionality.

During the current phase:

* No real payments.
* No payment gateway.
* No real transaction processing.

Keep provider pricing conceptually separate from future platform fees or payment functionality.

---

# 48. CORE SCREENS

The eventual frontend should cover:

### Shared

* Landing
* User-role selection
* Login simulation
* About
* Help
* Notifications
* Settings
* Invalid/not-found page

### Client

* Registration
* Onboarding
* Dashboard
* Search
* Categories
* Results
* Filters
* Provider profile
* Request creation
* Request confirmation
* Request status
* Connections/communication representation
* Service completion
* Reviews
* Profile

### Provider

* Registration
* Onboarding
* Profile setup
* Services/skills
* Location
* Radius
* Experience
* Availability
* Pricing
* Photos
* Dashboard
* Incoming requests
* Request details
* Accept/decline/respond
* Completed services
* Reviews
* Profile editing
* Settings

---

# 49. CLIENT WORKFLOW

The complete intended client workflow:

Landing
→ Choose Client
→ Login/Registration Simulation
→ Client Onboarding
→ Dashboard / Discovery
→ Search or Category
→ Location
→ Provider Results
→ Filters
→ Provider Profile
→ Request Service
→ Request Confirmation
→ REQUESTED
→ Provider Response
→ ACCEPTED / DECLINED / RESPONDED
→ Connection / Communication
→ Service
→ COMPLETED
→ Review

Cancellation may occur where applicable.

Multiple provider requests must be supported.

---

# 50. PROVIDER WORKFLOW

The complete intended provider workflow:

Landing
→ Choose Provider
→ Registration
→ Profile Creation
→ Services / Skills
→ Location
→ Service Radius
→ Experience
→ Pricing
→ Availability
→ Photos / Portfolio
→ Dashboard
→ Incoming Request
→ Request Details
→ Accept / Decline / Respond
→ Connection / Communication
→ Service
→ COMPLETED
→ Review Client

---

# 51. REQUEST LIFECYCLE

The request lifecycle should support:

> REQUESTED
> ↓
> PROVIDER REVIEWS
> ↓
> ACCEPTED / DECLINED / RESPONDED
> ↓
> CONNECTION / SERVICE
> ↓
> COMPLETED

Possible additional states:

* CANCELLED
* EXPIRED
* IN SERVICE

State changes must be reflected consistently across relevant screens.

---

# 52. DOCUMENTATION

The project should maintain:

## PROJECT_INSTRUCTIONS.md

Permanent master source of truth.

## PROJECT_SPEC.md

Contains:

* Product purpose
* Users
* Features
* Categories
* Functional requirements
* Constraints
* User flows

## DEVELOPMENT_PLAN.md

Contains:

* Milestones
* Current milestone
* Completed work
* Next task
* Known issues
* Dependencies

## DESIGN_SYSTEM.md

Contains:

* Typography
* Colors
* Spacing
* Components
* Interaction rules
* Animation principles
* Responsive rules

## USER_FLOWS.md

Contains complete client and provider journeys.

## TESTING_CHECKLIST.md

Contains:

* Page tests
* Navigation tests
* Form tests
* Search tests
* Filter tests
* Request tests
* Responsive tests
* Accessibility checks
* Edge cases

## CHANGELOG.md

Record meaningful implementation changes.

## README.md

Explain how the frontend project is structured and run.

---

# 53. PROJECT STRUCTURE

Use a clean, maintainable structure appropriate for the existing project.

A possible structure is:

```text
project/
├── index.html
├── pages/
├── css/
├── js/
├── assets/
├── PROJECT_INSTRUCTIONS.md
├── PROJECT_SPEC.md
├── DEVELOPMENT_PLAN.md
├── DESIGN_SYSTEM.md
├── USER_FLOWS.md
├── TESTING_CHECKLIST.md
├── CHANGELOG.md
└── README.md
```

The exact structure may be adapted if the existing project already has a working architecture.

Do not rewrite an existing project merely to match this example.

---

# 54. DEVELOPMENT MILESTONES

Development must happen incrementally.

## M0 — Initialization

* Inspect existing project
* Establish foundation
* Establish documentation
* Confirm architecture
* Confirm mock-data approach
* Do not build the complete application

## M1 — Design System

Establish the reusable visual system.

## M2 — Landing Page

Build the complete landing experience and connection storytelling.

## M3 — Navigation

Establish shared navigation and role entry.

## M4 — Client Onboarding

Build client entry and onboarding.

## M5 — Provider Onboarding

Build provider onboarding.

## M6 — Client Dashboard

Build client dashboard.

## M7 — Provider Dashboard

Build provider dashboard.

## M8 — Categories

Implement centralized category/service browsing.

## M9 — Search

Implement working mock-data search.

## M10 — Filters

Implement provider filtering.

## M11 — Provider Profiles

Implement connected provider result/profile experience.

## M12 — Service Requests

Implement request creation and lifecycle.

## M13 — Notifications / Status

Implement simulated notifications and status feedback.

## M14 — Responsive Optimization

Optimize desktop, tablet and mobile behavior.

## M15 — Full Frontend Testing

Test workflows, states, navigation, responsive behavior and accessibility.

## M16 — Final Frontend Polish

Perform final UI/UX refinement, consistency checks and visual polish.

---

# 55. DEVELOPMENT PROCESS

For every milestone:

1. Read `PROJECT_INSTRUCTIONS.md`.
2. Inspect the current project.
3. Understand the existing implementation.
4. Identify relevant files.
5. Plan the change.
6. Implement the smallest clean solution.
7. Test it.
8. Check for regressions.
9. Check responsive behavior.
10. Check accessibility where relevant.
11. Update documentation.
12. Report what changed.
13. Stop and wait for the next instruction unless explicitly told to continue.

Do not attempt to generate the entire application in one uncontrolled operation.

---

# 56. EXISTING-WORK PRESERVATION

This is a critical rule.

Before changing anything:

> **INSPECT FIRST.**

Never:

* Blindly overwrite existing files.
* Rewrite unrelated code.
* Remove working functionality merely because it is inconvenient.
* Replace working architecture without justification.
* Remove planned functionality because it seems unnecessary.
* Change product behavior merely because the UI is being redesigned.

Existing/core functionality must remain intact unless the product owner explicitly requests a functional change.

---

# 57. UI/UX CHANGES VS FUNCTIONAL CHANGES

The product owner may request visual or experience improvements without changing functionality.

When redesigning UI:

* Preserve existing workflows.
* Preserve existing business logic.
* Preserve existing data relationships.
* Preserve existing capabilities.
* Improve presentation and usability.

Do not silently turn a UI redesign into a product redesign.

If a requested UI change would require changing functionality, identify that distinction before implementation.

---

# 58. NEW FEATURES

Do not introduce new major product features simply because they are common in similar platforms.

If a new feature is proposed:

1. Identify it as a new feature.
2. Explain what it changes.
3. Wait for explicit product-owner approval when necessary.

The AI developer is not the product owner.

---

# 59. AMBIGUITY RULE

Never invent major requirements.

If something is genuinely unknown:

* Mark it as undecided.
* Identify the ambiguity.
* Explain relevant implementation options.
* Ask the product owner when a decision is necessary.

Do not silently make major product decisions.

Minor implementation details may use reasonable technical judgment when they do not change product behavior.

---

# 60. ANTI-OVERENGINEERING

Prefer:

1. Correctness
2. Maintainability
3. Simplicity
4. Consistency
5. User experience

Do not optimize for:

* Maximum code
* Maximum dependencies
* Maximum abstraction
* Maximum animation
* Maximum number of components

Build the smallest clean implementation that satisfies the requirements.

---

# 61. TESTING

After every meaningful implementation change, check:

* Console errors
* Broken links
* Broken navigation
* Missing assets
* JavaScript errors
* Forms
* Search
* Filters
* Request state
* Responsive layout
* Accessibility basics
* Relevant empty states
* Relevant error states

When browser tooling is available, inspect the actual rendered application.

Do not assume that code is correct merely because it compiles or looks correct in source files.

---

# 62. VISUAL QUALITY STANDARD

A page is not complete merely because it functions.

Evaluate:

* Spacing
* Typography
* Alignment
* Hierarchy
* Visual rhythm
* Responsiveness
* Animation smoothness
* Interaction feedback
* Empty states
* Error states
* Loading states
* Success states
* Consistency

The final product should not look like:

* A school project
* An AI-generated template
* A generic dashboard
* A collection of unrelated pages

It should feel like one coherent premium product.

---

# 63. LANDING PAGE QUALITY STANDARD

The landing page must communicate quickly:

1. People need services.
2. People have skills.
3. The platform connects them.
4. Visitors can choose which side they belong to.
5. Visitors can begin immediately.

The visual experience should communicate this without requiring long paragraphs.

The animation should reinforce the concept.

---

# 64. DO NOT CHANGE THE PRODUCT MODEL

Do not transform this product into:

* An e-commerce website
* A freelancer bidding platform
* A social network
* A conventional job board
* A generic directory
* An AI chatbot

The product remains:

> **A service-connection platform connecting clients with local/independent service providers.**

---

# 65. CURRENT INITIALIZATION RULE

Before actual application development begins, the AI agent must:

1. Inspect the existing project.
2. Confirm the existing files and architecture.
3. Confirm whether existing work exists.
4. Preserve existing work.
5. Establish the project documentation/foundation if needed.
6. Report findings.

Do NOT automatically build the complete website.

Do NOT automatically proceed through all milestones.

Wait for explicit instruction before moving from one milestone to the next.

---

# 66. FINAL PRINCIPLE

The final product should feel like:

> **A premium, modern, human-centered digital bridge between NEED and SKILL.**

The website should not merely explain the concept of connection.

It should make the user **experience the concept of connection through the interface itself.**

Build with intention.

Inspect before changing.

Preserve existing work.

Use centralized data.

Keep the architecture clean.

Separate product functionality from UI/UX.

Develop incrementally.

Test every milestone.

Never sacrifice clarity for unnecessary complexity.

---

# 67. IMMEDIATE INSTRUCTION

**Do not start building the website immediately after reading this document.**

First inspect the current project and report:

1. Existing project structure
2. Existing files
3. Existing technology
4. Existing implementation
5. Existing dependencies
6. Existing functionality that must be preserved
7. What M0 foundation work is actually required

Do not silently change product requirements during this inspection.

After reporting the inspection, **STOP and wait for the product owner's next instruction.**
