# Security Spec for Party Fast Food

## Data Invariants
1. A menu item must have a positive price.
2. An order must have at least one item (enforced via logic, rules ensure user can only create their own orders).
3. Reservations cannot be edited by customers once created (except cancellation).
4. Admins have full access to everything.
5. Users can only read their own private profiles.

## The "Dirty Dozen" Payloads
1. Create a menu item as an unauthenticated user.
2. Update the price of a menu item as a customer.
3. Read all customer orders as a customer.
4. Create an order with a fake `total`.
5. Delete a reservation belonging to another user.
6. Create an admin user profile as a customer.
7. Update `role` field in user profile.
8. Read `settings` as a guest (Public settings like name/time are fine, but sensitive ones shouldn't exist).
9. Create a coupon as a customer.
10. Update `status` of an order as a customer.
11. Inject 1MB string into `name` field of a menu item.
12. Create a banner as a customer.

## The Invariants to enforce in rules
- `isAdmin()`: Checks if user email is `shehbazmaster256@gmail.com` OR if uid is in an `admins` collection (we'll use email for simplicity as a bootstrap).
- `isOwner(userId)`: Checks if `request.auth.uid == userId`.
