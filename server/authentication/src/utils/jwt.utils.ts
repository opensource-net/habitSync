import jwt from "jsonwebtoken";

const privateKey = process.env.JWT_PRIVATE_KEY;
const publicKey = process.env.JWT_PUBLIC_KEY;
const jwtSecret = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
const useRsa = Boolean(privateKey && publicKey);

// sign jwt
export function signJWT(payload: object, expiresIn: string | number) {
  if (useRsa && privateKey) {
    return jwt.sign(payload, privateKey, { algorithm: "RS256", expiresIn });
  }

  return jwt.sign(payload, jwtSecret, { algorithm: "HS256", expiresIn });
}

// verify jwt
export function verifyJWT(token: string) {
  try {
    const decoded =
      useRsa && publicKey
        ? jwt.verify(token, publicKey, { algorithms: ["RS256"] })
        : jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });

    return { payload: decoded, expired: false };
  } catch (error) {
    return {
      payload: null,
      expired: error instanceof Error && error.message.includes("jwt expired"),
    };
  }
}
