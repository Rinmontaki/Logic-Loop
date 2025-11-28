from typing import Any, Dict, List

from services.ai_feedback import get_ai_feedback


def validate_lpp_code(code: str) -> Dict[str, Any]:
    """Capa de servicio para validar código LPP.

    - En el futuro aquí se puede orquestar:
      * Análisis léxico/sintáctico/semántico local.
      * Combinación de errores locales con los de IA.
    - Por ahora delega toda la validación en el modelo de IA
      y devuelve el feedback de texto más la lista de errores locales
      (vacía de momento).
    """

    local_errors: List[str] = []

    feedback = get_ai_feedback(code, local_errors)

    return {
        "feedback": feedback,
        "localErrors": local_errors,
    }
