# jwt-auth-pack

A lightweight and easy-to-use authentication middleware package for Express.js applications. This package provides JWT-based authentication with a simple and flexible API.

## Installation

```bash
npm install jwt-auth-pack
# or
yarn add jwt-auth-pack
# or
pnpm add jwt-auth-pack
```

## Features

- JWT-based authentication
- Express.js middleware integration
- TypeScript support
- Easy token creation and verification
- Configurable token expiration
- Environment variable support for secret key

## Usage

### Basic Setup

1. First, set up your environment variable:

```env
AUTH_SECRET=your_secret_key_here
```

2. Import and use the middleware in your Express application:

```typescript
import express from "express";
import UserAuth from "jwt-auth-pack";

const app = express();
const auth = new UserAuth();

// Protected route example
app.get("/protected", auth.auth, (req, res) => {
  // Access the authenticated user's ID
  const userId = req.userId;
  res.json({ message: "Protected route accessed", userId });
});
```

### Creating Tokens

```typescript
import UserAuth from "jwt-auth-pack";

const auth = new UserAuth();

// Create a token with user data
const userData = {
  userId: "123",
  email: "user@example.com",
};

// Token expires in 60 minutes
const token = await auth.createToken(userData, 60);
```

### Verifying Tokens

The middleware automatically verifies tokens from:

- Request body (`req.body.authToken`)
- Query parameters (`req.query.authToken`)
- URL parameters (`req.params.authToken`)
- Request headers (`req.headers.authorization`) // Bearer token format
- Request headers (`req.headers.authToken`)
- Cookies (`req.cookies.authToken`)

## API Reference

### UserAuth Class

#### Constructor

```typescript
new UserAuth();
```

Creates a new instance of the authentication middleware.

#### Methods

##### auth

```typescript
auth(req: Request, res: Response, next: NextFunction): Promise<void>
```

Express middleware for protecting routes. Verifies the JWT token and attaches the user ID to the request object.

##### createToken

```typescript
createToken(data: {userId:string|number,data:object}, time: number): Promise<string>
```

Creates a new JWT token.

- `data`: Object containing user data
  - `userId`: Unique identifier for the user (string or number)
  - `data`: Additional user data to include in the token
- `time`: Token expiration time in minutes

##### verifyToken

```typescript
verifyToken(token: string): Promise<IVerified>
```
Verifies a JWT token and returns the decoded data.

##### hashPassword

```typescript
hashPassword(password: string): Promise<string>
```
Hashes a password using bcrypt.

##### comparePassword

```typescript
comparePassword(password: string, hashedPassword: string): Promise<boolean>
```
Compares a password with a hashed password.

## Error Handling

The middleware automatically handles common authentication errors:

- Missing token
- Invalid token
- Expired token

## TypeScript Support

This package is written in TypeScript and includes type definitions.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

ISC

## Author

Suryansh Verma
