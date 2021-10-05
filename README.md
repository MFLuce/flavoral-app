# flavoral-app

Ironhack Project Module 2

Objective : Communication tool for customers to our company team with an administrator to dispatch the customer requests

User
We have users from customers and users from company ? So maybe we should have a property like a category who's prefill
1- The company user will be created by an administrator directly in the app with a form in the dashboard of the administrator

CUSTOMER :
1- Create an account
2- Create a post
3- See all posts he created

INTERNAL TEAM :

- THE ADMINISTATOR:
  1- The administrator creates the intern accounts for each team member
  2- The administrator assigns each post to the right person
  3- Admin has a dashboard : - By default See all the new posts waiting assignment - Check box to assign posts to a team member

- TEAM MEMBERS :
  1- Each team member can see its own posts
  2- An email is sent to the team member as soon as the administrator assigns the post
  3- Each team member can close its own posts and write the action which solved the post

User model
companyName: String!
userName: String!
location: String! --> Only list values
email: String!Unique
jobTitle: String --> Only list values
companySector: String --> Only list values
phoneNumber: Number!
isAdmin: Boolean --> Default : false
isCompany: Boolean --> Default : false
password: String!

Post model
user: ref User!
category: String! --> Only list values : Commercial, Accounting, General, Technical
type: String! --> Only list values depend on the choosen category (commercial inquiry, reclaim, technical information, missing documentation, delivery delay...)
text: String!
date: Date!
isResolved: Boolean! --> Post closed or open : only the person in charge of can close the post
actionToResolve : String! --> Only if isResolved is true or a default value
inCharge: ref User!

Comments Model --> LATER
user: User!
post: Post!
date: Date!

TO DO

GET / Home Page ✅
GET / Signup ✅
POST / Signup ✅
GET / Login ✅
POST / Login ✅
GET / Logout ✅
POST / update-profile ✅
POST / update-password ✅
POST / delete-account
GET / profile ✅
GET / see-posts ✅
POST / create-post ✅
GET / admin-dashboard
POST / admin-dashboard
GET / team-dashboard
POST / team-dashboard

STYLING ACTIONS

CREATE A MENU AT THE LEFT OF THE WINDOW FOR THE ACCOUNT ACTIONS

INSERT FLASH MESSAGE TO :

- YOUR PROFILE IS UPDATED
- YOUR PASSWORD IS UPDATED
- YOUR POST IS DELETED
- ...

REMOVE THE NAME OF THE PAGE WHERE THE USER IS :

- IF THE USER IS ON THE HOME PAGE, THE LINK TO HOM SHOULD DISAPPEAR
- SAME FOR :
  - UPDATE YOUR PROFILE
  - MODIFY YOUR PASSWORD
  - ...
