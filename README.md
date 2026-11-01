# Women Safety Live Tracking System

**A consent-based personal safety platform for live location sharing,
trusted-contact alerts, battery-status awareness, SOS assistance, and
safe-journey monitoring.**

```{=html}
<p align="center">
```
`<strong>`{=html}Website-first development · Java Spring Boot backend ·
React frontend · MySQL database`</strong>`{=html}
```{=html}
</p>
```
> **Project stage:** Planning and documentation\
> **First release:** Responsive web application\
> **Future direction:** Android application using the same backend
> services

------------------------------------------------------------------------

## 1. Project Overview

The **Women Safety Live Tracking System** is a proposed web-based
safety-support platform designed to help users stay connected with
people they trust while travelling or when they feel unsafe.

A user can choose trusted contacts, start sharing their location,
monitor the status of an active journey, and trigger an SOS alert when
assistance is needed. Where the browser and device support it, the
system can also report the user's battery percentage and notify trusted
contacts when the battery becomes low.

The backend is designed around **Java and Spring Boot**, with a
**React.js** website and **MySQL** database. This website-first approach
allows the core workflows to be developed and tested before a native
Android application is introduced.

The project focuses on three important ideas:

1.  **Stay connected:** Share location and journey status with trusted
    people.
2.  **Ask for help quickly:** Trigger an SOS alert and provide the
    latest available location.
3.  **Preserve useful information:** Keep the last successfully received
    location available if the user's device later loses connectivity or
    powers off.

This is a safety-support tool. It cannot guarantee personal safety,
continuous GPS tracking, message delivery, or emergency-service
response.

------------------------------------------------------------------------

## 2. Problem Statement

During travel or an emergency, a person may face several practical
difficulties:

-   Trusted family members or friends may not know the person's current
    location.
-   Manually sharing a location repeatedly can be inconvenient.
-   A person may need to alert multiple trusted contacts quickly.
-   A phone's battery may become critically low during a journey.
-   If a phone loses power or connectivity, contacts may not know the
    last location that was successfully shared.
-   A person travelling to a destination may want someone to know their
    expected arrival time.

The project aims to bring these safety-support functions into one
platform with clear consent, controlled access, and visible sharing
status.

------------------------------------------------------------------------

## 3. Project Objectives

### Primary objectives

-   Develop a responsive website for a personal safety and
    location-sharing system.
-   Allow users to register, sign in, and manage their profiles
    securely.
-   Allow users to add, invite, authorize, and revoke trusted contacts.
-   Enable users to share their location with authorized contacts.
-   Display the latest received location on an interactive map.
-   Provide an SOS workflow that records an emergency and alerts trusted
    contacts.
-   Store the last successfully received location on the server.
-   Report battery percentage when the browser/device makes it
    available.
-   Provide low-battery alerts based on actual reported battery
    information.
-   Support safe journeys with expected arrival times and check-ins.
-   Keep the backend reusable for a future Android application.

### Secondary objectives

-   Make the interface easy to understand and use on desktop and mobile
    browsers.
-   Protect sensitive location information through authentication and
    authorization.
-   Clearly show when sharing is active, stopped, unavailable, or stale.
-   Maintain an emergency and journey history for the account owner.
-   Design the system so additional notification providers and mobile
    clients can be added later.

------------------------------------------------------------------------

## 4. Proposed Features and Functionalities

### 4.1 User Registration and Login

Users will be able to: - Create an account. - Sign in securely. - Manage
basic profile information. - Sign out and manage their account. - Use
authenticated access to private features.

**Purpose:** Ensure that safety information is associated with an
authenticated account and is not openly accessible.

### 4.2 Trusted Contacts Management

Users will be able to: - Add or invite family members and friends. -
View pending and accepted invitations. - Authorize a contact to receive
selected safety updates. - Remove or revoke a contact's access.

**Purpose:** Give the user control over who can see their shared
location and receive alerts.

A contact must be authorized before receiving private location
information. Knowing a user's account ID or URL must never be enough to
access their location.

### 4.3 Live Location Sharing

When the user chooses to start location sharing:

1.  The website requests location permission from the browser.
2.  The browser obtains coordinates when the device and permission allow
    it.
3.  The website sends the location to the Java backend.
4.  The backend validates the request and stores the latest successfully
    received location.
