import * as Sentry from "@sentry/gatsby";

Sentry.init({
  dsn: "https://3e1626c7bd2bfb3579b72dba067f3d3c@o4505623207149568.ingest.us.sentry.io/4511580708995072",
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/gatsby/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: []
  }
});