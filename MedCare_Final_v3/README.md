# MedCare HMS — Hospital Management System

## Setup & Run

```bash
npm install
npm run dev
```

Open: http://localhost:8080

## Login Credentials

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | admin@medcare.com      | Admin123   |
| Doctor  | doctor@medcare.com     | Doctor456  |
| Staff   | staff@medcare.com      | Staff789   |
| Patient | Register → then Sign In |           |

## Features by Role

### Admin — Full Access
- All 17 modules, staff attendance, reports, admin panel

### Doctor — Full Access (except Admin Panel)
- All modules, accept/reject appointments, full CRUD

### Staff — Full Access (except Admin Panel, no salary view, no attendance marking)
- All modules, can add staff, manage operations

### Patient — View Only + Book Appointment + Blood Bank
- Book appointments (pending → doctor accepts)
- Register as blood donor / request blood
- View all other modules (read-only)
