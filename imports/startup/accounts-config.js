import { Accounts } from 'meteor/accounts-base';

// Allow the login & sign up with Username instead of Email
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});
