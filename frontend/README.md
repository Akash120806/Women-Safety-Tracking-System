# SafeWay frontend (redesigned)

A redesigned React + Vite frontend for the existing SafeWay Spring Boot 2.7 / Java 8 backend.

## Requirements
- Node.js 18 or newer
- Backend running at `http://localhost:8081`

## Run
```bash
npm install
npm run dev
```
Open `http://localhost:5173`.

## Backend URL
The frontend defaults to `http://localhost:8081/api`. To change it, create `.env`:
```env
VITE_API_BASE_URL=http://localhost:8081/api
```
Restart Vite after changing `.env`.

## Backend endpoints used
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `POST /contacts/invite`, `GET /contacts`, `POST /contacts/{id}/accept`, `DELETE /contacts/{id}`
- `POST /locations`, `GET /users/{id}/location/latest`
- `POST /battery`, `GET /battery/latest/{userId}`
- `POST /sos`, `GET /sos/history`
- `POST /journeys`, `GET /journeys`, `POST /journeys/{id}/check-in`, `/arrive`, `/cancel`
- `GET /notifications`

## Notes
- Battery status uses `navigator.getBattery()` when the browser supports it. Some browsers/devices do not expose this API; the UI shows an unsupported state instead of inventing a reading.
- Battery reports are sent to the existing `/battery` endpoint. The backend currently creates in-app low-battery notifications at 20% or below.
- The current backend invites trusted contacts by registered email. Phone-number invitations require backend changes (a phone field, uniqueness/lookup, and API contract changes); this frontend does not pretend the email endpoint accepts phone numbers.
- Browser GPS sharing requires permission and is not guaranteed while the tab is suspended, closed, or the device is offline.
- SOS creates an in-app event. It does not send SMS, place a phone call, or dispatch emergency services.
