import * as fs from "fs";
import * as path from "path";
import { validarYCrearOrdenCompra } from "./tools/oc";

console.log("=================================================");
console.log("   SCRIPT DE VERIFICACIÓN DETERMINISTA - RETO 03");
console.log("=================================================\n");

const baseFixtures = path.join(__dirname, "../fixtures/reto-03");
const solicitudesDir = path.join(baseFixtures, "solicitudes");
const maestrosDir = path.join(baseFixtures, "maestros");

const casos = fs.readdirSync(solicitudesDir).filter(f => f.startsWith("sol-"));

casos.forEach(caso => {
  console.log(`PROCESANDO CASO: ${caso.toUpperCase()}`);
  const resultado = validarYCrearOrdenCompra(path.join(solicitudesDir, caso), maestrosDir);
  if (resultado.retroactiva) {
    console.log("Status: ?? DETENIDO (HUMAN-IN-THE-LOOP REQUERIDO)");
  } else if (resultado.esValido) {
    console.log(`Status: ? ÉXITO - OC CREADA: ${resultado.ordenCompraId}`);
  } else {
    console.log("Status: ? RECHAZADO / DESVIACIÓN DETECTADA");
  }
  console.log("\n");
});
