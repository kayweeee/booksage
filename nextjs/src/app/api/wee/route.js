import { NextResponse } from "next/server";

const dadJokes = [
  {
    setup: "Why don't eggs tell jokes?",
    punchline: "They'd crack up!",
  },
  {
    setup: "What do you call a fake noodle?",
    punchline: "An impasta!",
  },
  {
    setup: "Why did the scarecrow win an award?",
    punchline: "Because he was outstanding in his field!",
  },
  {
    setup: "What do you call a bear with no teeth?",
    punchline: "A gummy bear!",
  },
  {
    setup: "What do you call a fish wearing a bowtie?",
    punchline: "So-fish-ticated!",
  },
];

export async function GET() {
  try {
    // Get a random joke from the array
    const randomJoke = dadJokes[Math.floor(Math.random() * dadJokes.length)];

    return NextResponse.json(
      {
        success: true,
        joke: randomJoke,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch joke",
      },
      { status: 500 }
    );
  }
}

// Also handle POST requests to add new jokes (in memory only)
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.setup || !body.punchline) {
      return NextResponse.json(
        {
          success: false,
          error: "Setup and punchline are required",
        },
        { status: 400 }
      );
    }

    dadJokes.push({
      setup: body.setup,
      punchline: body.punchline,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Joke added successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add joke",
      },
      { status: 500 }
    );
  }
}
