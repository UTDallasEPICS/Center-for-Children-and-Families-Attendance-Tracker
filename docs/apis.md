# API Specification

## Intern Home Page

### POST - /api/intern/time/[user_id]
**Content Type:** application/json  
**Request Body:**
```json
{
"check_in_type": "bool",
"check_in_code": "string?"
}
```

**Response Type:** None  

**Description:**  
Updates the intern’s check-in or check-out time for the current day. The request updates the values stored in `Users.attendance_history.clock_in_time` and `clock_out_time`.

---

### GET - /api/intern/schedule/[user_id]
**Content Type:** None   

**Response Type:** application/json  
**Response Body:** 
```json
{
  "attendance_history": {
    "previous_shifts": [
      {
        "datetime": "ISO 8601 Datetime",
        "site": "site_id",
        "attendance_status": "present | absent | covered",
        "checkin_time": "ISO 8601 Datetime",
        "checkout_time": "ISO 8601 Datetime",
      },
      ...
    ],
    "future_shifts": [
      {
        "datetime": "ISO 8601 Datetime",
        "site": "site_id",
        "attendance_status": "upcoming | covered | null",
         "checkin_time": "null",
        "checkout_time": "null",
      },
      ...
    ],
  }
}
```
**Description:**  
Retrieves entirety of semesters scheduled days assigned to a specific intern and returns relevant dates and times.

---

## Participant Check-In

### GET - /api/participants/[site_id?]
**Content Type:** None  

**Response Type:** application/json  
**Response Body:**
```json
{
  "participants": {
    "particpant_name": "String",
    "DOB": "String",
    "guardians": ["String"],
    },
}
```

**Description:**  
Retrieves participant information. If an ID is provided, only that participants of the specific location are returned. If not, all participants are returned with only the necessary fields for check-in.

---

### POST - /api/participants/attendance/[participant_id?]
**Content Type:** application/json  
**Request Body:**
```json
{
  "clock_in_time": "ISO 8601 Datetime",
  "data" : {
    "guardians": ["bool"],
    "additional_children": "bool",
    "comments": ["String"],
  },
}
```

**Response Type:** None  

**Description:**  
Sends a completed participant weekly check-in JSON object to REDCap to update the participant’s profile.

---


## Site Manager Page

### GET - /api/site/interns/[site_id]
**Content Type:** None  
**Response Type:** application/json  

**Body:** 
all fields  

**Description:**  
Retrieves all interns assigned to a specific site and returns only relevant information needed for the site manager page.

---

### GET - /api/site/code/[site_id]
**Content Type:** None  
**Response Type:** text/plain  

**Body:** None  

**Description:**  
Retrieves the daily attendance code for the specified site, if it doesn't exist then it will generate it

---

### PUT - /api/timeworked/[entry_id]/fix
**Content Type:** application/json  
**Response Type:** application/json  

**Body:**
```json
{
"clock_in_time": "timestamp",
"clock_out_time": "timestamp",
"reason": "string"
}
```
**description:**
Manually updates an intern’s recorded work hours to correct attendance errors such as missed clock-ins, incorrect durations, or system logging issues. The hoursWorked field specifies the corrected number of hours, and the reason field documents why the adjustment was made.

---

## Intern Attendance History

### GET - /api/intern/attendance/[user_id?]
**Content Type:** None  
**Response Type:** application/json  

**Body:** None  

**Description:**  
Retrieves attendance history. Can return all interns and their attendance records or a specific intern’s history depending on whether a `user_id` is provided.

---

## Staff Directory / Calendar

### GET - /api/user
**Content Type:** None  
**Response Type:** application/json  

**Body:** None  

**Description:**  
Fetches all interns and their relevant information such as location and student status for display in the staff directory.

---

### GET - /api/user/[user_id]
**Content Type:** None  
**Response Type:** application/json  

**Body:** None  

**Description:**  
Retrieves detailed information about a specific user for editing in the staff directory.

---

### PUT - /api/user/[user_id]
**Content Type:** application/json  
**Response Type:** application/json  

**Body:**
```json
{
"name": "string",
"email": "string",
"phone": "string",
"site": "string",
"work_days": ["string"],
"role": "string",
"net_ID": "STRING"
}
```

**Description:**  
Updates intern information in the `User` table according to admin input.

---

### POST - /api/user
**Content Type:** application/json  
**Response Type:** application/json  

**Body:**
```json
{
"name": "string",
"email": "string",
"phone": "string",
"site": "string",
"status": "bool" ,
"work_days": ["string"],
"role": "string",
"net_ID": "STRING"
}
```

**Description:**  
Creates a new user account and populates it with relevant data, including role.

---


## Scheduling Page

### POST - /api/schedule/swap-request/[user_id]
**Content Type:** application/json  
**Response Type:** application/json  

**Body:**
```json
{
"user_id": "string",
"shift_id": "string"
}
```

**Description:**  
Allows interns to submit a shift swap request.

---

### POST - /api/schedule/looking-for/["user_id"]
**Content Type:** application/json  
**Response Type:** application/json  

**Body:**
```json
{
"user_id": "string",
"shift_id": "string"
}
```

**Description:**  
Allows interns to post a request indicating they are looking for someone to cover a shift.

---

### POST - /api/schedule/pickup-request/[user_id]
**Content Type:** application/json  
**Response Type:** application/json  

**Body:**
```json
{
"user_id": "string",
"shift_id": "string"
}
```

**Description:**  
Allows interns to request picking up an available shift. (Pick-up status is not yet implemented in the database.)

---

### GET - /api/schedule/requests
**Content Type:** None  
**Response Type:** application/json  

**Body:** None  

**Description:**  
Retrieves all shift requests posted by users for viewing.

---

### PUT - /api/schedule/request-status/[request_id]
**Content Type:** application/json  
**Response Type:** application/json  

**Body:**
```json
{
"status": "approved | denied | pending"
}
```

**Description:**  
Allows a site manager to update the approval status of a shift request. This functionality is not currently implemented in the database.
