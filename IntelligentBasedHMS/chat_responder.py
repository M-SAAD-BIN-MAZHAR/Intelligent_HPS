from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


app = FastAPI()


app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)


@app.post("/chat")
async def chat(request: Request):
   data = await request.json()
   user_message = data.get("message", "")
   return {"response": f"This is a simulated AI reply to: '{user_message}'"}


if __name__ == "__main__":
   uvicorn.run(app, host="127.0.0.1", port=8000)