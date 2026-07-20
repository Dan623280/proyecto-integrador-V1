import json

from fastapi import (
    APIRouter,
    File,
    Form,
    Header,
    HTTPException,
    UploadFile
)
from pydantic import BaseModel, Field

from app.ai.gemini_service import (
    GeminiAPIError,
    evaluar_codigo,
    generar_proyecto
)
from app.database import obtener_conexion


router = APIRouter(
    prefix="/ai",
    tags=["Inteligencia Artificial"]
)


class ProjectRequest(BaseModel):
    usuario_id: int = Field(gt=0)
    dificultad: str


class AcceptedProjectRequest(BaseModel):
    usuario_id: int = Field(gt=0)
    nombre: str = Field(min_length=2, max_length=180)
    descripcion: str = Field(min_length=2)
    dificultad: str
    duracion_estimada: str | None = None
    objetivo: str | None = None
    requisitos: list[str] = Field(min_length=1)
    archivos: list[str] = Field(min_length=1)


def normalizar_dificultad(valor: str) -> str:
    dificultades = {
        "junior": "Junior",
        "facil": "Junior",
        "fácil": "Junior",

        "semi senior": "Semi Senior",
        "semisenior": "Semi Senior",
        "intermedio": "Semi Senior",

        "senior": "Senior",
        "avanzado": "Senior"
    }

    dificultad = dificultades.get(
        valor.strip().lower()
    )

    if dificultad is None:
        raise HTTPException(
            status_code=400,
            detail="La dificultad no es válida."
        )

    return dificultad


@router.post("/projects/generate")
def generar_propuesta(
    payload: ProjectRequest,
    x_gemini_api_key: str = Header(...)
):
    dificultad = normalizar_dificultad(
        payload.dificultad
    )

    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        # Verificar usuario
        cursor.execute(
            """
            SELECT id
            FROM usuarios
            WHERE id = %s;
            """,
            (payload.usuario_id,)
        )

        if cursor.fetchone() is None:
            raise HTTPException(
                status_code=404,
                detail="El usuario no existe."
            )

        # Consultar proyectos anteriores para pedirle a la IA
        # que no repita nombres.
        cursor.execute(
            """
            SELECT nombre
            FROM proyectos
            WHERE usuario_id = %s;
            """,
            (payload.usuario_id,)
        )

        nombres_anteriores = [
            fila[0]
            for fila in cursor.fetchall()
        ]

        proyecto = None

        # Intentar hasta tres veces evitar repeticiones.
        for _ in range(3):
            proyecto_generado = generar_proyecto(
                dificultad=dificultad,
                api_key=x_gemini_api_key,
                proyectos_excluidos=nombres_anteriores
            )

            nombre_nuevo = (
                proyecto_generado["nombre"]
                .strip()
                .lower()
            )

            nombres_normalizados = {
                nombre.strip().lower()
                for nombre in nombres_anteriores
            }

            if nombre_nuevo not in nombres_normalizados:
                proyecto = proyecto_generado
                break

        if proyecto is None:
            raise HTTPException(
                status_code=409,
                detail=(
                    "La IA repitió proyectos anteriores. "
                    "Intenta generar nuevamente."
                )
            )

        proyecto["usuario_id"] = payload.usuario_id
        proyecto["dificultad"] = dificultad
        proyecto["estado"] = "propuesto"

        return {
            "success": True,
            "message": "La IA generó una propuesta. Se guardará al aceptarla.",
            "proyecto": proyecto
        }

    except HTTPException:
        if conexion:
            conexion.rollback()

        raise

    except GeminiAPIError as error:
        if conexion:
            conexion.rollback()

        raise HTTPException(
            status_code=503,
            detail=str(error)
        ) from error

    except Exception as error:
        if conexion:
            conexion.rollback()

        print(
            "Error al generar el proyecto:",
            repr(error)
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        ) from error

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@router.get("/projects/user/{usuario_id}")
def obtener_proyectos_usuario(
    usuario_id: int
):
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute(
            """
            SELECT
                id,
                usuario_id,
                nombre,
                descripcion,
                dificultad,
                duracion_estimada,
                objetivo,
                requisitos,
                archivos,
                estado,
                fecha_creacion,
                fecha_actualizacion,
                evaluacion.calificacion,
                evaluacion.fecha_evaluacion
            FROM proyectos
            LEFT JOIN LATERAL (
                SELECT
                    evaluaciones.calificacion,
                    evaluaciones.fecha_evaluacion
                FROM entregas
                INNER JOIN evaluaciones
                    ON evaluaciones.entrega_id = entregas.id
                WHERE entregas.proyecto_id = proyectos.id
                ORDER BY evaluaciones.fecha_evaluacion DESC
                LIMIT 1
            ) AS evaluacion ON TRUE
            WHERE usuario_id = %s
              AND estado IN ('aceptado', 'entregado', 'evaluado')
            ORDER BY fecha_creacion DESC;
            """,
            (usuario_id,)
        )

        proyectos = []

        for fila in cursor.fetchall():
            proyectos.append({
                "id": fila[0],
                "usuario_id": fila[1],
                "nombre": fila[2],
                "descripcion": fila[3],
                "dificultad": fila[4],
                "duracion_estimada": fila[5],
                "objetivo": fila[6],
                "requisitos": fila[7],
                "archivos": fila[8],
                "estado": fila[9],
                "fecha_creacion": (
                    fila[10].isoformat()
                ),
                "fecha_actualizacion": (
                    fila[11].isoformat()
                ),
                "calificacion": (
                    float(fila[12]) if fila[12] is not None else None
                ),
                "fecha_evaluacion": (
                    fila[13].isoformat() if fila[13] else None
                )
            })

        return {
            "success": True,
            "proyectos": proyectos
        }

    except Exception as error:
        print(
            "Error consultando proyectos:",
            repr(error)
        )

        raise HTTPException(
            status_code=500,
            detail="No se pudieron consultar los proyectos."
        ) from error

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@router.patch("/projects/{proyecto_id}/accept")
def aceptar_proyecto(
    proyecto_id: int
):
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute(
            """
            UPDATE proyectos
            SET
                estado = 'aceptado',
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = %s
              AND estado != 'rechazado'
            RETURNING
                id,
                estado,
                fecha_actualizacion;
            """,
            (proyecto_id,)
        )

        fila = cursor.fetchone()

        if fila is None:
            raise HTTPException(
                status_code=404,
                detail=(
                    "Proyecto no encontrado o rechazado."
                )
            )

        conexion.commit()

        return {
            "success": True,
            "proyecto": {
                "id": fila[0],
                "estado": fila[1],
                "fecha_actualizacion": (
                    fila[2].isoformat()
                )
            }
        }

    except HTTPException:
        if conexion:
            conexion.rollback()

        raise

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@router.post("/projects/accept")
def guardar_proyecto_aceptado(payload: AcceptedProjectRequest):
    dificultad = normalizar_dificultad(payload.dificultad)
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT id FROM usuarios WHERE id = %s;", (payload.usuario_id,))
        if cursor.fetchone() is None:
            raise HTTPException(status_code=404, detail="El usuario no existe.")

        cursor.execute(
            """
            INSERT INTO proyectos (
                usuario_id, nombre, descripcion, dificultad, duracion_estimada,
                objetivo, requisitos, archivos, estado
            ) VALUES (%s, %s, %s, %s, %s, %s, %s::jsonb, %s::jsonb, 'aceptado')
            RETURNING id, estado, fecha_creacion, fecha_actualizacion;
            """,
            (
                payload.usuario_id, payload.nombre.strip(), payload.descripcion.strip(),
                dificultad, payload.duracion_estimada, payload.objetivo,
                json.dumps(payload.requisitos, ensure_ascii=False),
                json.dumps(payload.archivos, ensure_ascii=False)
            )
        )
        fila = cursor.fetchone()
        conexion.commit()
        return {
            "success": True,
            "message": "Proyecto aceptado y guardado.",
            "proyecto": {
                "id": fila[0], "estado": fila[1],
                "fecha_creacion": fila[2].isoformat(),
                "fecha_actualizacion": fila[3].isoformat()
            }
        }
    except HTTPException:
        if conexion:
            conexion.rollback()
        raise
    except Exception as error:
        if conexion:
            conexion.rollback()
        print("Error guardando proyecto aceptado:", repr(error))
        raise HTTPException(status_code=500, detail="No se pudo guardar el proyecto aceptado.") from error
    finally:
        if cursor:
            cursor.close()
        if conexion:
            conexion.close()


