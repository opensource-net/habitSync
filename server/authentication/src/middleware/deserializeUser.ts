import { NextFunction, Request, Response } from "express";
import { getSession } from "../db/database";
import { signJWT, verifyJWT } from "../utils/jwt.utils";

// // #region agent log
// fetch('http://127.0.0.1:7605/ingest/fafc974b-3bd2-4fb5-8e13-b622295dc0a0',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'dc4286'},body:JSON.stringify({sessionId:'dc4286',runId:'pre-fix-1',hypothesisId:'H3',location:'server/authentication/src/middleware/deserializeUser.ts:5',message:'deserializeUser module evaluated',data:{moduleLoaded:true},timestamp:Date.now()})}).catch(()=>{});
// #endregion

function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  const { payload, expired } = verifyJWT(accessToken);

  // For a valid access token
  if (payload) {
    // @ts-ignore
    req.user = payload;
    return next();
  }

  // expired but valid access token

  const { payload: refresh } =
    expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

  if (!refresh) {
    return next();
  }

  // @ts-ignore
  const session = getSession(refresh.sessionId);

  if (!session) {
    return next();
  }

  const newAccessToken = signJWT(session, "5s");

  res.cookie("accessToken", newAccessToken, {
    maxAge: 300000, // 5 minutes
    httpOnly: true,
  });

  // @ts-ignore
  req.user = verifyJWT(newAccessToken).payload;

  return next();
}

export default deserializeUser;
