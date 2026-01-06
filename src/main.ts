import 'dotenv/config';
import { createServer } from './server';

const app = createServer();
const port = process.env.APP_PORT || 3000;

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
