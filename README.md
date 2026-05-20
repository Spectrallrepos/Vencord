# [Vencord](https://vencord-liart.vercel.app/)

A real-time multi-user chat application built with vanilla HTML, CSS, and JavaScript — powered by Firebase.
## Features
- **Google Authentication** — Sign in with your Google account
- **Guest Login** — Join as a guest with a display name (no account needed)
- **Real-time Messaging** — Messages appear instantly across all connected users without page refresh
- **Room Management** — Create named chat rooms, join existing ones from the sidebar
- **Message History** — Previous messages load automatically when entering a room
- **Member List** — See the list of all members in a room and their current status
- **Room Search** — Filter rooms in the sidebar by name
- **Responsive Design** — Works on both desktop and mobile with smooth room switching

---
## Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Frontend       | HTML, CSS, JavaScript (Vanilla)    |
| Authentication | Firebase Auth (Google + Anonymous) |
| Database       | Firebase Firestore v9 compat CDN   |
| Real-time      | Firestore `onSnapshot` listeners   |
| Deployment     | Vercel                             |

---
## Security
- Handled entirely by firebase
- Firestore rules restrict all reads and writes to authenticated users only
- Anonymous users can read and send messages but cannot create rooms
- Firebase API key is restricted to authorized domains only
---

## Built For

KodeinKGP — Technology Web3.0 Society, Review Meet Task (Tech Team)
