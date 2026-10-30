const bcrypt = require("bcryptjs");
const readline = require("readline");

const entrada = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

entrada.question("Escribe la contraseña que usarás para el admin: ", async (password) => {
  const hash = await bcrypt.hash(password, 10);
  console.log("Copia este valor en ADMIN_PASSWORD_HASH de .env:");
  console.log(hash);
  entrada.close();
});
