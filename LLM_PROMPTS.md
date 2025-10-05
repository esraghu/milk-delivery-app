# How to build this app by talking to a computer friend (an LLM)

So, you want to build this app but the only code you know is the cheat code for extra lives in Contra. No worries! Here's how you could have bossed around a Large Language Model (LLM) to build this for you.

## Step 1: The "Big Idea" Prompt

First, you gotta tell the LLM what you want. Be specific, but you don't need to be a robot.

> **You:** "Hey LLM, my brilliant but lazy friend, let's build a delivery app. It's for my apartment building, so residents can see when they have packages. Delivery people need to be able to sign up and see what they need to deliver. Think of it like a digital doorman who never sleeps and doesn't judge you for how many packages you get."

## Step 2: Let's Make it Pretty (The Frontend)

Now, let's get the part that people will see.

> **You:** "Let's start with the part people click on. I want a React app using TypeScript, because I've heard that's what the cool kids use. For styling, make it look clean and simple. Oh, and can you add a picture of a farm as the background? It's for... reasons."

Then you'd list the pages you want:

> **You:** "I'll need a few screens:
>
> *   A **Login page** for when people forget their password for the 100th time.
> *   A **Signup page** for new residents.
> *   A separate **Signup page** for delivery people (they're special).
> *   A **Dashboard for residents** to see a list of their packages.
> *   A **Dashboard for delivery people** to see all the packages they need to deliver."

## Step 3: The Brains of the Operation (The Backend)

This is the part that does all the thinking.

> **You:** "Okay, time for the backend. Let's use Python with FastAPI. I hear it's fast. I like fast. We'll need a database, but nothing crazy. SQLite is fine. It's like a little filing cabinet for our app."

Then, you tell it what the backend needs to *do*:

> **You:** "The backend needs to be able to:
>
> *   Create new users (both residents and delivery people).
> *   Let users log in.
> *   Let delivery people add new packages for residents.
> *   Show residents their packages.
> *   Let delivery people mark packages as delivered."

## Step 4: Make them Talk to Each Other

The frontend and backend are like two awkward people at a party. We need to introduce them.

> **You:** "Alright, connect the frontend to the backend. When a user logs in on the website, the frontend should ask the backend if the password is correct. When a resident looks at their dashboard, the frontend should ask the backend for the list of packages."

## Step 5: The Final Polish

Now for the little things.

> **You:** "Can you write some simple instructions in a `README.md` file on how to run this thing? And maybe a file to test the backend to make sure it's not going to explode."

And that's it! You've just sweet-talked an AI into building you a full-stack application. Now go take a nap, you've earned it.