5.  Authorized contacts can view the location on a map.
6.  The interface displays the last successful update time and sharing
    status.
7.  The user can stop sharing.

**Purpose:** Let trusted contacts see the latest location the user has
chosen to share.

### 4.4 Live Battery Status

Where supported by the browser and device, the website will: - Read the
reported battery percentage. - Send the value to the backend. - Display
the latest reported percentage to authorized contacts. - Show when the
battery information was last received. - Display "Unavailable" when the
browser does not provide battery information.

Proposed configurable alert levels: - **Low battery:** 15% - **Critical
battery:** 5%

These are initial example thresholds and can be changed during
implementation.

**Purpose:** Give trusted contacts additional context about whether the
user's device may soon become unavailable.

### 4.5 Low-Battery Alert and Last-Known Location

When the browser reports that the battery has crossed a configured
threshold:

1.  The website submits the battery report.
2.  The backend stores the report and checks whether an alert threshold
    has been crossed.
3.  The backend requests an alert to the user's authorized contacts.
4.  The website may attempt to obtain and upload a fresh location.
5.  The backend retains the latest location it has already received.

If the phone later loses power, trusted contacts can still view the
**last successfully uploaded location**, together with its timestamp.

**Important:** A website cannot guarantee a final location upload
immediately before a phone switches off. The browser may not support
battery reporting, may be suspended, may lose internet connectivity, or
may be closed. A powered-off phone cannot send new information. The
reliable design is to save each successful location update on the server
as it arrives.

### 4.6 SOS Emergency Alert

The SOS feature is intended to make it quick for a user to request help
from trusted people.

Proposed workflow:

1.  The user presses the SOS button.
2.  The website sends an authenticated SOS request to the backend.
3.  The backend creates an emergency record.
4.  The backend associates the latest available location and its
    timestamp.
5.  The backend identifies the user's active trusted contacts.
6.  The notification service attempts to notify those contacts.
7.  The website displays the emergency event and its processing/delivery
    status.
8.  The website provides a user-initiated emergency-call action.

For users in India, the website may provide a call action for **112**,
the pan-India emergency number. The user must initiate or confirm the
call through the device's dialer.

**Important:** Creating an SOS event or sending a notification does not
mean that police have received the alert or dispatched assistance.
Direct integration with police dispatch or government emergency systems
is outside the initial scope and would require official authorization
and integration.

### 4.7 Safe Journey Monitoring

Users will be able to: - Enter a destination label. - Set an expected
arrival time. - Share the journey status with authorized contacts. -
Send a manual check-in. - Mark the journey as completed. - Cancel a
journey when necessary.

If the expected arrival time passes without a check-in, the backend can
mark the journey overdue after a configured grace period and request a
notification to trusted contacts.

**Purpose:** Help trusted contacts notice when a planned journey has not
been confirmed as complete.

### 4.8 Emergency and Journey History

The account owner will be able to review: - Previous SOS events. - Alert
timestamps and statuses. - Journey history. - Check-in and arrival
records. - The latest available location information associated with an
event, where retained.

History and location retention periods must be defined before production
release.

------------------------------------------------------------------------

## 5. How the System Will Work

### 5.1 Main User Workflow

``` mermaid
flowchart TD
    A([User opens website]) --> B[Register or sign in]
    B --> C[Open safety dashboard]
    C --> D[Add and authorize trusted contacts]
    D --> E{Choose an action}
    E -->|Share location| F[Grant browser location permission]
    F --> G[Website sends location to backend]
    G --> H[Backend validates and stores latest location]
    H --> I[Authorized contacts view map and updates]
    E -->|Start journey| J[Set destination and expected arrival]
    J --> K[Backend stores active journey]
    K --> L[User checks in or marks arrival]
    E -->|SOS| M[Create emergency event]
    M --> N[Notify trusted contacts]
    N --> O[Show user-initiated emergency call option]
```

### 5.2 Live Location Data Flow

