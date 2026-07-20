import json
import os
import re
from typing import Any

import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"


class GeminiAPIError(RuntimeError):
    pass


def _extraer_json(texto: str) -> dict[str, Any]:
    texto = re.sub(r"^```(?:json)?", "", texto.strip(), flags=re.IGNORECASE)
    texto = re.sub(r"```$", "", texto).strip()
    inicio, final = texto.find("{"), texto.rfind("}")
    if inicio == -1 or final == -1:
        raise ValueError("Gemini no devolvió un objeto JSON válido.")
    return json.loads(texto[inicio:final + 1])


def _consultar_gemini(prompt: str, api_key: str) -> dict[str, Any]:
    if not api_key or len(api_key.strip()) < 20:
        raise GeminiAPIError("Ingresa una API key de Gemini válida.")
    try:
        respuesta = requests.post(
            GEMINI_URL,
            headers={"Content-Type": "application/json", "x-goog-api-key": api_key.strip()},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"responseMimeType": "application/json"},
            },
            timeout=180,
        )
    except requests.exceptions.Timeout as error:
        raise GeminiAPIError("Gemini tardó demasiado en responder.") from error
    except requests.exceptions.ConnectionError as error:
        raise GeminiAPIError("No fue posible conectar con Gemini.") from error

    if not respuesta.ok:
        if respuesta.status_code in (400, 401, 403):
            raise GeminiAPIError("La API key no es válida o no tiene acceso al modelo de Gemini.")
        if respuesta.status_code == 429:
            raise GeminiAPIError("Gemini alcanzó el límite de solicitudes de esta clave.")
        try:
            detalle = respuesta.json().get("error", {}).get("message", "")
        except ValueError:
            detalle = ""
        raise GeminiAPIError(detalle or f"Gemini respondió con error {respuesta.status_code}.")

    try:
        texto = respuesta.json()["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError) as error:
        raise GeminiAPIError("Gemini respondió sin contenido utilizable.") from error
    return _extraer_json(texto)


def generar_proyecto(dificultad: str, api_key: str, proyectos_excluidos: list[str] | None = None) -> dict[str, Any]:
    prompt = f"""
Eres especialista en asignar proyectos de programación a freelancers. Genera UN proyecto nuevo
para nivel {dificultad}. No repitas: {json.dumps(proyectos_excluidos or [], ensure_ascii=False)}.
Debe ser realizable, corresponder al nivel e incluir requisitos y archivos claros.
Devuelve únicamente JSON válido, sin Markdown:
{{"nombre":"Nombre único","descripcion":"Descripción completa","duracion_estimada":"Horas estimadas",
"objetivo":"Objetivo técnico","requisitos":["Requisito 1","Requisito 2","Requisito 3"],
"archivos":["main.py","datos.json"]}}
"""
    proyecto = _consultar_gemini(prompt, api_key)
    for campo in ("nombre", "descripcion", "duracion_estimada", "objetivo", "requisitos", "archivos"):
        if campo not in proyecto:
            raise ValueError(f"Gemini no devolvió el campo obligatorio: {campo}")
    if not isinstance(proyecto["requisitos"], list) or not isinstance(proyecto["archivos"], list):
        raise ValueError("Los requisitos y archivos devueltos deben ser listas.")
    return proyecto


def evaluar_codigo(codigo: str, nombre_archivo: str, proyecto: dict[str, Any], api_key: str) -> dict[str, Any]:
    prompt = f"""
Evalúa únicamente el archivo entregado contra el proyecto. No inventes archivos.
PROYECTO: {json.dumps(proyecto, ensure_ascii=False, default=str)}
ARCHIVO: {nombre_archivo}\nCÓDIGO:\n{codigo}
Valora requisitos, funcionamiento probable, organización, legibilidad, errores y buenas prácticas.
Devuelve solo JSON válido sin Markdown:
{{"calificacion":85,"reporte":"Explicación detallada","fortalezas":["Fortaleza"],
"aspectos_mejorar":["Aspecto"],"requisitos_cumplidos":["Requisito"],
"requisitos_no_cumplidos":["Pendiente"]}}
"""
    evaluacion = _consultar_gemini(prompt, api_key)
    try:
        evaluacion["calificacion"] = max(0, min(100, float(evaluacion["calificacion"])))
    except (KeyError, TypeError, ValueError) as error:
        raise ValueError("Gemini no devolvió una calificación válida.") from error
    evaluacion.setdefault("reporte", "Gemini no proporcionó un reporte detallado.")
    return evaluacion
