export interface IFilesService {
  almacenarArchivo(file: Express.Multer.File): Promise<{ nombreArchivo: string; fileId: number }>;
  recuperarArchivo(fileName: string): Promise<Buffer | null>;
}
