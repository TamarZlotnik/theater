Movie Theater App
The Movie Theater App is a comprehensive application designed to manage movie schedules and seat bookings for a single theater. It includes features for both customers and administrators to interact with the theater's offerings.

Home Page

View a list of scheduled movies with titles and dates.
Sort movies by date and filter by date range.

Movie Order Page
See details of each movie including title, description, duration, and scheduled date.
View a seat map indicating available and occupied seats.
Book seats for a selected movie showtime.
Ensure each seat can only be booked once per showtime.

Admin Page
Only users with admin roles can access the admin dashboard.
Manage movies: create, edit, or delete movie information.
Schedule or cancel movie showtimes.
Prevent scheduling conflicts by ensuring no two movies are scheduled simultaneously.

User Authentication

Login Page:
Users can log in with their credentials.
If a user attempts to log in without an existing account, they are redirected to the Register page.

Register Page:
Users can create a new account.
Option to choose whether the user is an admin or not during registration.
Admins have access to additional functionalities such as the Admin Dashboard.

Technologies Used
Front-end: HTML, CSS(mui), JavaScript (React.js)
Back-end: Node.js, Express.js, MongoDB
Authentication: JSON Web Tokens (JWT)
