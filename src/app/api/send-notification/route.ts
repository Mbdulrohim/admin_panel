export async function GET() {
    return new Response(
      JSON.stringify({ message: "Place Holder" }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
  