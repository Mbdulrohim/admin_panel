export async function GET(request: Request) {
    return new Response(
      JSON.stringify({ message: "This is the base /admins route. Use /admins/me for details." }),
      { status: 200 }
    );
  }
  