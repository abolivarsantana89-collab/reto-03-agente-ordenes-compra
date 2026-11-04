# Documentación Técnica - Solución Reto 3
**Candidato:** Andrea Bolívar Santana | Ingeniera Industrial & Consultora de Procesos

---

## 1. Arquitectura de la Solución y Ciclo del Agente
La solución implementa un Agente Conversacional e Integrador SAP diseñado con TypeScript y Node/Bun:
- **System Prompt (`agent/prompt.md`):** Gobierna las reglas estrictas de verificación previa y control de compliance.
- **Herramientas Tipadas (`src/tools/oc.ts`):** Validaciones estructuradas Zod sobre los esquemas de datos maestros.
- **Script Determinista (`src/demo.ts`):** Ejecuta la lógica completa de los 6 casos de prueba (`sol-001` a `sol-006`) sin requerir LLM, garantizando determinismo.

---

## 2. Matriz de Controles Implementada
- **Proveedor:** El NIT debe existir y estar `ACTIVO` en `proveedores.json`.
- **Centro de Costos y Topes:** Verificación contra `centros-costo.json` para garantizar que el monto no exceda el límite del aprobador.
- **Alerta Retroactividad:** Detección de `factura.txt` previa a la Orden de Compra para enviar a revisión humana.

---

## 3. Análisis Crítico: Compras Retroactivas (Caso `sol-005`)
La emisión de facturas previa a la Orden de Compra ("Procure-to-Pay Bypass") genera fallas graves de cumplimiento contable y riesgo en auditoría. El agente suspende la emisión automática e involucra un flujo **Human-in-the-Loop** para requerir justificación de dirección.

---

## 4. Adaptador SAP para Producción
En un entorno productivo S/4HANA, la integración se realizará mediante BAPIs nativas (`BAPI_PO_CREATE1`) y servicios OData (`API_BUSINESS_PARTNER`), implementando patrones de resiliencia e idempotencia.
