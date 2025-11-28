from fastapi import APIRouter
from schemas.request_models import CodeRequest
from services.code_validation import validate_lpp_code

router = APIRouter()


@router.post("/validate")
def validate_code(request: CodeRequest):
    """Endpoint de validación de código LPP.

    La ruta actúa solo como capa de presentación:
    - Recibe el código desde el frontend.
    - Deleg a la capa de servicios (`validate_lpp_code`).
    - Devuelve únicamente el `feedback` que el frontend espera.
    """

    result = validate_lpp_code(request.code)
    # Mantener el contrato actual con el frontend
    return {"feedback": result["feedback"]}
