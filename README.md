# SafeWay – Women Safety Tracking Prototype (Java 8)

## Stack
- Java 8, Spring Boot 2.7.18, Maven
- Spring Web, Spring Security, Spring Data JPA / Hibernate
- MySQL 8 (Connector/J 8.0.33)
- React 18, Vite 5, Leaflet / OpenStreetMap

## Features in this prototype
1. Account registration/login with BCrypt password hashing and bearer-token authentication.
2. Trusted-contact invitations, acceptance, listing and removal. Location access is limited to accepted trusted contacts.
3. Live browser location updates while the dashboard remains open and the user has granted geolocation permission. The backend stores each successful GPS upload; the latest stored coordinate remains available after the device disconnects.
4. SOS event creation. In-app notifications are recorded for accepted trusted contacts. Contacts can request the sender's last successfully uploaded location through the protected latest-location endpoint / UI. No SMS, phone push, police dispatch or emergency-service integration is included.
5. Battery level reports where `navigator.getBattery()` is supported. Reports at or below 20% create in-app low-battery notifications for accepted trusted contacts. A contact can query `/api/battery/latest/{userId}`.
6. Safe journeys: destination label, expected arrival, manual check-in, mark arrived, cancel. A scheduled backend monitor marks an ACTIVE journey OVERDUE after the configured grace period and creates in-app notifications for accepted contacts.
7. SOS history and notification history.

## Database
Create the database once:
```sql
CREATE DATABASE women_safety CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Configure `backend/src/main/resources/application.properties` with your MySQL username/password. Hibernate `ddl-auto=update` creates/updates these tables: `app_users`, `trusted_contacts`, `location_points`, `sos_alerts`, `battery_reports`, `safe_journeys`, `safety_notifications`.

## Run backend in IntelliJ
1. Open the `backend` folder (or add `backend/pom.xml` as Maven project).
2. Set Project SDK and Maven importer/runner JDK to Java 8.
3. Maven home: Bundled Maven; disable Offline mode; reload Maven project.
4. Set MySQL credentials in `application.properties`.
5. Run `in.safeway.app.SafetyApplication`.
6. API base URL: `http://localhost:8080/api`.

## Run frontend
Open a terminal in the `frontend` directory (the same directory containing `package.json`):
```powershell
npm install
npm run dev
```
Open the Vite URL, normally `http://localhost:5173`.

## Two-user test
1. Register User A in a normal browser window.
2. Register User B in an incognito/private window.
3. A invites B using B's registered email; B accepts the invitation.
4. A starts live sharing and grants location permission. Keep the page open.
5. B can view A's latest location. A can send an SOS or start a safe journey; B sees in-app notifications after refreshing/reloading the dashboard.
6. Test battery alerts only on browsers exposing the Battery Status API. Set journey arrival a few minutes ahead to test overdue behavior; default grace is 15 minutes.

## Important limitations
- Browser GPS sharing is foreground/session-dependent. It is not guaranteed when the browser is closed, suspended, the device loses power, or connectivity is unavailable. Last-known location means the last successful upload, not a fresh location after shutdown.
- Battery Status API support is limited and may be unavailable; no value is fabricated when unsupported.
- Notifications are persisted in the app database and shown when the recipient loads/refreshes the app. No external SMS/email/push gateway is configured.
- SOS creation is not confirmation that emergency services or police have received a request. Use India's emergency number 112 directly when needed.
- This is a student prototype, not a production-grade safety guarantee. Use HTTPS, strong secrets, rate limiting, audit logging, backup/retention policies, security review and a real notification provider before deployment.
- Spring Boot 2.7.18 is an older release. It is selected for Java 8 compatibility, not recommended as a new production baseline.
