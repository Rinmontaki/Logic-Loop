from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routes import validate  # Cambio a import absoluto

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia esto por el dominio de tu frontend en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(validate.router)
