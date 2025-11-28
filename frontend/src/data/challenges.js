export const challenges = [
  {
    id: 1,
    title: 'Reto 01 – Suma de dos números',
    level: 'básico',
    theme: 'entrada/salida',
    description: 'Escribe un algoritmo en LPP que pida al usuario dos números enteros y muestre en pantalla la suma de ambos.',
    status: 'completado',
    requirements: [
      'Debe usar Lea para las entradas',
      'Debe usar Escriba para la salida',
      'Debe almacenar la suma en una variable llamada resultado'
    ],
    examples: [
      { input: '3 5', output: 'La suma es 8' },
      { input: '10 -4', output: 'La suma es 6' }
    ],
    hints: [
      'Recuerda declarar las variables antes de Inicio',
      'Las instrucciones del programa principal deben ir entre Inicio y Fin',
      'Usa el operador <- para asignar valores a las variables'
    ],
    initialCode: `Entero a, b, resultado
Inicio
  /* Escribe aquí tu solución */
Fin`,
    attempts: 3
  },
  {
    id: 2,
    title: 'Reto 02 – Número par o impar',
    level: 'básico',
    theme: 'condicionales',
    description: 'Crea un algoritmo que lea un número entero y determine si es par o impar.',
    status: 'en progreso',
    requirements: [
      'Debe usar una estructura condicional Si...Entonces...Fin Si',
      'Debe usar el operador mod para verificar el residuo de dividir entre 2',
      'Debe mostrar exactamente "El número es par" o "El número es impar" usando Escriba'
    ],
    examples: [
      { input: '4', output: 'El número es par' },
      { input: '7', output: 'El número es impar' }
    ],
    hints: [
      'Un número es par si (numero mod 2) = 0',
      'Puedes usar: Si (numero mod 2 = 0) Entonces ... Sino ... Fin Si',
      'Asegúrate de que la condición sea booleana'
    ],
    initialCode: `Entero numero
Inicio
  /* Escribe aquí tu solución */
Fin`,
    attempts: 2
  },
  {
    id: 3,
    title: 'Reto 03 – Mayor de tres números',
    level: 'básico',
    theme: 'condicionales',
    description: 'Escribe un algoritmo que lea tres números y muestre cuál es el mayor.',
    status: 'en progreso',
    requirements: [
      'Debe leer exactamente tres números con Lea',
      'Debe usar condicionales anidadas o una variable auxiliar para guardar el mayor',
      'Debe mostrar el mayor de los tres con Escriba'
    ],
    examples: [
      { input: '5 8 3', output: 'El mayor es 8' },
      { input: '15 12 20', output: 'El mayor es 20' }
    ],
    hints: [
      'Compara primero dos números y guarda el mayor en una variable',
      'Luego compara ese resultado con el tercer número',
      'Puedes usar Si...Entonces anidados'
    ],
    initialCode: `Entero a, b, c, mayor
Inicio
  /* Escribe aquí tu solución */
Fin`,
    attempts: 1
  },
  {
    id: 4,
    title: 'Reto 04 – Promedio de calificaciones',
    level: 'básico',
    theme: 'entrada/salida',
    description: 'Crea un algoritmo que calcule el promedio de tres calificaciones.',
    status: 'completado',
    requirements: [
      'Debe leer tres calificaciones usando Lea',
      'Debe calcular el promedio correctamente como un valor real',
      'Debe mostrar el resultado con un mensaje claro usando Escriba'
    ],
    examples: [
      { input: '8 9 7', output: 'El promedio es 8.00' },
      { input: '10 6 9', output: 'El promedio es 8.33' }
    ],
    hints: [
      'El promedio se calcula sumando los valores y dividiendo entre la cantidad',
      'Usa variables tipo Real para mantener los decimales',
      'La fórmula puede ser: promedio <- (cal1 + cal2 + cal3) / 3'
    ],
    initialCode: `Real cal1, cal2, cal3, promedio
Inicio
  /* Escribe aquí tu solución */
Fin`,
    attempts: 1
  },
  {
    id: 5,
    title: 'Reto 05 – Tabla de multiplicar',
    level: 'intermedio',
    theme: 'ciclos',
    description: 'Escribe un algoritmo que muestre la tabla de multiplicar de un número del 1 al 10.',
    status: 'pendiente',
    requirements: [
      'Debe usar un ciclo Para',
      'Debe leer el número del cual mostrar la tabla usando Lea',
      'Debe mostrar 10 líneas con el formato: n x i = resultado'
    ],
    examples: [
      { input: '5', output: '5 x 1 = 5\\n5 x 2 = 10\\n...\\n5 x 10 = 50' }
    ],
    hints: [
      'Usa un ciclo Para que vaya de 1 hasta 10',
      'En cada iteración, multiplica el número por el contador',
      'Usa Escriba para mostrar cada línea de la tabla'
    ],
    initialCode: `Entero numero, i, resultado
Inicio
  /* Escribe aquí tu solución */
Fin`,
    attempts: 0
  },
  {
    id: 6,
    title: 'Reto 06 – Suma de números pares',
    level: 'intermedio',
    theme: 'ciclos',
    description: 'Crea un algoritmo que sume todos los números pares del 1 al 100.',
    status: 'pendiente',
    requirements: [
      'Debe usar un ciclo (Puede ser Para o Mientras)',
      'Debe identificar los números pares usando mod 2',
      'Debe acumular la suma correctamente en una variable'
    ],
    examples: [
      { input: '', output: 'La suma de los pares del 1 al 100 es 2550' }
    ],
    hints: [
      'Usa un ciclo Para desde 1 hasta 100',
      'Dentro del ciclo verifica: Si (i mod 2 = 0) Entonces...',
      'Si es par, suma el valor de i en la variable acumuladora'
    ],
    initialCode: `Entero i, suma
Inicio
  /* Escribe aquí tu solución */
Fin`,
    attempts: 0
  },
  {
    id: 7,
    title: 'Reto 07 – Contador descendente',
    level: 'básico',
    theme: 'ciclos',
    description: 'Escribe un algoritmo que cuente de 10 a 1 de forma descendente.',
    status: 'completado',
    requirements: [
      'Debe usar un ciclo',
      'Debe contar desde 10 hasta 1 de forma descendente',
      'Debe mostrar cada número en una línea usando Escriba'
    ],
    examples: [
      { input: '', output: '10\\n9\\n8\\n7\\n6\\n5\\n4\\n3\\n2\\n1' }
    ],
    hints: [
      'Usa un ciclo Para con contador descendente',
      'La sintaxis puede ser: Para i <- 10 Hasta 1 Haga Con Paso -1',
      'En cada iteración, muestra el valor de i'
    ],
    initialCode: `Entero i
Inicio
  /* Escribe aquí tu solución */
Fin`,
    attempts: 2
  },
  {
    id: 8,
    title: 'Reto 08 – Validar contraseña',
    level: 'intermedio',
    theme: 'condicionales',
    description: 'Crea un algoritmo que valide si una contraseña ingresada es correcta (la contraseña válida es "LPP2024").',
    status: 'pendiente',
    requirements: [
      'Debe leer una contraseña del usuario usando Lea',
      'Debe compararla con el valor fijo "LPP2024"',
      'Debe mostrar "Acceso concedido" o "Acceso denegado"'
    ],
    examples: [
      { input: 'LPP2024', output: 'Acceso concedido' },
      { input: 'abc123', output: 'Acceso denegado' }
    ],
    hints: [
      'Usa una variable tipo Cadena para la contraseña',
      'Compara con el operador =',
      'Usa una estructura Si...Entonces...Sino...Fin Si'
    ],
    initialCode: `Cadena password
Inicio
  /* Escribe aquí tu solución */
Fin`,
    attempts: 0
  },
  {
    id: 9,
    title: 'Reto 09 – Calculadora básica',
    level: 'intermedio',
    theme: 'condicionales',
    description: 'Escribe un algoritmo que funcione como calculadora simple (+, -, *, /).',
    status: 'pendiente',
    requirements: [
      'Debe leer dos números reales y la operación a realizar',
      'Debe realizar la operación correcta según el símbolo (+, -, *, /)',
      'Debe manejar los cuatro operadores básicos y mostrar el resultado con Escriba'
    ],
    examples: [
      { input: '5 + 3', output: 'Resultado: 8' },
      { input: '10 / 2', output: 'Resultado: 5' }
    ],
    hints: [
      'Usa una variable tipo Cadena para el operador',
      'Puedes usar una estructura Caso según el operador',
      'Recuerda verificar que el divisor no sea 0 en la división'
    ],
    initialCode: `Real num1, num2, resultado
Cadena operador
Inicio
  /* Escribe aquí tu solución */
Fin`,
    attempts: 0
  },
  {
    id: 10,
    title: 'Reto 10 – Números primos',
    level: 'avanzado',
    theme: 'ciclos',
    description: 'Crea un algoritmo que determine si un número entero positivo es primo.',
    status: 'pendiente',
    requirements: [
      'Debe leer un número entero positivo',
      'Debe verificar si el número es divisible solo por 1 y por sí mismo',
      'Debe mostrar "Es primo" o "No es primo" según el resultado'
    ],
    examples: [
      { input: '7', output: 'Es primo' },
      { input: '8', output: 'No es primo' }
    ],
    hints: [
      'Un número primo solo es divisible por 1 y por sí mismo',
      'Usa un ciclo para buscar divisores desde 2 hasta numero - 1',
      'Si encuentras un divisor, puedes marcar una bandera y detener el ciclo'
    ],
    initialCode: `Entero numero, i, contador
Inicio
  /* Escribe aquí tu solución */
Fin`,
    attempts: 0
  }
];
