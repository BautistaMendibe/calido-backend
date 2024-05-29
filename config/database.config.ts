import { appConfig } from './app.config';
import { logger } from '../src/logger';
import OracleDB from 'oracledb';
import { setPoolAlias } from 'oracle-sp-types';
import { Message } from '../src/models/Logger';

const dbConfig = { ...appConfig.database };

const conn = async (): Promise<void> => {
  const pool = await OracleDB.createPool({
    user: dbConfig.user,
    password: dbConfig.password,
    connectString: `(DESCRIPTION = (CONNECT_TIMEOUT=10)(RETRY_COUNT=3)(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = ${dbConfig.host})(PORT = ${parseInt(dbConfig.port ?? '1521')})))(CONNECT_DATA =(SERVICE_NAME = ${dbConfig.serviceName})))`,
    poolMin: 1,
    poolIncrement: 1,
    poolTimeout: 60,
    queueMax: -1,
    queueTimeout: 60000,
    enableStatistics: true,
    poolAlias: 'caja'
  });
  logger.info(`Pool created: ${pool.connectionsOpen}`);
}

export const connectDatabase = (): void => {
  conn()
    .then(() => {
      logger.info(`Database connected: ${dbConfig.serviceName ?? '-'} on ${dbConfig.host ?? '-'}`);
      setPoolAlias('caja');
    })
    .catch((error: Message) => {
      logger.error('Error during Data Source initialization');
      logger.error(error);
    });
}