``` mermaid
sequenceDiagram
    autonumber
    participant U as User Browser
    participant G as Browser Geolocation
    participant API as Spring Boot Backend
    participant DB as MySQL
    participant C as Trusted Contact

    U->>G: Request location after user permission
    G-->>U: Coordinates and accuracy
    U->>API: Send authenticated location update
    API->>API: Validate user and active sharing session
    API->>DB: Save location and server receive time
    DB-->>API: Save successful
    API-->>U: Update accepted
    API-->>C: Deliver update through authorized live channel
    C->>C: Refresh map marker and last-updated time
```

### 5.3 SOS Data Flow

``` mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant W as React Website
    participant API as Spring Boot
    participant DB as MySQL
    participant N as Notification Provider
    participant T as Trusted Contacts
    participant P as Phone Dialer

    U->>W: Press SOS
    W->>API: Submit authenticated SOS request
    API->>API: Validate request and identify user
    API->>DB: Create emergency event
    API->>DB: Read active trusted contacts
    API->>N: Request alert delivery
    N-->>T: Deliver through configured channel
    API-->>W: Return event ID and processing status
    W->>P: Offer emergency call action
    U->>P: Confirm/initiate call
```

### 5.4 Low-Battery and Last-Known-Location Flow

``` mermaid
flowchart TD
    A[Browser checks battery capability] --> B{Battery API available?}
    B -->|No| C[Show battery information unavailable]
    B -->|Yes| D[Read actual reported battery level]
    D --> E{Threshold crossed?}
    E -->|No| F[Continue normal updates]
    E -->|Yes| G[Send battery report]
    G --> H[Backend stores battery status]
    H --> I[Backend requests low-battery notification]
    I --> J[Browser attempts fresh location update]
    J --> K{Location and network available?}
    K -->|Yes| L[Backend stores new last-known location]
    K -->|No| M[Keep previous successful server location]
```

### 5.5 Safe Journey Flow

``` mermaid
flowchart TD
    A[User starts journey] --> B[Enter destination and expected arrival]
    B --> C[Backend stores journey]
    C --> D[Journey remains active]
    D --> E{User checks in before deadline?}
    E -->|Yes| F[Record check-in or arrival]
    F --> G[Mark journey safe/completed]
    E -->|No| H[Server checks deadline and grace period]
    H --> I[Mark journey overdue]
    I --> J[Notify authorized trusted contacts]
```

------------------------------------------------------------------------

## 6. System Architecture

The project follows a layered architecture. The React website handles
the user interface and browser capabilities. The Spring Boot backend
handles authentication, permissions, business logic, data validation,
persistence, and notification coordination.

``` mermaid
flowchart TB
    subgraph CLIENT["Client Layer"]
        OWNER[User / Share Owner]
        CONTACT[Trusted Contact]
        REACT[React.js Responsive Website]
        GEO[Browser Geolocation API]
        BAT[Battery API where supported]
        OWNER --> REACT
        CONTACT --> REACT
        REACT --> GEO
        REACT --> BAT
    end

    subgraph BACKEND["Application Layer - Java Spring Boot"]
        AUTH[Authentication and Authorization]
        USER[User and Profile Service]
        TRUST[Trusted Contact Service]
        LOC[Location Service]
        BATT[Battery Service]
        SOS[SOS / Emergency Service]
        JOURNEY[Journey Service]
        NOTIFY[Notification Service]
        REALTIME[WebSocket Service]
        AUTH --> USER
        AUTH --> TRUST
        AUTH --> LOC
        AUTH --> BATT
        AUTH --> SOS
        AUTH --> JOURNEY
        SOS --> NOTIFY
        JOURNEY --> NOTIFY
        LOC --> REALTIME
        BATT --> REALTIME
    end

    DB[(MySQL Database)]
    MAP[Map Provider]
    EXT[Email / SMS / Push Provider]

    REACT -->|HTTPS REST APIs| AUTH
    REACT <-->|WSS live updates| REALTIME
    REACT --> MAP
    USER --> DB
    TRUST --> DB
    LOC --> DB
    BATT --> DB
    SOS --> DB
    JOURNEY --> DB
    NOTIFY --> EXT
```

