/**
 * Contexto de transacción que puede contener cualquier tipo de repositorio
 * configurado para trabajar dentro de una transacción
 */
export interface TransactionContext {
  [key: string]: any;
}

/**
 * Interfaz para manejar transacciones independiente del ORM utilizado
 */
export interface Transaction {
  /**
   * Ejecuta una operación dentro de una transacción
   * @param operation Función que recibe el contexto de transacción y ejecuta operaciones
   * @returns El resultado de la operación
   */
  run<T>(operation: (tx: TransactionContext) => Promise<T>): Promise<T>;
  
  /**
   * Obtiene un repositorio configurado para trabajar con la transacción actual
   * @param repositoryClass Clase del repositorio a instanciar
   * @param transactionClient Cliente de transacción específico del ORM
   * @returns Instancia del repositorio configurada para la transacción
   */
  getRepository<R>(repositoryClass: new (...args: any[]) => R, ...args: any[]): R;
} 