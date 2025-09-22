## DevTinder APIs

## authRouter
-POST /signup
-POST /login
-POST /logout

## profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password -(forget password)

## connectionRequestRouter
-POST /request/send/:status/:userId
-POST /request/review/:status/:userId

## userRouter
-GET /user/connections
-GET /requests/received
-GET /user/feed        - Gets you the profiles of other users on platform



Status: ignored, interested, accepted, rejected