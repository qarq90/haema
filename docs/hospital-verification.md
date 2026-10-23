# Hospital account verification

Hospital blood requests require server-verified Clerk public metadata. A user
cannot grant this role to themselves from the app.

After verifying the organization and account out of band, an administrator can
set this metadata on the Clerk user:

```json
{
  "role": "hospital",
  "hospitalVerified": true,
  "hospitalName": "Verified Hospital Name"
}
```

The request API checks all three values on the server and uses the verified
`hospitalName` from metadata. It ignores any hospital name sent by the client.
To revoke posting access, remove `hospitalVerified` or change `role` in Clerk.