### Architecture Responsibilities

  -----------------------------------------------------------------------
  Component                           Responsibility
  ----------------------------------- -----------------------------------
  React.js                            User interface, forms, dashboard,
                                      map, user actions

  Browser Geolocation                 Obtain location with user
                                      permission

  Browser Battery API                 Provide battery information only
                                      where supported

  Spring Boot REST API                Process requests and enforce
                                      business rules

  Spring Security                     Authentication and access control

  Spring Data JPA / Hibernate         Java object-relational database
                                      access

  MySQL                               Persist users, contacts, locations,
                                      journeys and alerts

  WebSocket                           Deliver authorized real-time
                                      updates

  Map provider                        Render map tiles and location
                                      markers

  Notification provider               Send configured email, SMS or push
                                      notifications
  -----------------------------------------------------------------------

### Why This Architecture?

-   **Separation of concerns:** Frontend, backend, database and
    integrations have clear responsibilities.
-   **Reusable backend:** A future Android app can use the same APIs.
-   **Maintainability:** Features can be developed and tested as
    separate modules.
-   **Security:** The backend, not the browser, decides who may access
    private information.
-   **Extensibility:** Additional notification channels and mobile
    clients can be added later.

------------------------------------------------------------------------

## 7. Proposed Technology Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Why it is used
  ----------------------- ----------------------- -----------------------
  Frontend                React.js                Responsive and
                                                  component-based website

  Frontend language       JavaScript / TypeScript Browser application
                                                  logic

  Backend                 Java + Spring Boot      REST APIs and business
                                                  logic

  Security                Spring Security         Authentication and
                                                  authorization

  ORM                     Spring Data JPA +       Database persistence
                          Hibernate               

  Database                MySQL                   Structured and
                                                  persistent data

  Real-time updates       Spring WebSocket        Live location and
                                                  status updates

  Maps                    Leaflet + OpenStreetMap Interactive map display
                          (proposed)              

  Notifications           Configurable            Trusted-contact alerts
                          email/SMS/push provider 

  Build tools             Maven and npm           Backend and frontend
                                                  builds

  Version control         Git and GitHub          Source control and
                                                  collaboration

  Deployment              To be selected          Host website, backend
                                                  and database
  -----------------------------------------------------------------------

External providers and their costs, API limits, account requirements,
and terms will be reviewed before implementation.

------------------------------------------------------------------------

## 8. Proposed Database Design

The first database design will use MySQL with Spring Data JPA.

### Main Entities

  Entity / Table                Purpose
  ----------------------------- ---------------------------------------------
  `users`                       Account and profile information
  `trusted_contacts`            Owner-to-contact authorization relationship
  `location_sharing_sessions`   Start/stop sharing sessions
  `locations`                   Received location points and timestamps
  `battery_reports`             Actual reported battery information
  `emergency_alerts`            SOS and other safety alert records
  `journeys`                    Destination and expected arrival
  `journey_checkins`            Check-in and arrival events
  `notifications`               Notification channel and delivery status

### Entity Relationship Diagram

``` mermaid
erDiagram
    USERS ||--o{ TRUSTED_CONTACTS : owns
    USERS ||--o{ LOCATION_SHARING_SESSIONS : starts
    USERS ||--o{ LOCATIONS : reports
    USERS ||--o{ BATTERY_REPORTS : reports
    USERS ||--o{ EMERGENCY_ALERTS : triggers
    USERS ||--o{ JOURNEYS : starts
    USERS ||--o{ NOTIFICATIONS : receives
    TRUSTED_CONTACTS }o--|| USERS : references_contact
    LOCATION_SHARING_SESSIONS ||--o{ LOCATIONS : contains
    JOURNEYS ||--o{ JOURNEY_CHECKINS : has
    EMERGENCY_ALERTS ||--o{ NOTIFICATIONS : creates
```

### Important Data Rules

-   Passwords are stored only as secure hashes, never as plain text.
-   Location access requires an active trusted-contact authorization.
-   Every location update is associated with an authenticated user and
    sharing session.
-   Battery values must be between 0 and 100.
-   Coordinates must be validated.
-   Server receive time is stored separately from client capture time.
-   Revoking a contact stops future access and live updates.
-   Location retention and deletion policies must be defined before
    production.

------------------------------------------------------------------------

## 9. Proposed API Overview

