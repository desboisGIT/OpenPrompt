OpenPromptBank is an AI prompt library platform where users can explore, rank, and contribute AI prompts categorized by various topics. This platform features a searchable library, community-driven rankings, prompt performance benchmarks, and user profiles. The backend is powered by Django, Django REST Framework (DRF), and PostgreSQL, with Docker used for containerization.

---

## **API Documentation**

### **Base URL**
`http://127.0.0.1:8000/api/auth/`

---

### **1. User Registration**

#### **Endpoint**
`POST /register/`

#### **Description**
Allows new users to register by providing their username, email, and password.

#### **Request Headers**
None (public endpoint).

#### **Request Body**
```json
{
  "username": "your_username",
  "email": "your_email@example.com",
  "password": "your_secure_password"
}
```

#### **Response**
- **201 Created** (Successful Registration)
  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **400 Bad Request** (Validation Errors)
  ```json
  {
    "username": ["This field is required."],
    "email": ["Enter a valid email address."]
  }
  ```

---

### **2. User Login**

#### **Endpoint**
`POST /login/`

#### **Description**
Authenticates a user and returns a JSON Web Token (JWT) for session management.

#### **Request Headers**
None (public endpoint).

#### **Request Body**
```json
{
  "username": "your_username",
  "password": "your_secure_password"
}
```

#### **Response**
- **200 OK** (Successful Login)
  ```json
  {
    "refresh": "your_refresh_token",
    "access": "your_access_token"
  }
  ```
- **401 Unauthorized** (Invalid Credentials)
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

---

### **3. Token Refresh**

#### **Endpoint**
`POST /token/refresh/`

#### **Description**
Generates a new access token using a valid refresh token.

#### **Request Headers**
None (public endpoint).

#### **Request Body**
```json
{
  "refresh": "your_refresh_token"
}
```

#### **Response**
- **200 OK** (Token Refreshed)
  ```json
  {
    "access": "new_access_token"
  }
  ```
- **401 Unauthorized** (Invalid/Expired Refresh Token)
  ```json
  {
    "detail": "Token is invalid or expired"
  }
  ```

---

### **4. Protected Routes**

#### **Example Endpoint**
`GET /protected/`

#### **Description**
Access restricted to authenticated users only. Requires a valid JWT access token in the request header.

#### **Request Headers**
```json
{
  "Authorization": "Bearer your_access_token"
}
```

#### **Response**
- **200 OK** (Authorized)
  ```json
  {
    "message": "You are authenticated!"
  }
  ```
- **401 Unauthorized** (Invalid or Missing Token)
  ```json
  {
    "detail": "Authentication credentials were not provided."
  }
  ```

---

### **Error Codes**
| Status Code | Description                          |
|-------------|--------------------------------------|
| 200         | Success                              |
| 201         | Resource created                    |
| 400         | Bad request (validation error)      |
| 401         | Unauthorized (authentication failed)|
| 500         | Server error                        |

---

### **Usage Notes**
1. **Token Storage**: The React frontend should store the `access` and `refresh` tokens securely (e.g., `localStorage` or `httpOnly cookies`).
2. **Authorization Header**: Include the `Authorization: Bearer <access_token>` header in requests to protected routes.
3. **Token Refresh Flow**:
   - Use `/token/refresh/` to renew the access token before it expires.
   - Redirect to login if the refresh token also expires.

---