@router.patch("/projects/{proyecto_id}/reject")
def rechazar_proyecto(
    proyecto_id: int
):
    conexion = None
    cursor = None

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute(
            """
            UPDATE proyectos
            SET
                estado = 'rechazado',
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING
                id,
                estado,
                fecha_actualizacion;
            """,
            (proyecto_id,)
        )

        fila = cursor.fetchone()

        if fila is None:
            raise HTTPException(
                status_code=404,
                detail="Proyecto no encontrado."
            )

        conexion.commit()

        return {
            "success": True,
            "proyecto": {
                "id": fila[0],
                "estado": fila[1],
                "fecha_actualizacion": (
                    fila[2].isoformat()
                )
            }
        }

    except HTTPException:
        if conexion:
            conexion.rollback()

        raise

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()


@router.post("/evaluate")
async def entregar_y_evaluar(
    proyecto_id: int = Form(...),
    archivos: list[UploadFile] = File(...),
    x_gemini_api_key: str = Header(...)
):
    conexion = None
    cursor = None

    if not archivos:
        raise HTTPException(status_code=400, detail="Debes seleccionar al menos un archivo.")
    if len(archivos) > 10:
        raise HTTPException(status_code=400, detail="Puedes entregar como máximo 10 archivos.")

    contenidos = []
    total_bytes = 0
    for archivo in archivos:
        contenido_bytes = await archivo.read()
        if not contenido_bytes:
            raise HTTPException(status_code=400, detail=f"El archivo {archivo.filename or 'sin nombre'} está vacío.")
        total_bytes += len(contenido_bytes)
        if len(contenido_bytes) > 1_000_000 or total_bytes > 3_000_000:
            raise HTTPException(status_code=413, detail="Cada archivo debe pesar máximo 1 MB y el total máximo es 3 MB.")
        try:
            contenido = contenido_bytes.decode("utf-8")
        except UnicodeDecodeError as error:
            raise HTTPException(status_code=400, detail=f"El archivo {archivo.filename or 'sin nombre'} debe ser texto UTF-8.") from error
        contenidos.append((archivo.filename or "archivo_sin_nombre", contenido))

    nombres_archivos = [nombre for nombre, _ in contenidos]
    codigo = "\n\n".join(
        f"===== ARCHIVO: {nombre} =====\n{contenido}\n===== FIN: {nombre} ====="
        for nombre, contenido in contenidos
    )

    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()

        cursor.execute(
            """
            SELECT
                id,
                nombre,
                descripcion,
                dificultad,
                duracion_estimada,
                objetivo,
                requisitos,
                archivos,
                estado
            FROM proyectos
            WHERE id = %s;
            """,
            (proyecto_id,)
        )

        fila = cursor.fetchone()

        if fila is None:
            raise HTTPException(
                status_code=404,
                detail="El proyecto no existe."
            )

        proyecto = {
            "id": fila[0],
            "nombre": fila[1],
            "descripcion": fila[2],
            "dificultad": fila[3],
            "duracion_estimada": fila[4],
            "objetivo": fila[5],
            "requisitos": fila[6],
            "archivos": fila[7],
            "estado": fila[8]
        }

        if proyecto["estado"] == "rechazado":
            raise HTTPException(
                status_code=409,
                detail=(
                    "No puedes entregar un proyecto rechazado."
                )
            )

        evaluacion_ia = evaluar_codigo(
            codigo=codigo,
            nombre_archivo=", ".join(nombres_archivos),
            proyecto=proyecto,
            api_key=x_gemini_api_key
        )

        reporte_completo = json.dumps(
            {
                "reporte": evaluacion_ia["reporte"],
                "fortalezas": evaluacion_ia.get(
                    "fortalezas",
                    []
                ),
                "aspectos_mejorar": evaluacion_ia.get(
                    "aspectos_mejorar",
                    []
                ),
                "requisitos_cumplidos": evaluacion_ia.get(
                    "requisitos_cumplidos",
                    []
                ),
                "requisitos_no_cumplidos": evaluacion_ia.get(
                    "requisitos_no_cumplidos",
                    []
                )
            },
            ensure_ascii=False
        )

        cursor.execute(
            """
            INSERT INTO entregas (
                proyecto_id,
                nombre_archivo,
                contenido_codigo
            )
            VALUES (%s, %s, %s)
            RETURNING
                id,
                fecha_entrega;
            """,
            (
                proyecto_id,
                ", ".join(nombres_archivos),
                codigo
            )
        )

        entrega = cursor.fetchone()

        cursor.execute(
            """
            INSERT INTO evaluaciones (
                entrega_id,
                reporte,
                calificacion
            )
            VALUES (%s, %s, %s)
            RETURNING
                id,
                fecha_evaluacion;
            """,
            (
                entrega[0],
                reporte_completo,
                evaluacion_ia["calificacion"]
            )
        )

        evaluacion = cursor.fetchone()

        cursor.execute(
            """
            UPDATE proyectos
            SET
                estado = 'evaluado',
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = %s;
            """,
            (proyecto_id,)
        )

        conexion.commit()

        return {
            "success": True,
            "message": (
                "Proyecto entregado y evaluado."
            ),
            "entrega": {
                "id": entrega[0],
                "nombre_archivo": ", ".join(nombres_archivos),
                "archivos": nombres_archivos,
                "fecha_entrega": (
                    entrega[1].isoformat()
                )
            },
            "evaluacion": {
                "id": evaluacion[0],
                "calificacion": (
                    evaluacion_ia["calificacion"]
                ),
                "reporte": evaluacion_ia["reporte"],
                "fortalezas": evaluacion_ia.get(
                    "fortalezas",
                    []
                ),
                "aspectos_mejorar": evaluacion_ia.get(
                    "aspectos_mejorar",
                    []
                ),
                "requisitos_cumplidos": evaluacion_ia.get(
                    "requisitos_cumplidos",
                    []
                ),
                "requisitos_no_cumplidos": evaluacion_ia.get(
                    "requisitos_no_cumplidos",
                    []
                ),
                "fecha_evaluacion": (
                    evaluacion[1].isoformat()
                )
            }
        }

    except HTTPException:
        if conexion:
            conexion.rollback()

        raise

    except GeminiAPIError as error:
        if conexion:
            conexion.rollback()

        raise HTTPException(
            status_code=503,
            detail=str(error)
        ) from error

    except Exception as error:
        if conexion:
            conexion.rollback()

        print(
            "Error entregando proyecto:",
            repr(error)
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        ) from error

    finally:
        if cursor:
            cursor.close()

        if conexion:
            conexion.close()