The backend will expose versioned REST endpoints under `/api/v1`.

  --------------------------------------------------------------------------------------
  Method                  Endpoint                               Functionality
  ----------------------- -------------------------------------- -----------------------
  POST                    `/auth/register`                       Register user

  POST                    `/auth/login`                          Login

  GET                     `/auth/me`                             Get current profile

  POST                    `/contacts/invitations`                Invite trusted contact

  GET                     `/contacts`                            List contacts

  DELETE                  `/contacts/{contactId}`                Revoke contact

  POST                    `/sharing-sessions`                    Start location sharing

  POST                    `/sharing-sessions/{sessionId}/stop`   Stop location sharing

  POST                    `/locations`                           Upload location

  GET                     `/users/{userId}/location/latest`      Get latest location if
                                                                 authorized

  POST                    `/battery-reports`                     Submit available
                                                                 battery status

  POST                    `/sos`                                 Create SOS event

  GET                     `/sos/history`                         View own SOS history

  POST                    `/journeys`                            Start safe journey

  POST                    `/journeys/{journeyId}/check-ins`      Check in

  POST                    `/journeys/{journeyId}/arrive`         Mark arrival
  --------------------------------------------------------------------------------------

These are proposed API contracts. They will be finalized and tested
during backend implementation.

------------------------------------------------------------------------

## 10. User Roles

### 10.1 Safety Share Owner

The person using the platform to manage their safety sharing.

Permissions: - Manage their account. - Add and revoke trusted
contacts. - Start and stop location sharing. - Start and manage
journeys. - Trigger SOS. - View their own history and sharing status.

### 10.2 Trusted Contact

A person explicitly authorized by the owner.

Permissions: - View only the information shared with them. - Receive
relevant SOS and journey notifications. - View the latest available
location while authorization and sharing rules permit.

A trusted contact cannot silently activate tracking or change the
owner's privacy settings.

### 10.3 Administrator

An optional operational role for platform maintenance, abuse handling,
and service health.

Administrator access to private location data should be restricted,
justified, and audited. Routine unrestricted location access is not part
of the intended design.

------------------------------------------------------------------------

## 11. Security, Privacy, and Consent

Location and emergency information are sensitive. The system will follow
these principles:

1.  **Explicit consent:** Ask the user before location sharing begins.
2.  **Visible status:** Clearly show whether sharing is active or
    stopped.
3.  **User control:** Provide an easy way to stop sharing and revoke
    contacts.
4.  **Authorization:** Check permissions on every protected backend
    request and live subscription.
5.  **Secure transport:** Use HTTPS and WSS in production.
6.  **Credential protection:** Hash passwords and protect session
    credentials.
7.  **Data minimization:** Collect only information needed for the
    feature.
8.  **Retention controls:** Define how long detailed location and
    emergency history is kept.
9.  **Auditability:** Record important security and emergency workflow
    events without unnecessarily logging precise coordinates.
10. **Honest status:** Distinguish an alert being created, sent, and
    confirmed delivered.

The project must not support hidden or unauthorized tracking.

Before a public launch, applicable privacy and legal requirements must
be reviewed and a clear privacy notice and terms must be provided.

------------------------------------------------------------------------

## 12. Limitations and Risk Management

  -----------------------------------------------------------------------
  Area                    Limitation / Risk       Planned handling
  ----------------------- ----------------------- -----------------------
  Browser GPS             Requires permission and Explain permission and
                          a supported secure      show unavailable state
                          browser context         

  Background tracking     A website cannot        Show last update time;
                          guarantee tracking      plan native Android
                          after it is closed or   client
                          suspended               

  Battery API             Not consistently        Feature-detect and show
                          supported across        unavailable
                          browsers                

  Phone shutdown          Powered-off phone       Preserve last
                          cannot transmit a final successfully received
                          location                server location

  Network loss            Updates and alerts may  Show connection state
                          fail to reach the       and retain last server
                          server/provider         update

  GPS accuracy            Indoor or poor-signal   Store and display
                          location may be         reported accuracy
                          inaccurate              

  Notifications           External provider may   Store delivery status
                          fail or delay delivery  and handle retries

  Emergency response      App cannot guarantee    Provide trusted-contact
                          police dispatch or      alerts and
                          rescue                  user-initiated
                                                  emergency call
  -----------------------------------------------------------------------

### Important distinction

The platform can preserve and share the **last location successfully
received by the backend**. It cannot guarantee the exact location at the
instant a phone powers off.

