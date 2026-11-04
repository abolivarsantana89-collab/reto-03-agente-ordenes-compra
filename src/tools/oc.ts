import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

export const ProveedorSchema = z.object({
  nit: z.string(),
  razon_social: z.string(),
  estado: z.enum(["ACTIVO", "INACTIVO"])
});

export function validarYCrearOrdenCompra(solicitudPath: string, maestrosPath: string) {
  let esValido = true;
  let retroactiva = false;
  const motivos: string[] = [];

  if (fs.existsSync(path.join(solicitudPath, "factura.txt"))) {
    retroactiva = true;
    motivos.push("ALERTA COMPLIANCE: Compra retroactiva detectada (factura.txt previa).");
    esValido = false;
  }

  const solicitud = JSON.parse(fs.readFileSync(path.join(solicitudPath, "solicitud.json"), "utf-8"));
  const proveedores = JSON.parse(fs.readFileSync(path.join(maestrosPath, "proveedores.json"), "utf-8"));
  const centrosCosto = JSON.parse(fs.readFileSync(path.join(maestrosPath, "centros-costo.json"), "utf-8"));

  const prov = proveedores.find((p: any) => p.nit === solicitud.nit_proveedor || p.id === solicitud.id_proveedor);
  if (!prov || prov.estado !== "ACTIVO") {
    esValido = false;
    motivos.push("Proveedor inactivo o inexistente.");
  }

  const cc = centrosCosto.find((c: any) => c.id === solicitud.centro_costo || c.codigo === solicitud.centro_costo);
  const monto = solicitud.monto_subtotal || solicitud.monto_total || 0;
  if (cc && monto > cc.tope_aprobacion_usd) {
    esValido = false;
    motivos.push("El monto supera el tope de aprobación.");
  }

  return { esValido, retroactiva, motivos, ordenCompraId: esValido ? `OC-SAP-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined };
}