Likewise, a successful backend response confirms that the backend
processed a request; it does not automatically confirm that a
notification was received or read by a contact.

------------------------------------------------------------------------

## 13. Expected Outcomes

When implemented and tested, the project aims to provide:

-   A single website for managing personal safety sharing.
-   A clear and controlled trusted-contact system.
-   A map-based view of the latest shared location.
-   Better awareness of device battery status where supported.
-   A centralized SOS workflow for trusted-contact alerts.
-   Preservation of the last successfully received location.
-   A structured safe-journey and check-in workflow.
-   A backend that can support a future Android application.

The success of the project will be evaluated through functional testing,
authorization testing, reliability testing, and usability feedback. No
safety outcome or emergency response time is guaranteed.

------------------------------------------------------------------------

## 14. Development Roadmap

The project will be developed incrementally.

### Phase 1 --- Planning and UI/UX

-   [x] Define project concept and website-first direction
-   [x] Prepare initial architecture and feature documentation
-   [ ] Create wireframes and responsive UI design
-   [ ] Finalize MVP requirements

### Phase 2 --- Project Foundation

-   [ ] Set up React frontend
-   [ ] Set up Java Spring Boot backend
-   [ ] Configure MySQL
-   [ ] Configure API validation and error handling
-   [ ] Configure development environment

### Phase 3 --- Accounts and Trusted Contacts

-   [ ] Registration and login
-   [ ] User profile
-   [ ] Trusted-contact invitations
-   [ ] Contact acceptance and revocation
-   [ ] Backend authorization tests

### Phase 4 --- Location Sharing

-   [ ] Browser location permission flow
-   [ ] Start/stop sharing
-   [ ] Location upload API
-   [ ] Store last-known location
-   [ ] Map interface
-   [ ] Authorized live updates

### Phase 5 --- Battery and SOS

-   [ ] Battery capability detection
-   [ ] Battery reporting where supported
-   [ ] Low-battery alert workflow
-   [ ] SOS event creation
-   [ ] Trusted-contact notifications
-   [ ] Emergency call handoff

### Phase 6 --- Safe Journey

-   [ ] Start journey
-   [ ] Expected arrival and grace period
-   [ ] Check-in and arrival confirmation
-   [ ] Missed check-in processing
-   [ ] Journey history

### Phase 7 --- Testing and Deployment

-   [ ] Functional testing
-   [ ] Security and authorization testing
-   [ ] Network and provider failure testing
-   [ ] Responsive and accessibility testing
-   [ ] Production configuration and deployment
-   [ ] Privacy and operational review

### Phase 8 --- Future Android Application

-   [ ] Android client
-   [ ] Reuse backend APIs
-   [ ] Native location foreground service
-   [ ] Native battery reporting and notifications
-   [ ] Background behavior testing

------------------------------------------------------------------------

## 15. Proposed Repository Structure

``` text
women-safety-tracking-system/
│
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── .gitignore
│
├── docs/
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATA_FLOW.md
│   ├── DATABASE_DESIGN.md
│   ├── API_DOCUMENTATION.md
│   ├── SECURITY.md
│   ├── MODULES.md
│   └── DEVELOPMENT_ROADMAP.md
│
├── frontend/
│   └── React application
│
└── backend/
    └── Spring Boot application
```

The frontend and backend folders will be populated during
implementation.

------------------------------------------------------------------------

## 16. Conclusion

The Women Safety Live Tracking System aims to provide a practical,
consent-based platform that connects location sharing, trusted contacts,
battery awareness, SOS alerts, and safe-journey monitoring.

The project begins as a responsive website using React.js, Java Spring
Boot, and MySQL. Its API-first backend design will allow a future
Android application to reuse the same core services.

The central principle is simple:

**Give users control over sharing, help them notify people they trust,
and preserve the latest information the system has successfully
received.**

------------------------------------------------------------------------

## 17. Project Status and Disclaimer

This repository currently describes the proposed project design and
development plan. Features listed in this README are planned unless
explicitly marked as implemented and tested in a future release.

This software is intended as a supplementary safety-support tool. It is
not a substitute for contacting official emergency services. It cannot
guarantee GPS availability, internet connectivity, battery reporting,
alert delivery, police response, or personal safety.

For immediate danger, contact the appropriate official emergency service
directly.
